#ifdef WIN32
#include <windows.h>
#endif
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/time.h>
#include <stdbool.h>
#include <pthread.h>
#include "hidapi.h"
#include "uf2hid.h"

#define EP_SIZE 64

typedef struct {
    hid_device *dev;
    uint16_t size;
    uint8_t serial;
    uint16_t seqNo;
    uint16_t pageSize;
    uint32_t flashSize;
    uint32_t msgSize;
    union {
        uint8_t buf[64 * 1024];
        HF2_Response resp;
    };
} HID_Dev;

uint64_t millis() {
    struct timeval tv;
    gettimeofday(&tv, 0);
    return tv.tv_sec * 1000 + tv.tv_usec / 1000;
}

void fatal(const char *msg) {
    fprintf(stderr, "Fatal error: %s\n", msg);
    exit(1);
}

void write16(uint8_t *ptr, uint16_t v) {
    ptr[0] = v;
    ptr[1] = v >> 8;
}

void write32(uint8_t *ptr, uint32_t v) {
    ptr[0] = v;
    ptr[1] = v >> 8;
    ptr[2] = v >> 16;
    ptr[3] = v >> 24;
}

uint32_t read32(uint8_t *ptr) { return ptr[0] | (ptr[1] << 8) | (ptr[2] << 16) | (ptr[3] << 24); }

uint32_t read16(uint8_t *ptr) { return ptr[0] | (ptr[1] << 8); }

int recv_hid(HID_Dev *pkt, int timeout) {
    uint8_t buf0[EP_SIZE + 1];
    uint8_t *buf;

    pkt->size = 0;
    memset(pkt->buf, 0, sizeof(pkt->buf));

    for (;;) {
        int sz = hid_read_timeout(pkt->dev, buf0, sizeof(buf0), timeout);
        if (sz <= 0) {
            if (timeout < 0)
                fatal("read error");
            return 0;
        }
        buf = buf0;
        if (!*buf)
            buf++; // skip report number if passed

        uint8_t tag = buf[0];
        if (pkt->size && (tag & HF2_FLAG_SERIAL_OUT))
            fatal("invalid serial transfer");
        uint32_t newsize = pkt->size + (tag & HF2_SIZE_MASK);
        if (newsize > sizeof(pkt->buf))
            fatal("too large packet");
        memcpy(pkt->buf + pkt->size, buf + 1, tag & HF2_SIZE_MASK);
        pkt->size = newsize;

        tag &= HF2_FLAG_MASK;
        if (tag != HF2_FLAG_CMDPKT_BODY) {
            pkt->serial = //
                tag == HF2_FLAG_SERIAL_OUT ? 1 : tag == HF2_FLAG_SERIAL_ERR ? 2 : 0;
            return 1;
        }

        timeout = -1; // next read is blocking
    }
}

void send_hid(hid_device *dev, const void *data, int size) {
    uint8_t buf[EP_SIZE + 1] = {0};
    const uint8_t *ptr = data;

    for (;;) {
        int s;
        if (size <= EP_SIZE - 1) {
            s = size;
            buf[1] = HF2_FLAG_CMDPKT_LAST | size;
        } else {
            s = EP_SIZE - 1;
            buf[1] = HF2_FLAG_CMDPKT_BODY | (EP_SIZE - 1);
        }
        memcpy(buf + 2, ptr, s);
        int sz = hid_write(dev, buf, EP_SIZE + 1);
        if (sz != EP_SIZE + 1)
            fatal("write error");
        ptr += s;
        size -= s;
        if (!size)
            break;
    }
}

void talk_hid(HID_Dev *pkt, int cmd, const void *data, uint32_t len) {
    if (len >= sizeof(pkt->buf) - 8)
        fatal("buffer overflow");
    if (data)
        memcpy(pkt->buf + 8, data, len);
    write32(pkt->buf, cmd);
    write16(pkt->buf + 4, ++pkt->seqNo);
    write16(pkt->buf + 6, 0);
    send_hid(pkt->dev, pkt->buf, 8 + len);

    if (cmd == HF2_CMD_RESET_INTO_APP)
        return; // no response expected

    recv_hid(pkt, -1);
    if (read16(pkt->buf) != pkt->seqNo)
        fatal("invalid sequence number");
    if (read16(pkt->buf + 2))
        fatal("invalid status");
}

