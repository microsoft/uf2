# USB Flashing Format (UF2)

UF2 is a file format, developed by Microsoft for [PXT](https://github.com/Microsoft/pxt) 
(also known as [Microsoft MakeCode](https://makecode.com)), that is particularly suitable for 
flashing microcontrollers over MSC (Mass Storage Class; aka removable flash drive).

For a more friendly explanation, check out [this blog post](https://makecode.com/blog/one-chip-to-flash-them-all).

## Overview

The UF2 file consists of 512 byte blocks, each of which is self-contained and independent of others. 
Each 512 byte block consists of (see below for details):
* magic numbers at the beginning and at the end
* address where the data should be flashed
* up to 476 bytes of data

The data transfers over MSC always arrive in multiples of 512 bytes.
Together with the FAT file system structure, this means that blocks of the
UF2 file are always aligned with the MSC writes - the microcontroller 
never gets a partial file.

The magic numbers let the microcontroller distinguish an UF2 file block from
other data (eg., FAT table entry, or various book-keeping files stored by some
operating systems).  When a UF2 block is recognized, it can be flashed
immediately (unless flash page size is more than 256 bytes; in that case a buffer
is needed). The actual handling of file format during writing is very simple
(~10 lines of C code in simplest version).

## File format

A UF2 file consists of 512 byte blocks. Each block starts with a 32 byte
header, followed by data, and a final magic number.
All fields, except for data, are 32 bit unsigned little endian integers.

| Offset | Size | Value                                             |
|--------|------|---------------------------------------------------|
| 0      | 4    | First magic number, `0x0A324655` (`"UF2\n"`)      |
| 4      | 4    | Second magic number, `0x9E5D5157`                 |
| 8      | 4    | Flags                                             |
| 12     | 4    | Address in flash where the data should be written |
| 16     | 4    | Number of bytes used in data (often 256)          |
| 20     | 4    | Sequential block number; starts at 0              |
| 24     | 4    | Total number of blocks in file                    |
| 28     | 4    | Reserved; should be 0                             |
| 32     | 476  | Data, padded with zeros                           |
| 508    | 4    | Final magic number, `0x0AB16F30`                  |

### Flags

Currently, only one flag is defined:

* `0x00000001` - **do not flash** - this block should be skipped when writing the
  device flash; it can be used to store "comments" in the file, typically
  embedded source code or debug info that does not fit on the device flash

### Rationale

The magic number at the end is meant to mitigate partial block writes.

Second and final magic numbers were randomly selected, except for the last byte
of final magic number, which was forced to be `'\n'` (`0xA`). Together with the
first magic number being `"UF2\n"` this makes it easy to identify UF2 blocks in
a text editor.

The header is padded to 32 bytes, as hex editors commonly use 16 or 32 bytes
as line length.  This way, the data payload is aligned to line start.

32 bit integers are used for all fields so that large flash sizes can be
supported in future, as well as for simplicity. Little endian is used, as most
microcontrollers are little endian. 8 bit microcontrollers can choose to just
use the first 16 bits of various header fields.

The total number of blocks in the file and the sequential block number make it
easy for the bootloader to detect that all blocks have been transferred. It
requires one bit of memory per block (eg., on SAMD21G18A it's 128 bytes).
Alternatively, the bootloader might ignore that and just implement a reset
after say 1 second break in incoming UF2 blocks.

### Payload sizes

The number of data bytes is configurable and depends on the size of
the flash page (that is the smallest size that can be erased) on the
microcontroller.

* if the page size is more than `476` bytes, the bootloader should support
  any payload size, as it needs to buffer the entire page in memory anyway
* if the page size is less than `476` bytes, the payload should be a multiple
  of page size, so it can be written without buffering; the target address
  should also be a multiple of page size

In any event, payload size and target address should always be 4-byte aligned.

Note that payload size of `256` is always correct, and makes it easy to convert
between flash addresses and UF2 file offsets.

For example, on Atmel's SAMD21 chips the page size is `256` bytes, and this 
also is the payload size. If the page size was `128` bytes, one could use
payload of `128*3`. Nordic nRF51 has page size of `1024` bytes, and thus 
any payload size should be allowed.

### Embedding sources

Some IDEs will embed program sources in the UF2 file. This allows a UF2 files to be
loaded by the IDE and serve as a natural backup and transfer format.
This can be done in two ways:

* using the "do not flash" flag
* using normal blocks that are flashed to the device

If the bootloader can expose `CURRENT.UF2` file (see below) and there is enough
flash available, than the second option is more desirable, as it allows sharing
programs directly from the board.

See https://makecode.com/source-embedding for more info.

### Robustness

The file format is designed specifically to deal with the following problems:

* operating system (OS) writing blocks in different order than occurs in a file
* OS writing blocks multiple times
* OS writing data that is not UF2 blocks
* OS writing first/final part of a block, possibly for metadata detection or search indexing

The only file system assumption we make is that blocks of file are aligned with
blocks on the hard drive. It's likely true of many file systems besides FAT.

We also assume that USB MSC device reports its block size to be a multiple of `512`
bytes. In the wild these devices always almost report exactly `512`, and some
operating systems do not support other values.

## Files exposed by bootloaders

Bootloaders may expose virtual files in their MSC devices.  These are
standardized here, so that flashing tools can automatically detect the
bootloaders.

* `INFO_UF2.TXT` - contains information about the bootloader build and the board on which it is running
* `INDEX.HTM` - redirects to a page that contains an IDE or other information
* `CURRENT.UF2` - the contents of the entire flash of the device, starting at `0x00000000`, with `256` payload size;
  thus, the size of this file will report as twice the size of flash

Flashing tools can use the presence of `INFO_UF2.TXT` file as an indication that
a given directory is actually a connected UF2 board.

Typical `INFO_UF2.TXT` file looks like this:
```
UF2 Bootloader v1.1.3 SFA
Model: Arduino Zero
Board-ID: SAMD21G18A-Zero-v0
```

The `Board-ID` field is machine-readable and consists of a number of dash-separated tokens.
The first token is the CPU type, second is the board type, and third is the board revision.
More tokens can be also added.

The bootloader should contain its info file as a static string somewhere in its code.
If possible, the last word of the bootloader code should point to this string.
This way, the info file can be found in the initial section of the `CURRENT.UF2`
file as well. Thus, a board type can be determined from the contents of `CURRENT.UF2`.
This is particularly useful with the source embedding (see above).

## Implementations

### Bootloaders

* [SAMD21](https://github.com/Microsoft/uf2-samd21)

### Editors

* https://makecode.adafruit.com

## License

MIT

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
