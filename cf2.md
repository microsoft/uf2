# Binary Bootloader-embedded Config (CF2)

## Motivation

The goal of CF2 is to run the same binary on a number of devices with different
peripheral configuration, but the same MCU.
Typically, this has been achieved by embedding identification components in hardware
(eg. connecting certain MCU pins to GND or 3V) and having the firmware dynamically
detect these.
While simple, this only allows a few bits of configuration data to be stored on device.

Instead, we use the bootloader area for storing device specific configuration data.
Such data is not altered when the device is programmed with new firmware,
and the said firmware can refer to the configuration data in the bootloader area to
alter its behavior.

For example, MakeCode Arcade requires a device with 7 buttons (directions, A, B, and MENU),
a screen from a specific family, and one of the few supported accelerometers.
The exact configuration depends on the manufacturer, but the binary produced by MakeCode
will work on any device with the right MCU, provided it has the right configuration
data in the bootloader area.

Thus, the user only needs to select the type of MCU (which is color coded, 
and is assigned a simple user-facing name), and the resulting binary will work
on their device.
Moreover, they can drag the UF2 file between devices, provided they run the same MCU.
Once bootloaders are updated with networking support (wired or wireless), one device with 
a given MCU will be able to flash another.

## Configuration data format

Data comes as pairs of 32 bit unsigned integers (in machine byte order).
* first pair is `0x1e9e10f1, 0x20227a79`
* second pair consists of the number of configuration entries, and a zero (reserved)
* then configuration entries follow, where the first element is the configuration
  entry key number, and the second is the value (these entries are sorted by key number)
* finally, a number of zeroes follows (typically at least a few hundred), 
  to store any additional configuration data in future

The file with definitions of key names can be downloaded from the patcher website (see below).

If you require your own key names, please use 
[random large key names](https://github.com/Microsoft/uf2#picking-numbers-at-random).

## The Patcher

At https://microsoft.github.io/uf2/patcher/ we provide a tool, which given a UF2 file
and a configuration definition, binary-patches the UF2 file and lets the user download it.
The tool also parses existing configuration information from the UF2 file and show it.

Such tool is to be used by maker of devices.
For example, for MakeCode Arcade, this includes both factories and users who take an existing
multi-purpose board and connect keys and screen.
Such user would then download generic MakeCode Arcade bootloader (either a UF2 file,
which upgrades the bootloader, or a .BIN file with the bootloader) for the given MCU,
and binary patch it with their configuration.
Then, they would update the bootloader, and have a Arcade-compatible device.
