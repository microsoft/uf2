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

The file `configkeys.h` with definitions of key names can be downloaded from the 
patcher website (see below).

If you require your own key names, please use 
[random large key names](https://github.com/Microsoft/uf2#picking-numbers-at-random).

## The Patcher

At https://microsoft.github.io/uf2/patcher/ we provide a tool, which given a UF2 or BIN file
and a configuration definition, binary-patches the UF2/BIN file and lets the user download it.
The tool also parses existing configuration information from the UF2/BIN file to show it.

Such tool is to be used by makers of devices.
For example, for MakeCode Arcade, this includes both factories and users who take an existing
multi-purpose board and connect keys and screen.
Such user would then download generic MakeCode Arcade bootloader (either a UF2 file,
which upgrades the bootloader, or a .BIN file with the bootloader) for the given MCU,
and binary patch it with their configuration.
Then, they would update the bootloader, and have a Arcade-compatible device.

## Configuration file syntax

Example:

```bash
# This is comment, which is ignored
// this is also a comment

# Configuration values for display registers and size
DISPLAY_CFG0 = 0x80
DISPLAY_CFG1 = 0x603
DISPLAY_CFG2 = 0x16
DISPLAY_HEIGHT = 128
DISPLAY_WIDTH = 160

PINS_PORT_SIZE = PA_32 # see below

# pin headers (if any)
PIN_A0 = PA02
PIN_A1 = PA05
PIN_A2 = PB08
PIN_D2 = PA07
PIN_D3 = PB22
PIN_SCK = PA01
PIN_MISO = PB23
PIN_MOSI = PA00

# pin functions
PIN_BTN_LEFT = PIN_D2        # use pin header name
PIN_BTN_UP = PB13            # use pin directly
PIN_DISPLAY_CS = 18          # can even just use a number for the pin
PIN_DISPLAY_SCK = PIN_SCK
PIN_DISPLAY_MOSI = PIN_MOSI

# custom configuration keys
_679732427 = 123
_815320287 = 0x80192

# remove an existing config entry
PIN_BTN_MENU2 = null
```

The keys are either key names, or underscore followed by a decimal number.
The values are numbers in either decimal or hexadecimal,
references to other keys, or pin numbers.
The way pin numbers are parsed depends on the `PINS_PORT_SIZE`:
* `PA_16` - pins are `PA00`-`PA15`, `PB00-PB15`, ..., used on STM32
* `PA_32` - pins are `PA00`-`PA31`, ... - used on Microchip ATSAMD
* `P0_16` - pins are `P0_0`-`P0_15`, `P1_0-P1_15`, ... - not used?
* `P0_32` - pins are `P0_0-P0_31`, ... - used on Nordic NRF
* `0` or missing - pins are `P_0`, `P_1`, ..., `P_1000`

Certain keys (like `PINS_PORT_SIZE`) have a number of pre-defined values,
which can be used instead of integers.

Because you're usually use this syntax to patch an existing configuration,
you sometimes may want to remove an entry that's already there.
To do that, use `null` as the value of the key.

For list of keys and predefined values, see `configkeys.h` which can be downloaded
from the patcher website.

## Running from node.js

The patcher tool can be also run from command line.
Download [patcher.js](https://raw.githubusercontent.com/Microsoft/uf2/master/patcher/patcher.js)
and run it with node. It will print out help.