uint8_t flashbuf[2 * 1024 * 1024];

unsigned short add_crc(char ptr, unsigned short crc) {
    unsigned short cmpt;
    crc = crc ^ (int)ptr << 8;
    for (cmpt = 0; cmpt < 8; cmpt++) {
        if (crc & 0x8000)
            crc = crc << 1 ^ 0x1021;
        else
            crc = crc << 1;
    }
    return (crc & 0xFFFF);
}

void verify(HID_Dev *cmd, uint8_t *buf, int size, int offset) {
    int maxSize = (cmd->pageSize / 2 - 12) * cmd->pageSize;
    while (size > maxSize) {
        verify(cmd, buf, maxSize, offset);
        buf += maxSize;
        offset += maxSize;
        size -= maxSize;
    }
    int numpages = size / cmd->pageSize;
    write32(cmd->buf + 8, offset);
    write32(cmd->buf + 12, numpages);
    talk_hid(cmd, HF2_CMD_CHKSUM_PAGES, 0, 8);
    for (int i = 0; i < numpages; ++i) {
        int sum = read16(cmd->buf + 4 + i * 2);
        uint16_t crc = 0;
        for (int j = 0; j < cmd->pageSize; ++j) {
            crc = add_crc(buf[j], crc);
        }
        if (sum != crc)
            fatal("verification failed");
        buf += cmd->pageSize;
    }
}

void *forward_stdin(void *cmd0) {
    uint8_t buf[EP_SIZE + 1];
    HID_Dev *cmd = cmd0;
    for (;;) {
        memset(buf, 0, sizeof(buf));
        int sz = read(0, buf + 2, EP_SIZE - 1);
        if (sz > 0) {
            buf[1] = HF2_FLAG_SERIAL_OUT | sz;
            hid_write(cmd->dev, buf, EP_SIZE + 1);
        }
        if (sz == 0)
            break;
    }
    return NULL;
}

void serial(HID_Dev *cmd) {
    pthread_t stdinFwd;
    pthread_create(&stdinFwd, NULL, forward_stdin, cmd);
    for (;;) {
        if (recv_hid(cmd, -1)) {
            if (cmd->serial)
                write(cmd->serial, cmd->buf, cmd->size);
        }
    }
}

