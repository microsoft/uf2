# HID Flashing Format

HF2 (HID Flashing Format) is a protocol and message format intended for
communication with embedded devices. Basic functions supported include:

* serial communication for `printf()` debugging etc.
* flashing (updating device firmware)
* debugger interfaces

It is optimized for packet formats, where packets are around 64 bytes long.
It will work for smaller packets, of at least a few bytes, or bigger
ones, but be less efficient.

In particular, it is suitable for running over USB HID (Human Interface Device),
which is widely supported in various operating systems without the need for kernel-space
drivers. It is also possible to run the protocol over a WebUSB link with either a single
interrupt endpoint or two bulk endpoints, as well as using just the control pipe,
allowing direct access from supported browsers. 

## Raw message format

HF2 messages are composed of packets. Packets are up to 64 bytes long.
Messages sent from host to device and vice versa have the same basic format.

The first byte of each packet indicates:
* length of the remaining data (payload) in the packet, in the lower 6 bits, i.e., between 0 and 63 inclusive
* the type of the packet, in the two high bits.

| Bit 7 | Bit 6 | Hex  | Meaning
|-------|-------|------|----------------------------------------------
| 0     | 0     | 0x00 | Inner packet of a command message
| 0     | 1     | 0x40 | Final packet of a command message
| 1     | 0     | 0x80 | Serial `stdout`
| 1     | 1     | 0xC0 | Serial `stderr`

Serial messages are thus between 0 and 63 bytes in length.

Command messages can have any length (though devices will typically limit
it to the native flash page size + 64 bytes). They consist of a zero or more
inner packets, followed by a single final packet. Any of these packets
can carry between 0 and 63 bytes of payload.

For example:

```
Packet 0: 83 01 02 03 AB FF FF FF
Packet 1: 85 04 05 06 07 08
Packet 2: 80 DE 42 42 42 42 FF FF
Packet 3: D0 09 0A 0B 0C 0D 0E 0F 10 11 12 13 14 15 16 17 FF FF FF
--->
Decoded: 01 02 03 04 05 06 07 08 D0 09 0A 0B 0C 0D 0E 0F 10 11 12 13 14 15 16 17
```

Note that packets can be longer than the first byte requires (packets 0, 2, and 3 are).
The additional data should be discarded.
This is due to various HID implementations imposing an exact 64 byte packet size.

Different command messages cannot be interleaved.

Serial messages should not be interleaved with command messages (though it would be
technically possible).

## Higher-level message format

### Serial messages

Serial messages are meant for `printf()` style debugging
and general simple data output from the device.
If the device supports only one serial channel, it should support
the `stdout` channel. Otherwise, `stdout` is meant
for data output (eg., logging measurements), and `stderr`
is meant for `printf()` debugging.

The logging application on the host may choose to send these
two channels into a single output stream.

Serial messages contain between `0` and `63` bytes of payload data. 
Size of `0` can be used as a keep-alive packet if needed.

### Command messages

Command structure:

```c
struct Command {
    uint32_t command_id;
    uint16_t tag;
    uint8_t reserved0;
    uint8_t reserved1;
    uint8_t data[...];
};

struct Response {
    uint16_t tag;
    uint8_t status;
    uint8_t status_info;
    uint8_t data[...];
};
```

All words in HF2 are little endian.

The `tag` is an arbitrary number set by the host, for example as sequence 
number. The response should repeat the `tag`.

The two reserved bytes in the command should be sent as zero and ignored by the device.

The response status is one of the following:
* `0x00` - command understood and executed correctly
* `0x01` - command not understood
* `0x02` - command execution error

Note, that embedded devices might crash on invalid arguments, instead
of returning errors. OTOH, the devices should always handle invalid commands with
`0x01` status.

In case of non-zero status, the `status_info` field can contain additional information.

The host shall not send a new command, until the previous one was responded to.
TODO does this make sense? maybe just let USB flow control handle this?

## Standard commands

