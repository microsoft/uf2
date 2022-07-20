# uf2conv -- Packing and unpacking UF2 files

## SYNOPSIS

**uf2conv.py** [-h] [-l]

**uf2conv.py** [-b BASE] [-f FAMILY] [-o FILE] [-d DEVICE_PATH] [-l] [-c] [-D]
               [-w] [-C]
               [HEX or BIN FILE]

**uf2conv.py** [-c] [-D] [-w] [-i] [UF2 FILE]

## DESCRIPTION

## EXAMPLES

### Pack a .bin/.hex to .uf2

```uf2conv.py cpx/firmware.bin --convert --output cpx/firmware.uf2```

```uf2conv.py metro_m4/firmware.bin --base 0x4000 --convert --output metro_m4/firmware.uf2```

```uf2conv.py nrf52840_xxaa.hex --family 0xADA52840 --convert --output nrf52840_xxaa.uf2```

### Unpack a .uf2 to .bin

```uf2conv.py current.uf2 --convert --output current.bin```

## OPTIONS
`-b`
`--base`
: set base address of application for BIN format (default: 0x2000)

`-f`
`--family`
: specify familyID - number or name (default: 0x0)

`-o`
`--output`
: write output to named file (defaults to "flash.uf2" or "flash.bin" where sensible)

`-d`
`--device`
: select a device path to flash

`-l`
`--list`
: list connected devices

`-c`
`--convert`
: do not flash, just convert

`-D`
`--deploy`
: just flash, do not convert

`-w`
`--wait`
: wait for device to flash

`-C`
`--carray`
: convert binary file to a C array, not UF2

`-i`
`--info`
: display header information from UF2, do not convert