int main(int argc, char *argv[]) {
    int res;
    HID_Dev cmd = {0};

    if (argc != 2) {
        printf("usage: %s COMMAND [ARGUMENTS...]\n", argv[0]);
        printf("Commands include:\n");
        printf("   serial           - run 'serial' port forwarding\n");
        printf("   list             - list devices\n");
        printf("   dmesg            - dump internal runtime logs from the device\n");
        printf("   info             - dump information about the device\n");
        printf("   FILE             - write specified BIN or UF2 file\n");
        printf("   random           - write randomly generated bin file\n");
        return 1;
    }

    const char *filename = argv[1];

    // Initialize the hidapi library
    res = hid_init();

    bool listMode = strcmp(filename, "list") == 0;

    struct hid_device_info *devs = hid_enumerate(0, 0);
    for (struct hid_device_info *p = devs; p; p = p->next) {
        int isOK = (p->release_number & 0xff00) == 0x4200;
        const char *path = strstr(p->path, "@1400");
        if (!path)
            path = p->path;
        if (listMode) {
            // exclude Apple devices
            if (p->vendor_id != 0x05ac)
                printf("%s: %04x:%04x %04x %s\n", isOK ? "HF2" : "...", p->vendor_id, p->product_id,
                       p->release_number, path);
        }
        if (isOK) {
            cmd.dev = hid_open_path(p->path);
        }
    }
    hid_free_enumeration(devs);
    if (listMode)
        return 0;
    if (!cmd.dev) {
        printf("no devices\n");
        return 1;
    }

    if (strcmp(filename, "serial") == 0) {
        serial(&cmd);
        return 0;
    }

    if (strcmp(filename, "dmesg") == 0) {
        talk_hid(&cmd, HF2_CMD_DMESG, 0, 0);
        printf("%s\n", cmd.buf + 4);
        return 0;
    }

    talk_hid(&cmd, HF2_CMD_INFO, 0, 0);
    printf("INFO: %s\n", cmd.buf + 4);

    talk_hid(&cmd, HF2_CMD_START_FLASH, 0, 0);

    talk_hid(&cmd, HF2_CMD_BININFO, 0, 0);
    if (cmd.buf[4] != HF2_MODE_BOOTLOADER)
        fatal("not bootloader");

    cmd.pageSize = read32(cmd.buf + 8);
    cmd.flashSize = read32(cmd.buf + 12) * cmd.pageSize;
    cmd.msgSize = read32(cmd.buf + 16);
    printf("page size: %d, total: %dkB\n", cmd.pageSize, cmd.flashSize / 1024);

    if (strcmp(filename, "info") == 0) {
        return 0;
    }

    int i;
    size_t filesize;
    int isUF2 = 0;

    if (strcmp(filename, "random") == 0) {
        srand(millis());
        filesize = 230 * 1024;
        for (i = 0; i < filesize; ++i)
            flashbuf[i] = rand();
    } else {
        FILE *f = fopen(filename, "rb");
        if (!f) {
            fatal("cannot open file");
        }
        int len = 1;
        filesize = 0;
        while (len) {
            len = fread(flashbuf + filesize, 1, sizeof(flashbuf) - filesize, f);
            filesize += len;
        }
        if (strncmp((const char *)flashbuf, "UF2\nWQ]\x9E", 8) == 0) {
            printf("detected UF2 file\n");
            if (cmd.pageSize != 256)
                fatal("wrong page size");
            isUF2 = 1;
        } else {
            filesize = (filesize + (cmd.pageSize - 1)) / cmd.pageSize * cmd.pageSize;
        }
        printf("read %ld bytes from %s\n", filesize, filename);
        fclose(f);
    }

    uint64_t start = millis();
    uint32_t addr = 0x2000;
    uint32_t blockSize = cmd.pageSize;

    if (isUF2)
        blockSize = 512;

    for (i = 0; i < filesize; i += blockSize) {
        if (isUF2) {
            addr = read32(flashbuf + i + 12);
            memcpy(cmd.buf + 12, flashbuf + i + 32, cmd.pageSize);
        } else {
            memcpy(cmd.buf + 12, flashbuf + i, cmd.pageSize);
        }
        write32(cmd.buf + 8, addr);
        talk_hid(&cmd, HF2_CMD_WRITE_FLASH_PAGE, 0, cmd.pageSize + 4);
        addr += cmd.pageSize;
    }

    printf("time: %d\n", (int)(millis() - start));
    start = millis();

#if 0
    for (i = 0; i < filesize; i += cmd.pageSize) {
        write32(cmd.buf + 8, i + 0x2000);
        write32(cmd.buf + 12, cmd.pageSize / 4);
        talk_hid(&cmd, HF2_CMD_MEM_READ_WORDS, 0, 8);
        if (memcmp(cmd.buf + 4, flashbuf + i, cmd.pageSize)) {
            printf("%d,%d,%d != %d?\n", cmd.buf[8], cmd.buf[9], cmd.buf[10], flashbuf[i]);
            fatal("verification failed");
        }
    }
#else
    if (!isUF2)
        verify(&cmd, flashbuf, filesize, 0x2000);
#endif

    printf("verify time: %d\n", (int)(millis() - start));

    talk_hid(&cmd, HF2_CMD_RESET_INTO_APP, 0, 0);

    printf("device reset.\n");

    // Finalize the hidapi library
    res = hid_exit();

    return 0;
}
