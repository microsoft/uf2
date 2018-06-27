#!/usr/bin/python

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

families = {
    'SAMD21': 0x68ed2b88,
    'SAMD51': 0x55114460,
    'NRF52': 0x1b57745f,
    'STM32F1': 0x5ee21072,
    'STM32F4': 0x57755a57,
    'ATMEGA32': 0x16573617,
}

INFO_FILE = "/INFO_UF2.TXT"

appstartaddr = 0x2000
familyid = 0x0

def isUF2(buf):
    w = struct.unpack("<II", buf[0:8])
    return w[0] == UF2_MAGIC_START0 and w[1] == UF2_MAGIC_START1

def isHEX(buf):
    w = buf[0:30]
    if w[0] == ':' and re.match("^[:0-9a-fA-F\r\n]+$", buf):
        return True
    return False

def convertFromUF2(buf):
    global appstartaddr
    numblocks = len(buf) / 512
    curraddr = None
    outp = ""
    for blockno in range(0, numblocks):
        ptr = blockno * 512
        block = buf[ptr:ptr + 512]
        hd = struct.unpack("<IIIIIIII", block[0:32])
        if hd[0] != UF2_MAGIC_START0 or hd[1] != UF2_MAGIC_START1:
            print "Skipping block at " + ptr + "; bad magic"
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
            outp += "\x00\x00\x00\x00"
        outp += block[32 : 32 + datalen]
        curraddr = newaddr + datalen
    return outp

def convertToUF2(fileContent):
    global familyid
    datapadding = ""
    while len(datapadding) < 512 - 256 - 32 - 4:
        datapadding += "\x00\x00\x00\x00"
    numblocks = (len(fileContent) + 255) / 256
    outp = ""
    for blockno in range(0, numblocks):
        ptr = 256 * blockno
        chunk = fileContent[ptr:ptr + 256]
        flags = 0x0
        if familyid:
            flags |= 0x2000
        hd = struct.pack("<IIIIIIII",  
            UF2_MAGIC_START0, UF2_MAGIC_START1, 
            flags, ptr + appstartaddr, 256, blockno, numblocks, familyid)
        while len(chunk) < 256:
            chunk += "\x00"
        block = hd + chunk + datapadding + struct.pack("<I", UF2_MAGIC_END)
        assert len(block) == 512
        outp += block
    return outp

class Block:
    def __init__(self, addr):
        self.addr = addr
        self.bytes = []
        for i in range(0, 256):
            self.bytes.append(0)

    def encode(self, blockno, numblocks):
        global familyid
        flags = 0x0
        if familyid:
            flags |= 0x2000
        hd = struct.pack("<IIIIIIII",  
            UF2_MAGIC_START0, UF2_MAGIC_START1, 
            flags, self.addr, 256, blockno, numblocks, familyid)
        for i in range(0, 256):
            hd += chr(self.bytes[i])
        while len(hd) < 512 - 4:
            hd += "\x00"
        hd += struct.pack("<I", UF2_MAGIC_END)
        return hd
      
def convertFromHexToUF2(buf):
    global appstartaddr
    appstartaddr = None
    upper = 0
    currblock = None
    blocks = []
    for line in buf.split('\n'):
        if line[0] != ":":
            continue
        i = 1
        rec = []
        while i < len(line) - 1:
            rec.append(int(line[i:i+2], 16))
            i += 2
        tp = rec[3]
        if tp == 4:
            upper = ((rec[4] << 8) | rec[5]) << 16
        elif tp == 2:
            upper = ((rec[4] << 8) | rec[5]) << 4
            assert (upper & 0xffff) == 0
        elif tp == 1:
            break
        elif tp == 0:
            addr = upper | (rec[1] << 8) | rec[2]
            if appstartaddr == None:
                appstartaddr = addr
            i = 4
            while i < len(rec) - 1:
                if not currblock or currblock.addr & ~0xff != addr & ~0xff:
                    currblock = Block(addr & ~0xff)
                    blocks.append(currblock)
                currblock.bytes[addr & 0xff] = rec[i]
                addr += 1
                i += 1
    numblocks = len(blocks)
    resfile = ""
    for i in range(0, numblocks):
        resfile += blocks[i].encode(i, numblocks)
    return resfile


def getdrives():
    drives = []
    if sys.platform == "win32":
        r = subprocess.check_output(["wmic", "PATH", "Win32_LogicalDisk", "get", "DeviceID,", "VolumeName,", "FileSystem,", "DriveType"])
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
    
    return filter(hasInfo, drives)

def boardID(path):
    with open(path + INFO_FILE, mode='r') as file:
        fileContent = file.read()
    return re.search("Board-ID: ([^\r\n]*)", fileContent).group(1)
 
def listdrives():
    for d in getdrives():
        print d, boardID(d)

def writeFile(name, buf):
    with open(name, "wb") as f:
        f.write(buf)
    print "Wrote %d bytes to %s." % (len(buf), name)

def main():
    global appstartaddr, familyid
    def error(msg):
        print msg
        sys.exit(1)
    parser = argparse.ArgumentParser(description='Convert to UF2 or flash directly.')
    parser.add_argument('input', metavar='INPUT', type=str, nargs='?', 
                        help='input file (HEX, BIN or UF2)')
    parser.add_argument('-b' , '--base', dest='base', type=str,
                        default="0x2000",
                        help='set base address of application for BIN format (default: 0x2000)')
    parser.add_argument('-o' , '--output', metavar="FILE", dest='output', type=str,
                        help='write output to named file; defaults to "flash.uf2" or "flash.bin" where sensible')
    parser.add_argument('-d' , '--device', dest="device_path",
                        help='select a device path to flash')
    parser.add_argument('-l' , '--list', action='store_true',
                        help='list connected devices')
    parser.add_argument('-c' , '--convert', action='store_true',
                        help='do not flash, just convert')
    parser.add_argument('-f' , '--family', dest='family', type=str,
                        default="0x0",
                        help='specify familyID - number or name (default: 0x0)')
    args = parser.parse_args()
    appstartaddr = int(args.base, 0)

    if args.family.upper() in families:
        familyid = families[args.family.upper()]
    else:
        try:
            familyid = int(args.family, 0)
        except ValueError:
            error("Family ID needs to be a number or one of: " + ", ".join(families.keys()))

    if args.list:
        listdrives()
    else:
        if not args.input:
            error("Need input file")
        with open(args.input, mode='rb') as file:
            inpbuf = file.read()
        fromUF2 = isUF2(inpbuf)
        ext = "uf2"
        if fromUF2:
            outbuf = convertFromUF2(inpbuf)
            ext = "bin"
        elif isHEX(inpbuf):
            outbuf = convertFromHexToUF2(inpbuf)
        else:
            outbuf = convertToUF2(inpbuf)
        print "Converting to %s, output size: %d, start address: 0x%x" % (ext, len(outbuf), appstartaddr)

        if args.convert:
            drives = []
            if args.output == None:
                args.output = "flash." + ext
        else:
            drives = getdrives()
        
        if args.output:
            writeFile(args.output, outbuf)
        else:
            if len(drives) == 0:
                error("No drive to deploy.")
        for d in drives:
            print "Flashing %s (%s)" % (d, boardID(d))
            writeFile(outbuf, d + "/NEW.UF2")

if __name__ == "__main__":
    main()
