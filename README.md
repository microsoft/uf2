# USB Flashing Format (UF2)

UF2 (USB Flashing Format) is a name of a file format, that is particularly
suitable for flashing devices over MSC (Mass Storage Class most commonly used
by various pendrives) The file consists of 512 byte blocks, each of which is
self-contained and independent of others.

Each 512 byte block consist of (see `uf2.h` for details):
* magic numbers at the beginning and at the end
* address where the data should be flashed
* size of data
* data (up to 476 bytes; for SAMD it's 256 bytes so it's easy to flash in one go)

Thus, it's really easy for the microcontroller to recognize a block of
a UF2 file is written and immediately write it to flash.

In `uf2conv.c` you can find a small converter from `.bin` to `.uf2`.

## Board identification

There is also `BOARD_ID`, which is meant to be machine-readable and specific
to a given version of board hardware. The programming environment might use
this to suggest packages to be imported (i.e., a package for a particular
external flash chip, SD card etc.).

These configuration values can be read from `INFO_UF2.TXT` file.
Presence of this file can be tested to see if the board supports `UF2` flashing,
while contest, particularly `Board-ID` field, can be used for feature detection.

The current flash contents of the board is exposed as `CURRENT.UF2` file.
This file includes the bootloader address space. The last word of bootloader
space points to the string holding the `INFO_UF2.TXT` file, so it can be parsed
by a programming environment to determine which board does the `.UF2` file comes from.

## License

MIT
