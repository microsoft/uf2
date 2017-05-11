#!/usr/bin/env python3
import sys
import struct
import subprocess
import re
import os
import os.path
import argparse


UF2_MAGIC_START0 = 0x0A324655 # "UF2\n"
UF2_MAGIC_START1 = 0x9E5D5157 # Randomly selected
UF2_MAGIC_END    = 0x0AB16F30 # Ditto

INFO_FILE = "/INFO_UF2.TXT"

appstartaddr = 0x2000


def is_uf2(buf):
    w = struct.unpack("<II", buf[0:8])
    return w[0] == UF2_MAGIC_START0 and w[1] == UF2_MAGIC_START1


def convert_from_uf2(buf):
    numblocks = len(buf) // 512
    curraddr = None
    outp = b""
    for blockno in range(numblocks):
        ptr = blockno * 512
        block = buf[ptr:ptr + 512]
        hd = struct.unpack(b"<IIIIIIII", block[0:32])
        if hd[0] != UF2_MAGIC_START0 or hd[1] != UF2_MAGIC_START1:
            print("Skipping block at " + ptr + "; bad magic")
            continue
        if hd[2] & 1:
            # NO-flash flag set; skip block
            continue
        datalen = hd[4]
        if datalen > 476:
            assert False, "Invalid UF2 data size at " + ptr
        newaddr = hd[3]
        if curraddr == None:
            appstartaddr = newaddr
            curraddr = newaddr
        padding = newaddr - curraddr
        if padding < 0:
            assert False, "Block out of order at " + ptr
        if padding > 10*1024*1024:
            assert False, "More than 10M of padding needed at " + ptr
        if padding % 4 != 0:
            assert False, "Non-word padding size at " + ptr
        while padding > 0:
            padding -= 4
            outp += b"\x00\x00\x00\x00"
        outp += block[32 : 32 + datalen]
        curraddr = newaddr + datalen
    return outp


def convert_to_uf2(file_content):
    datapadding = b""
    while len(datapadding) < 512 - 256 - 32 - 4:
        datapadding += b"\x00\x00\x00\x00"
    numblocks = (len(file_content) + 255) // 256
    outp = b""
    for blockno in range(numblocks):
        ptr = 256 * blockno
        chunk = file_content[ptr:ptr + 256]
        hd = struct.pack(b"<IIIIIIII",  
            UF2_MAGIC_START0, UF2_MAGIC_START1, 
            0, ptr + appstartaddr, 256, blockno, numblocks, 0)
        while len(chunk) < 256:
            chunk += b"\x00"
        block = hd + chunk + datapadding + struct.pack(b"<I", UF2_MAGIC_END)
        assert len(block) == 512
        outp += block
    return outp


def get_drives():
    drives = []
    if sys.platform == "win32":
        r = subprocess.check_output(["wmic", "PATH", "Win32_LogicalDisk",
                                     "get", "DeviceID,", "VolumeName,",
                                     "FileSystem,", "DriveType"])
        for line in r.split('\n'):
            words = re.split('\s+', line)
            if len(words) >= 3 and words[1] == "2" and words[2] == "FAT":
                drives.append(words[0])
    else:
        rootpath = "/media"
        if sys.platform == "darwin":
            rootpath = "/Volumes"
        elif sys.platform == "linux":
            tmp = rootpath + "/" + os.environ["USER"]
            if os.path.isdir(tmp):
                rootpath = tmp
        for d in os.listdir(rootpath):
            drives.append(os.path.join(rootpath, d))


    def hasInfo(d):
        try:
            return os.path.isfile(d + INFO_FILE)
        except:
            return False
    
    return list(filter(hasInfo, drives))


def board_id(path):
    with open(path + INFO_FILE, mode='r') as file:
        file_content = file.read()
    return re.search("Board-ID: ([^\r\n]*)", file_content).group(1)


def list_drives():
    for d in get_drives():
        print(d, boardID(d))


def write_file(name, buf):
    with open(name, "wb") as f:
        f.write(buf)
    print("Wrote %d bytes to %s." % (len(buf), name))


def main():
    global appstartaddr
    def error(msg):
        print(msg)
        sys.exit(1)
    parser = argparse.ArgumentParser(description='Convert to UF2 or flash directly.')
    parser.add_argument('input', metavar='INPUT', type=str, nargs='?', 
                        help='input file (BIN or UF2)')
    parser.add_argument('-b' , '--base', dest='base', type=str,
                        default="0x2000",
                        help='set base address of application (default: 0x2000)')
    parser.add_argument('-o' , '--output', metavar="FILE", dest='output', type=str,
                        help='write output to named file; defaults to "flash.uf2" or "flash.bin" where sensible')
    parser.add_argument('-d' , '--device', dest="device_path",
                        help='select a device path to flash')
    parser.add_argument('-l' , '--list', action='store_true',
                        help='list connected devices')
    parser.add_argument('-c' , '--convert', action='store_true',
                        help='do not flash, just convert')
    args = parser.parse_args()
    appstartaddr = int(args.base, 0)
    if args.list:
        list_drives()
    else:
        if not args.input:
            error("Need input file")
        with open(args.input, mode='rb') as f:
            inpbuf = f.read()
        from_uf2 = is_uf2(inpbuf)
        ext = "uf2"
        if from_uf2:
            outbuf = convert_from_uf2(inpbuf)
            ext = "bin"
        else:
            outbuf = convert_to_uf2(inpbuf)
        print("Converting to %s, output size: %d, start address: 0x%x" %
              (ext, len(outbuf), appstartaddr))
        if args.convert:
            drives = []
            if args.output == None:
                args.output = "flash." + ext
        else:
            drives = get_drives()
        
        if args.output:
            write_file(args.output, outbuf)
        else:
            if len(drives) == 0:
                error("No drive to deploy.")
        for d in drives:
            print("Flashing %s (%s)" % (d, boardID(d)))
            write_file(outbuf, d + "/NEW.UF2")


if __name__ == "__main__":
    main()