Below we list standard commands. Not all commands have to be supported by all
devices.

When the C fragment states `no results`, it means just a response
with zero status and no additional data should be expected.

### BININFO (0x0001)

This command states the current mode of the device:
* ``mode == 0x01`` - bootloader, and thus flashing of user-space programs is allowed
* ``mode == 0x02`` - user-space mode.
It also returns the size of flash page size (flashing needs to be done on page-by-page basis),
and the maximum size of message. It is always the case that 
``max_message_size >= flash_page_size + 64``.

```c
struct HF2_BININFO_Result {
    uint32_t mode;
    uint32_t flash_page_size;
    uint32_t flash_num_pages;
    uint32_t max_message_size;
    uint32_t family_id; // optional
};
```

### INFO (0x0002)

Various device information. 
The result is a character array. See `INFO_UF2.TXT` in UF2 format for details.

```c
// no arguments
struct HF2_INFO_Result {
    uint8_t info[...];
};
```


### RESET INTO APP (0x0003)

Reset the device into user-space app. Usually, no response at all will arrive for this command.

```c
// no arguments, no result
```


### RESET INTO (0x0004)

Reset the device into bootloader, usually for flashing. Usually, no response at all will arrive for this command.

```c
// no arguments, no result
```

### START FLASH (0x0005)

When issued in bootloader mode, it has no effect.
In user-space mode it causes handover to bootloader.
A `BININFO` command can be issued to verify that.

```c
// no arguments, no result
```

### WRITE FLASH PAGE (0x0006)

Write a single page of flash memory.

```c
struct HF2_WRITE_FLASH_PAGE_Command {
    uint32_t target_addr;
    uint8_t data[flash_page_size];
};
// no result
```

### CHKSUM PAGES (0x0007)

Compute checksum of a number of pages.
Maximum value for ``num_pages`` is ``max_message_size / 2 - 2``.
The checksum algorithm used is CRC-16-CCITT.

```c
struct HF2_CHKSUM_PAGES_Command {
    uint32_t target_addr;
    uint32_t num_pages;
};
struct HF2_CHKSUM_PAGES_Result {
    uint16_t chksums[0 /* num_pages */];
};
```

### READ WORDS (0x0008)

Read a number of words from memory. 
Memory is read word by word (and not byte by byte), and ``target_addr`` must
be suitably aligned. This is to support reading of special IO regions.

```c
struct HF2_READ_WORDS_Command {
    uint32_t target_addr;
    uint32_t num_words;
};
struct HF2_READ_WORDS_Result {
    uint32_t words[num_words];
};
```

### WRITE WORDS (0x0009)

Dual of READ WORDS, with the same constraints.

```c
struct HF2_WRITE_WORDS_Command {
    uint32_t target_addr;
    uint32_t num_words;
    uint32_t words[num_words];
};
// no result
```

### DMESG (0x0010)

Return internal log buffer if any.
The result is a character array.

```c
// no arguments
struct HF2_DMESG_Result {
    uint8_t logs[...];
};
```


## Extensibility

The HF2 protocol is easy to extend with new command messages.  The command ids
you introduce should be chosen at random.  This ensures very low probability of
conflict between different extensions.

While numbers like `0x42420123`, `0x10001`, or `0xdeaff00d` may look random,
others are likely to use them as well and a conflict might occur.
Please also do not use numbers below `0xffff`, as these are standardized here.
Ideally, use one of the following commands (or similar) to generate a random number:

```bash
node -p "require('crypto').randomBytes(4).toString('hex')"
# or slightly worse:
printf "%04x%04x\n" $RANDOM $RANDOM
```

If you change the behavior of a command, even just extend what it can do, and
there is even a remote possibility of devices or interface applications using
it in the wild, it's best to introduce a new command, and possibly have the
device handle both (fall-through `switch` cases are useful here).

## Detection of HF2 devices

## Notes

If the device exposes both HID and WebUSB, it has to use two separate
interfaces. 

