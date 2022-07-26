"use strict";

// copy entire configkeys.h from https://github.com/microsoft/pxt-common-packages/blob/master/libs/base/configkeys.h
const CONFIG_KEYS_H =
    `
#ifndef __PXT_CONFIGKEYS_H
#define __PXT_CONFIGKEYS_H

// used by pins.cpp to mask off the pin name from any config
// lower 16 pins of value are the pin name
#define CFG_PIN_NAME_MSK 0x0000ffff
// upper 16 bits of value is any configuration of the pin.
#define CFG_PIN_CONFIG_MSK 0xffff0000

// begin optional pin configurations
#define CFG_PIN_CONFIG_ACTIVE_LO 0x10000


#define CFG_MAGIC0 0x1e9e10f1
#define CFG_MAGIC1 0x20227a79

// these define keys for getConfig() function
#define CFG_PIN_ACCELEROMETER_INT 1
#define CFG_PIN_ACCELEROMETER_SCL 2
#define CFG_PIN_ACCELEROMETER_SDA 3
#define CFG_PIN_BTN_A 4
#define CFG_PIN_BTN_B 5
#define CFG_PIN_BTN_SLIDE 6
#define CFG_PIN_DOTSTAR_CLOCK 7
#define CFG_PIN_DOTSTAR_DATA 8
#define CFG_PIN_FLASH_CS 9
#define CFG_PIN_FLASH_MISO 10
#define CFG_PIN_FLASH_MOSI 11
#define CFG_PIN_FLASH_SCK 12
#define CFG_PIN_LED 13
#define CFG_PIN_LIGHT 14
#define CFG_PIN_MICROPHONE 15
#define CFG_PIN_MIC_CLOCK 16
#define CFG_PIN_MIC_DATA 17
#define CFG_PIN_MISO 18
#define CFG_PIN_MOSI 19
// the preferred pin to drive an external neopixel strip
#define CFG_PIN_NEOPIXEL 20
#define CFG_PIN_RX 21
#define CFG_PIN_RXLED 22
#define CFG_PIN_SCK 23
#define CFG_PIN_SCL 24
#define CFG_PIN_SDA 25
#define CFG_PIN_SPEAKER_AMP 26
#define CFG_PIN_TEMPERATURE 27
#define CFG_PIN_TX 28
#define CFG_PIN_TXLED 29
#define CFG_PIN_IR_OUT 30
#define CFG_PIN_IR_IN 31
#define CFG_PIN_DISPLAY_SCK 32
#define CFG_PIN_DISPLAY_MISO 33
#define CFG_PIN_DISPLAY_MOSI 34
#define CFG_PIN_DISPLAY_CS 35
#define CFG_PIN_DISPLAY_DC 36
#define CFG_DISPLAY_WIDTH 37
#define CFG_DISPLAY_HEIGHT 38
#define CFG_DISPLAY_CFG0 39
#define CFG_DISPLAY_CFG1 40
#define CFG_DISPLAY_CFG2 41
#define CFG_DISPLAY_CFG3 42
#define CFG_PIN_DISPLAY_RST 43
#define CFG_PIN_DISPLAY_BL 44
#define CFG_PIN_SERVO_1 45
#define CFG_PIN_SERVO_2 46
#define CFG_PIN_BTN_LEFT 47
#define CFG_PIN_BTN_RIGHT 48
#define CFG_PIN_BTN_UP 49
#define CFG_PIN_BTN_DOWN 50
#define CFG_PIN_BTN_MENU 51
#define CFG_PIN_LED_R 52
#define CFG_PIN_LED_G 53
#define CFG_PIN_LED_B 54
#define CFG_PIN_LED1 55
#define CFG_PIN_LED2 56
#define CFG_PIN_LED3 57
#define CFG_PIN_LED4 58
#define CFG_SPEAKER_VOLUME 59

#define CFG_PIN_JACK_TX 60
#define CFG_PIN_JACK_SENSE 61
#define CFG_PIN_JACK_HPEN 62
#define CFG_PIN_JACK_BZEN 63
#define CFG_PIN_JACK_PWREN 64
#define CFG_PIN_JACK_SND 65
#define CFG_PIN_JACK_BUSLED 66
#define CFG_PIN_JACK_COMMLED 67

#define CFG_PIN_BTN_SOFT_RESET 69
#define CFG_ACCELEROMETER_TYPE 70
#define CFG_PIN_BTNMX_LATCH 71
#define CFG_PIN_BTNMX_CLOCK 72
#define CFG_PIN_BTNMX_DATA 73
#define CFG_PIN_BTN_MENU2 74
#define CFG_PIN_BATTSENSE 75
#define CFG_PIN_VIBRATION 76
#define CFG_PIN_PWREN 77
#define CFG_DISPLAY_TYPE 78

#define CFG_PIN_ROTARY_ENCODER_A 79
#define CFG_PIN_ROTARY_ENCODER_B 80

#define CFG_ACCELEROMETER_SPACE 81

#define CFG_PIN_WIFI_MOSI 82
#define CFG_PIN_WIFI_MISO 83
#define CFG_PIN_WIFI_SCK 84
#define CFG_PIN_WIFI_TX 85
#define CFG_PIN_WIFI_RX 86
#define CFG_PIN_WIFI_CS 87
#define CFG_PIN_WIFI_BUSY 88
#define CFG_PIN_WIFI_RESET 89
#define CFG_PIN_WIFI_GPIO0 90
#define CFG_PIN_WIFI_AT_TX 91
#define CFG_PIN_WIFI_AT_RX 92

#define CFG_PIN_USB_POWER 93

// default I2C address
#define ACCELEROMETER_TYPE_LIS3DH 0x32
#define ACCELEROMETER_TYPE_LIS3DH_ALT 0x30
#define ACCELEROMETER_TYPE_MMA8453 0x38
#define ACCELEROMETER_TYPE_FXOS8700 0x3C
#define ACCELEROMETER_TYPE_MMA8653 0x3A
#define ACCELEROMETER_TYPE_MSA300 0x4C
#define ACCELEROMETER_TYPE_MPU6050 0x68

#define DISPLAY_TYPE_ST7735 7735
#define DISPLAY_TYPE_ILI9341 9341
#define DISPLAY_TYPE_SMART 4242

#define CFG_PIN_A0 100
#define CFG_PIN_A1 101
#define CFG_PIN_A2 102
#define CFG_PIN_A3 103
#define CFG_PIN_A4 104
#define CFG_PIN_A5 105
#define CFG_PIN_A6 106
#define CFG_PIN_A7 107
#define CFG_PIN_A8 108
#define CFG_PIN_A9 109
#define CFG_PIN_A10 110
#define CFG_PIN_A11 111
#define CFG_PIN_A12 112
#define CFG_PIN_A13 113
#define CFG_PIN_A14 114
#define CFG_PIN_A15 115
#define CFG_PIN_A16 116
#define CFG_PIN_A17 117
#define CFG_PIN_A18 118
#define CFG_PIN_A19 119
#define CFG_PIN_A20 120
#define CFG_PIN_A21 121
#define CFG_PIN_A22 122
#define CFG_PIN_A23 123
#define CFG_PIN_A24 124
#define CFG_PIN_A25 125
#define CFG_PIN_A26 126
#define CFG_PIN_A27 127
#define CFG_PIN_A28 128
#define CFG_PIN_A29 129
#define CFG_PIN_A30 130
#define CFG_PIN_A31 131

#define CFG_PIN_D0 150
#define CFG_PIN_D1 151
#define CFG_PIN_D2 152
#define CFG_PIN_D3 153
#define CFG_PIN_D4 154
#define CFG_PIN_D5 155
#define CFG_PIN_D6 156
#define CFG_PIN_D7 157
#define CFG_PIN_D8 158
#define CFG_PIN_D9 159
#define CFG_PIN_D10 160
#define CFG_PIN_D11 161
#define CFG_PIN_D12 162
#define CFG_PIN_D13 163
#define CFG_PIN_D14 164
#define CFG_PIN_D15 165
#define CFG_PIN_D16 166
#define CFG_PIN_D17 167
#define CFG_PIN_D18 168
#define CFG_PIN_D19 169
#define CFG_PIN_D20 170
#define CFG_PIN_D21 171
#define CFG_PIN_D22 172
#define CFG_PIN_D23 173
#define CFG_PIN_D24 174
#define CFG_PIN_D25 175
#define CFG_PIN_D26 176
#define CFG_PIN_D27 177
#define CFG_PIN_D28 178
#define CFG_PIN_D29 179
#define CFG_PIN_D30 180
#define CFG_PIN_D31 181

#define CFG_NUM_NEOPIXELS 200
#define CFG_NUM_DOTSTARS 201
#define CFG_DEFAULT_BUTTON_MODE 202
#define CFG_SWD_ENABLED 203
#define CFG_FLASH_BYTES 204
#define CFG_RAM_BYTES 205
#define CFG_SYSTEM_HEAP_BYTES 206
#define CFG_LOW_MEM_SIMULATION_KB 207
#define CFG_BOOTLOADER_BOARD_ID 208
#define CFG_UF2_FAMILY 209
#define CFG_PINS_PORT_SIZE 210
#define CFG_BOOTLOADER_PROTECTION 211
#define CFG_POWER_DEEPSLEEP_TIMEOUT 212
#define CFG_ANALOG_BUTTON_THRESHOLD 213
#define CFG_CPU_MHZ 214
#define CFG_CONTROLLER_LIGHT_MAX_BRIGHTNESS 215
#define CFG_ANALOG_JOYSTICK_MIN 216
#define CFG_ANALOG_JOYSTICK_MAX 217
#define CFG_TIMERS_TO_USE 218
// configs to specify the onboard (built-in) dotstar or neopixel strips
// some boards have a combination of dotstar, neopixel strips like neotrellis
#define CFG_PIN_ONBOARD_DOTSTAR_CLOCK 219
#define CFG_PIN_ONBOARD_DOTSTAR_DATA 220
#define CFG_NUM_ONBOARD_DOTSTARS 221
#define CFG_PIN_ONBOARD_NEOPIXEL 222
#define CFG_NUM_ONBOARD_NEOPIXELS 223

#define CFG_MATRIX_KEYPAD_MESSAGE_ID 239
#define CFG_NUM_MATRIX_KEYPAD_ROWS 240
#define CFG_PIN_MATRIX_KEYPAD_ROW0 241
#define CFG_PIN_MATRIX_KEYPAD_ROW1 242
#define CFG_PIN_MATRIX_KEYPAD_ROW2 243
#define CFG_PIN_MATRIX_KEYPAD_ROW3 244
#define CFG_PIN_MATRIX_KEYPAD_ROW4 245
#define CFG_PIN_MATRIX_KEYPAD_ROW5 246
#define CFG_PIN_MATRIX_KEYPAD_ROW6 247
#define CFG_PIN_MATRIX_KEYPAD_ROW7 248
#define CFG_NUM_MATRIX_KEYPAD_COLS 250
#define CFG_PIN_MATRIX_KEYPAD_COL0 251
#define CFG_PIN_MATRIX_KEYPAD_COL1 252
#define CFG_PIN_MATRIX_KEYPAD_COL2 253
#define CFG_PIN_MATRIX_KEYPAD_COL3 254
#define CFG_PIN_MATRIX_KEYPAD_COL4 255
#define CFG_PIN_MATRIX_KEYPAD_COL5 256
#define CFG_PIN_MATRIX_KEYPAD_COL6 257
#define CFG_PIN_MATRIX_KEYPAD_COL7 258

#define CFG_PIN_B0 300
#define CFG_PIN_B1 301
#define CFG_PIN_B2 302
#define CFG_PIN_B3 303
#define CFG_PIN_B4 304
#define CFG_PIN_B5 305
#define CFG_PIN_B6 306
#define CFG_PIN_B7 307
#define CFG_PIN_B8 308
#define CFG_PIN_B9 309
#define CFG_PIN_B10 310
#define CFG_PIN_B11 311
#define CFG_PIN_B12 312
#define CFG_PIN_B13 313
#define CFG_PIN_B14 314
#define CFG_PIN_B15 315
#define CFG_PIN_B16 316
#define CFG_PIN_B17 317
#define CFG_PIN_B18 318
#define CFG_PIN_B19 319
#define CFG_PIN_B20 320
#define CFG_PIN_B21 321
#define CFG_PIN_B22 322
#define CFG_PIN_B23 323
#define CFG_PIN_B24 324
#define CFG_PIN_B25 325
#define CFG_PIN_B26 326
#define CFG_PIN_B27 327
#define CFG_PIN_B28 328
#define CFG_PIN_B29 329
#define CFG_PIN_B30 330
#define CFG_PIN_B31 331

#define CFG_PIN_C0 350
#define CFG_PIN_C1 351
#define CFG_PIN_C2 352
#define CFG_PIN_C3 353
#define CFG_PIN_C4 354
#define CFG_PIN_C5 355
#define CFG_PIN_C6 356
#define CFG_PIN_C7 357
#define CFG_PIN_C8 358
#define CFG_PIN_C9 359
#define CFG_PIN_C10 360
#define CFG_PIN_C11 361
#define CFG_PIN_C12 362
#define CFG_PIN_C13 363
#define CFG_PIN_C14 364
#define CFG_PIN_C15 365
#define CFG_PIN_C16 366
#define CFG_PIN_C17 367
#define CFG_PIN_C18 368
#define CFG_PIN_C19 369
#define CFG_PIN_C20 370
#define CFG_PIN_C21 371
#define CFG_PIN_C22 372
#define CFG_PIN_C23 373
#define CFG_PIN_C24 374
#define CFG_PIN_C25 375
#define CFG_PIN_C26 376
#define CFG_PIN_C27 377
#define CFG_PIN_C28 378
#define CFG_PIN_C29 379
#define CFG_PIN_C30 380
#define CFG_PIN_C31 381

#define CFG_PIN_P0 400
#define CFG_PIN_P1 401
#define CFG_PIN_P2 402
#define CFG_PIN_P3 403
#define CFG_PIN_P4 404
#define CFG_PIN_P5 405
#define CFG_PIN_P6 406
#define CFG_PIN_P7 407
#define CFG_PIN_P8 408
#define CFG_PIN_P9 409
#define CFG_PIN_P10 410
#define CFG_PIN_P11 411
#define CFG_PIN_P12 412
#define CFG_PIN_P13 413
#define CFG_PIN_P14 414
#define CFG_PIN_P15 415
#define CFG_PIN_P16 416
#define CFG_PIN_P17 417
#define CFG_PIN_P18 418
#define CFG_PIN_P19 419
#define CFG_PIN_P20 420
#define CFG_PIN_P21 421
#define CFG_PIN_P22 422
#define CFG_PIN_P23 423
#define CFG_PIN_P24 424
#define CFG_PIN_P25 425
#define CFG_PIN_P26 426
#define CFG_PIN_P27 427
#define CFG_PIN_P28 428
#define CFG_PIN_P29 429
#define CFG_PIN_P30 430
#define CFG_PIN_P31 431
#define CFG_PIN_P32 432
#define CFG_PIN_P33 433
#define CFG_PIN_P34 434
#define CFG_PIN_P35 435
#define CFG_PIN_P36 436
#define CFG_PIN_P37 437
#define CFG_PIN_P38 438
#define CFG_PIN_P39 439
#define CFG_PIN_P40 440
#define CFG_PIN_P41 441
#define CFG_PIN_P42 442
#define CFG_PIN_P43 443
#define CFG_PIN_P44 444
#define CFG_PIN_P45 445
#define CFG_PIN_P46 446
#define CFG_PIN_P47 447
#define CFG_PIN_P48 448
#define CFG_PIN_P49 449
#define CFG_PIN_P50 450
#define CFG_PIN_P51 451
#define CFG_PIN_P52 452
#define CFG_PIN_P53 453
#define CFG_PIN_P54 454
#define CFG_PIN_P55 455
#define CFG_PIN_P56 456
#define CFG_PIN_P57 457
#define CFG_PIN_P58 458
#define CFG_PIN_P59 459
#define CFG_PIN_P60 460
#define CFG_PIN_P61 461
#define CFG_PIN_P62 462
#define CFG_PIN_P63 463

#define CFG_PIN_LORA_MISO 1001
#define CFG_PIN_LORA_MOSI 1002
#define CFG_PIN_LORA_SCK 1003
#define CFG_PIN_LORA_CS 1004
#define CFG_PIN_LORA_BOOT 1005
#define CFG_PIN_LORA_RESET 1006
#define CFG_PIN_IRRXLED 1007
#define CFG_PIN_IRTXLED 1008
#define CFG_PIN_LCD_RESET 1009
#define CFG_PIN_LCD_ENABLE 1010
#define CFG_PIN_LCD_DATALINE4 1011
#define CFG_PIN_LCD_DATALINE5 1012
#define CFG_PIN_LCD_DATALINE6 1013
#define CFG_PIN_LCD_DATALINE7 1014
#define CFG_NUM_LCD_COLUMNS 1015
#define CFG_NUM_LCD_ROWS 1016

//RoboHAT MM1 pinout
#define CFG_PIN_RCC0 1017
#define CFG_PIN_RCC1 1018
#define CFG_PIN_RCC2 1019
#define CFG_PIN_RCC3 1020
#define CFG_PIN_RCC4 1021
#define CFG_PIN_RCC5 1022
#define CFG_PIN_RCC6 1023
#define CFG_PIN_RCC7 1024
#define CFG_PIN_SERVO0 1025
#define CFG_PIN_SERVO1 1026
#define CFG_PIN_SERVO2 1027
#define CFG_PIN_SERVO3 1028
#define CFG_PIN_SERVO4 1029
#define CFG_PIN_SERVO5 1030
#define CFG_PIN_SERVO6 1031
#define CFG_PIN_SERVO7 1032
#define CFG_PIN_SERVO8 1033
#define CFG_PIN_PI_TX 1034
#define CFG_PIN_PI_RX 1035
#define CFG_PIN_GPS_SDA 1036
#define CFG_PIN_GPS_SCL 1037
#define CFG_PIN_GPS_TX 1038
#define CFG_PIN_GPS_RX 1039
#define CFG_PIN_GROVE0 1040
#define CFG_PIN_GROVE1 1041
#define CFG_PIN_SS 1042

// Adafruit Grand Central M4
#define CFG_PIN_D33 183
#define CFG_PIN_D34 184
#define CFG_PIN_D35 185
#define CFG_PIN_D36 186
#define CFG_PIN_D37 187
#define CFG_PIN_D38 188
#define CFG_PIN_D39 189
#define CFG_PIN_D40 190
#define CFG_PIN_D41 191
#define CFG_PIN_D42 192
#define CFG_PIN_D43 193
#define CFG_PIN_D44 194
#define CFG_PIN_D45 195
#define CFG_PIN_D46 196
#define CFG_PIN_D47 197
#define CFG_PIN_D48 198
#define CFG_PIN_D49 199
#define CFG_PIN_D50 259
#define CFG_PIN_D51 260
#define CFG_PIN_D52 261
#define CFG_PIN_D53 262

#define CFG_PIN_TX1 263
#define CFG_PIN_TX2 264
#define CFG_PIN_TX3 265
#define CFG_PIN_RX1 266
#define CFG_PIN_RX2 267
#define CFG_PIN_RX3 268
#define CFG_PIN_SCL1 269
#define CFG_PIN_SDA1 270
#define CFG_PIN_PCC_D0 271
#define CFG_PIN_PCC_D1 272
#define CFG_PIN_PCC_D2 273
#define CFG_PIN_PCC_D3 274
#define CFG_PIN_PCC_D4 275
#define CFG_PIN_PCC_D5 276
#define CFG_PIN_PCC_D6 277
#define CFG_PIN_PCC_D7 278
#define CFG_PIN_PCC_D8 279
#define CFG_PIN_PCC_D9 280
#define CFG_PIN_PCC_D10 281
#define CFG_PIN_PCC_D11 282
#define CFG_PIN_PCC_D12 283
#define CFG_PIN_PCC_D13 284
#define CFG_PIN_CC_DEN1 285
#define CFG_PIN_CC_DEN2 286
#define CFG_PIN_CC_CLK 287
#define CFG_PIN_XCC_CLK 288


#define CFG_PIN_JDPWR_PRE_SENSE 1100
#define CFG_PIN_JDPWR_GND_SENSE 1101
#define CFG_PIN_JDPWR_PULSE 1102
#define CFG_PIN_JDPWR_OVERLOAD_LED 1103
#define CFG_PIN_JDPWR_ENABLE 1104
#define CFG_PIN_JDPWR_FAULT 1105

#endif
`

const configKeys = {}
CONFIG_KEYS_H.replace(/#define\s+CFG_(\w+)\s+(\w+)/g, function (m, name, value) {
    configKeys[name] = parseInt(value);
    return "";
})

const enums = {
    // these are the same as the default I2C ID
    ACCELEROMETER_TYPE: {
        LIS3DH: 0x32,
        LIS3DH_ALT: 0x30,
        MMA8453: 0x38,
        FXOS8700: 0x3C,
        MMA8653: 0x3A,
        MSA300: 0x4C,
        MPU6050: 0x68,
    },
    UF2_FAMILY: {
        ATSAMD21: 0x68ed2b88,
        ATSAML21: 0x1851780a,
        ATSAMD51: 0x55114460,
        NRF52840: 0x1b57745f,
        STM32F103: 0x5ee21072,
        STM32F401: 0x57755a57,
        ATMEGA32: 0x16573617,
        CYPRESS_FX2: 0x5a18069b,
    },
    PINS_PORT_SIZE: {
        PA_16: 0x10, // PA00-PA15, PB00-PB15, ... - STM32
        PA_32: 0x20, // PA00-PA31, ... - ATSAMD
        P0_16: 0x1010, // P0_0-P0_15, P1_0-P1_15, ...
        P0_32: 0x1020, // P0_0-P0_32, ... - NRF
    },
    DEFAULT_BUTTON_MODE: {
        ACTIVE_HIGH_PULL_DOWN: 0x11,
        ACTIVE_HIGH_PULL_UP: 0x21,
        ACTIVE_HIGH_PULL_NONE: 0x31,
        ACTIVE_LOW_PULL_DOWN: 0x10,
        ACTIVE_LOW_PULL_UP: 0x20,
        ACTIVE_LOW_PULL_NONE: 0x30,
    },
    DISPLAY_TYPE: {
        ST7735: 7735,
        ILI9341: 9341,
    },
    ".": {
        BTN_FLAG_ACTIVE_HIGH: 0x110000,
        BTN_FLAG_ACTIVE_LOW: 0x200000,
        BTN_OFFSET_ANALOG_PLUS: 1100,
        BTN_OFFSET_ANALOG_MINUS: 1200,
    }
}


let infoMsg = ""

function log(msg) {
    msg = "# " + msg
    infoMsg += msg + "\n"
    console.log(msg)
}

function help() {
    console.log(`
USAGE: node patch-cfg.js file.uf2 [patch.cf2]

Without .cf2 file, it will parse config in the UF2 file and print it out
(in .cf2 format).

With .cf2 file, it will patch in-place the UF2 file with specified config.
`)
    process.exit(1)
}

function readBin(fn) {
    const fs = require("fs")

    if (!fn) {
        console.log("Required argument missing.")
        help()
    }

    try {
        return fs.readFileSync(fn)
    } catch (e) {
        console.log("Cannot read file '" + fn + "': " + e.message)
        help()
    }
}
const configInvKeys = {}

const UF2_MAGIC_START0 = 0x0A324655 // "UF2\n"
const UF2_MAGIC_START1 = 0x9E5D5157 // Randomly selected
const UF2_MAGIC_END = 0x0AB16F30 // Ditto

const CFG_MAGIC0 = 0x1e9e10f1
const CFG_MAGIC1 = 0x20227a79

let all_defines = {}

function configkeysH() {
    let r = "#ifndef __CONFIGKEYS_H\n#define __CONFIGKEYS_H 1\n\n"

    const add = (k, v) => {
        all_defines[k] = v
        if (v > 1000 || !/^CFG_/.test(k))
            v = "0x" + v.toString(16)
        else
            v += ""
        r += "#define " + k + " " + v + "\n"
    }

    add("CFG_MAGIC0", CFG_MAGIC0)
    add("CFG_MAGIC1", CFG_MAGIC1)
    r += "\n"

    for (let k of Object.keys(configKeys)) {
        add("CFG_" + k, configKeys[k])
    }
    for (let k of Object.keys(enums)) {
        r += "\n"
        for (let kk of Object.keys(enums[k])) {
            let n = k == "." ? kk : `${k}_${kk}`
            add(n, enums[k][kk])
        }
    }
    r += "\n#endif // __CONFIGKEYS_H\n"
    return r
}

function err(msg) {
    log("Fatal error: " + msg)
    if (typeof window == "undefined") {
        process.exit(1)
    } else {
        throw new Error(msg)
    }
}

function read32(buf, off) {
    return (buf[off + 0] | (buf[off + 1] << 8) | (buf[off + 2] << 16) | (buf[off + 3] << 24)) >>> 0
}

function write32(buf, off, v) {
    buf[off + 0] = v & 0xff
    buf[off + 1] = (v >> 8) & 0xff
    buf[off + 2] = (v >> 16) & 0xff
    buf[off + 3] = (v >> 24) & 0xff
}

function patchHFile(file, patch) {
    configkeysH()
    let resFile = ""
    let inZone = false
    let flags = {}
    let lineNo = 0
    let nums = []
    for (let line0 of file.split(/\n/)) {
        lineNo++
        let append = line0 + "\n"
        let line = line0.trim().replace(/\/\/.*/, "")
        if (inZone) {
            if (line.indexOf("/* CF2 END */") >= 0) {
                inZone = false
                if (patch) {
                    let portSize = lookupCfg(patch, configKeys.PINS_PORT_SIZE)
                    let s = ""
                    let size = flags["size"] || 100
                    let numentries = patch.length >> 1
                    size = Math.max(size, numentries + 4)
                    s += `    ${CFG_MAGIC0}, ${CFG_MAGIC1}, // magic\n`
                    s += `    ${numentries}, ${size},  // used entries, total entries\n`
                    for (let i = 0; i < numentries; ++i) {
                        let k = patch[i * 2]
                        let v = patch[i * 2 + 1]
                        s += `    ${k}, 0x${v.toString(16)}, // ${showKV(k, v, portSize, patch)}\n`
                    }
                    s += "   "
                    for (let i = 0; i < size - numentries; ++i) {
                        if (i && i % 16 == 0)
                            s += "\n   "
                        s += " 0, 0,"
                    }
                    s += "\n"
                    append = s + line0 + "\n"
                }
            } else {
                append = ""
                let toks = line.split(/,\s*/).map(s => s.trim()).filter(s => !!s)
                for (let tok of toks) {
                    let n = parseInt(tok)
                    if (isNaN(n)) {
                        n = all_defines[tok]
                        if (n === undefined) {
                            let portSize = lookupCfg(nums, configKeys.PINS_PORT_SIZE)
                            if (portSize) portSize &= 0xfff;
                            let pp = parsePinName(tok.replace(/^PIN_/, ""), portSize)
                            if (pp !== undefined) {
                                n = pp
                            } else {
                                err(`unknown value ${tok} at line ${lineNo}`)
                            }
                        }
                    }
                    nums.push(n)
                }
            }
        } else {
            let m = /\/\* CF2 START (.*)/.exec(line)
            if (m) {
                inZone = true
                for (let k of m[1].split(/\s+/)) {
                    let mm = /^(\w+)=(\d+)$/.exec(k)
                    if (mm)
                        flags[mm[1]] = parseInt(mm[2])
                    else
                        flags[k] = true
                }
            }
        }
        resFile += append
    }

    if (nums.length) {
        if (nums[0] != CFG_MAGIC0 || nums[1] != CFG_MAGIC1)
            err("no magic in H file")
        nums = nums.slice(4)
        for (let i = 0; i < nums.length; i += 2) {
            if (nums[i] == 0) {
                if (nums.slice(i).some(x => x != 0))
                    err("config keys follow zero terminator")
                else
                    nums = nums.slice(0, i)
                break
            }
        }
    }

    return {
        patched: resFile,
        data: nums
    }
}

function bufToString(buf) {
    let s = ""
    for (let i = 0; i < buf.length; ++i)
        s += String.fromCharCode(buf[i])
    return s
}

function stringToBuf(str) {
    let buf = new Uint8Array(str.length)
    for (let i = 0; i < buf.length; ++i)
        buf[i] = str.charCodeAt(i)
    return buf
}

function readWriteConfig(buf, patch) {
    let patchPtr = null
    let origData = []
    let cfgLen = 0
    let isUF2 = false
    if (read32(buf, 0) == UF2_MAGIC_START0) {
        isUF2 = true
        log("detected UF2 file")
    } else {
        let stackBase = read32(buf, 0)
        if ((stackBase & 0xff000003) == 0x20000000 &&
            (read32(buf, 4) & 1) == 1) {
            log("detected BIN file")
        } else {
            let str = bufToString(buf)
            if (str.indexOf("/* CF2 START") >= 0) {
                log("detected CF2 header file")
                let rr = patchHFile(str, patch)
                console.log(rr.data)
                return patch ? stringToBuf(rr.patched) : rr.data
            } else {
                err("unknown file format")
            }
        }
    }
    if (patch)
        patch.push(0, 0)
    for (let off = 0; off < buf.length; off += 512) {
        let start = 0
        let payloadLen = 512
        let addr = off

        if (isUF2) {
            start = 32
            if (read32(buf, off) != UF2_MAGIC_START0 ||
                read32(buf, off + 4) != UF2_MAGIC_START1) {
                err("invalid data at " + off)
            }
            payloadLen = read32(buf, off + 16)
            addr = read32(buf, off + 12) - 32
        }

        for (let i = start; i < start + payloadLen; i += 4) {
            if (read32(buf, off + i) == CFG_MAGIC0 &&
                read32(buf, off + i + 4) == CFG_MAGIC1) {
                let addrS = "0x" + (addr + i).toString(16)
                if (patchPtr === null) {
                    log(`Found CFG DATA at ${addrS}`)
                    patchPtr = -4
                } else {
                    if (patch) {
                        log(`Also patching at ${addrS}`)
                        patchPtr = -4
                    } else {
                        log(`Skipping second CFG DATA at ${addrS}`)
                    }
                }
            }

            if (patchPtr !== null) {
                if (patchPtr == -2) {
                    cfgLen = read32(buf, off + i)
                    if (patch)
                        write32(buf, off + i, (patch.length >> 1) - 1)
                }

                if (patchPtr >= 0) {
                    if (origData.length < cfgLen * 2 + 40)
                        origData.push(read32(buf, off + i))
                    if (patch) {
                        if (patchPtr < patch.length) {
                            write32(buf, off + i, patch[patchPtr])
                        }
                    }
                }
                patchPtr++
            }
        }
    }

    let len0 = cfgLen * 2
    origData.push(0, 0)
    while (origData[len0])
        len0 += 2
    origData = origData.slice(0, len0 + 2)
    if (len0 != cfgLen * 2)
        log("size information incorrect; continuing anyway")

    if (origData.length == 0)
        err("config data not found")
    if (patch && patchPtr < patch.length)
        err("no space for config data")
    let tail = origData.slice(origData.length - 2)
    if (tail.some(x => x != 0))
        err("config data not zero terminated: " + tail.join(","))
    origData = origData.slice(0, origData.length - 2)
    return patch ? buf : origData
}

function lookupCfg(cfgdata, key) {
    for (let i = 0; i < cfgdata.length; i += 2)
        if (cfgdata[i] == key)
            return cfgdata[i + 1]
    return null
}

function pinToString(pinNo, portSize) {
    if (!portSize || pinNo >= 1000)
        return "P_" + pinNo

    let useLetters = true
    let theSize = portSize & 0xfff
    if (portSize & 0x1000) {
        useLetters = true
    }
    let port = (pinNo / theSize) | 0
    let pin = pinNo % theSize
    if (useLetters) {
        return "P" + String.fromCharCode(65 + port) + ("0" + pin.toString()).slice(-2)
    } else {
        return "P" + port + "_" + pin
    }
}

function isHeaderPin(n) {
    return /^PIN_(MOSI|MISO|SCK|SDA|SCL|RX|TX|[AD]\d+)$/.test(n)
}

function keyWeight(k) {
    if (k == "PINS_PORT_SIZE")
        return 10
    if (isHeaderPin(k))
        return 20
    if (/^PIN_/.test(k))
        return 30
    return 40
}

function expandNum(k) {
    return k.replace(/\d+/g, f => {
        if (f.length > 4)
            return f
        return ("0000" + f).slice(-4)
    })
}

function cmpKeys(a, b) {
    a = a.replace(/ =.*/, "")
    b = b.replace(/ =.*/, "")
    if (a == b)
        return 0
    let d = keyWeight(a) - keyWeight(b)
    if (d) return d
    let aa = expandNum(a)
    let bb = expandNum(b)
    if (aa < bb) return -1
    else if (bb < aa) return 1
    else if (a < b) return -1
    else return 1
}

function showKV(k, v, portSize, data) {
    let vn = ""

    let kn = configInvKeys[k + ""] || ""

    if (enums[kn]) {
        for (let en of Object.keys(enums[kn])) {
            if (enums[kn][en] == v) {
                vn = en
                break
            }
        }
    }

    if (vn == "") {
        if (/_CFG/.test(kn) || v > 10000)
            vn = "0x" + v.toString(16)
        else if (/^PIN_/.test(kn)) {
            if (data && !isHeaderPin(kn)) {
                for (let pn of Object.keys(configKeys)) {
                    if (isHeaderPin(pn) && lookupCfg(data, configKeys[pn]) === v) {
                        vn = pn
                        break
                    }
                }
            }
            if (!vn)
                vn = pinToString(v, portSize)
        } else
            vn = v + ""
    }

    if (kn == "")
        kn = "_" + k

    return `${kn} = ${vn}`
}

function readConfig(buf) {
    init()
    let cfgdata = readWriteConfig(buf, null)
    let portSize = lookupCfg(cfgdata, configKeys.PINS_PORT_SIZE)
    let numentries = cfgdata.length >> 1
    let lines = []
    for (let i = 0; i < numentries; ++i) {
        lines.push(showKV(cfgdata[i * 2], cfgdata[i * 2 + 1], portSize, cfgdata))
    }
    lines.sort(cmpKeys)
    return lines.length ? lines.join("\n") : "Empty config."
}

function parsePinName(v, portSize) {
    let thePort = -1
    let pin = -1

    v = v.trim()

    v = v.replace(/^DAL\./, "")

    const env = enums["."][v]
    if (env !== undefined)
        return env

    let m = /(.*)([\|+])(.*)/.exec(v)
    if (m) {
        let v0 = parsePinName(m[1], portSize)
        let v1 = parsePinName(m[3], portSize)
        if (v0 === undefined || v1 === undefined)
            return undefined
        v0 = parseInt(v0)
        v1 = parseInt(v1)
        return "" + (m[2] == "|" ? v0 | v1 : v0 + v1)
    }

    m = /^P([A-Z])_?(\d+)$/.exec(v)
    if (m) {
        pin = parseInt(m[2])
        thePort = m[1].charCodeAt(0) - 65
    }

    m = /^P(\d+)_(\d+)$/.exec(v)
    if (m) {
        pin = parseInt(m[2])
        thePort = parseInt(m[1])
    }

    if (thePort >= 0) {
        if (!portSize) err("PINS_PORT_SIZE not specified, while trying to parse PIN " + v)
        if (pin >= portSize) err("Pin name invalid: " + v)
        return (thePort * portSize + pin) + ""
    }

    m = /^P_?(\d+)$/.exec(v)
    if (m)
        return m[1]

    return undefined
}

function patchConfig(buf, cfg) {
    init()
    const cfgMap = {}
    let lineNo = 0
    for (let line of cfg.split(/\n/)) {
        lineNo++
        line = line.replace(/(#|\/\/).*/, "")
        line = line.trim()
        if (!line)
            continue
        let m = /(\w+)\s*=\s*([^#]+)/.exec(line)
        if (!m)
            err("syntax error at config line " + lineNo)
        let kn = m[1].toUpperCase()
        let k = configKeys[kn]
        if (!k && /^_\d+$/.test(kn))
            k = parseInt(kn.slice(1))
        if (!k)
            err("Unrecognized key name: " + kn)
        cfgMap[k + ""] = m[2]
    }

    let cfgdata = readWriteConfig(buf, null)

    for (let i = 0; i < cfgdata.length; i += 2) {
        let k = cfgdata[i] + ""
        if (!cfgMap.hasOwnProperty(k))
            cfgMap[k] = cfgdata[i + 1] + ""
    }

    const forAll = f => {
        for (let k of Object.keys(cfgMap)) {
            let kn = configInvKeys[k]
            f(kn, k, cfgMap[k])
        }
    }

    // expand enums
    forAll((kn, k, v) => {
        let e = enums[kn]
        if (e && e[v.toUpperCase()])
            cfgMap[k] = e[v] + ""
    })

    let portSize = cfgMap[configKeys.PINS_PORT_SIZE]
    if (portSize) portSize = parseInt(portSize)
    let portSize0 = portSize
    if (portSize)
        portSize &= 0xfff;

    // expand pin names
    forAll((kn, k, v) => {
        let p = parsePinName(v, portSize)
        if (p)
            cfgMap[k] = p
    })

    // expand existing keys
    for (let i = 0; i < 10; ++i)
        forAll((kn, k, v) => {
            if (configKeys[v]) {
                let curr = cfgMap[configKeys[v] + ""]
                if (curr == null)
                    err("Value not specified, but referenced: " + v)
                cfgMap[k] = curr
            }
        })

    let changes = ""
    forAll((kn, k, v) => {
        v = v.toUpperCase()
        if (v == "NULL" || v == "UNDEFINED") {
            let old = lookupCfg(cfgdata, k)
            changes += "remove " + showKV(k, old, portSize0) + "\n"
            delete cfgMap[k]
        }
    })

    forAll((kn, k, v) => {
        if (isNaN(parseInt(v)))
            err("Value not understood: " + v)
    })

    let sorted = Object.keys(cfgMap)
    sorted.sort((a, b) => parseInt(a) - parseInt(b))
    let patch = []
    for (let k of sorted) {
        patch.push(parseInt(k))
        patch.push(parseInt(cfgMap[k]))
    }

    for (let i = 0; i < patch.length; i += 2) {
        let k = patch[i]
        let v = patch[i + 1]
        let old = lookupCfg(cfgdata, k)
        if (old != v) {
            let newOne = showKV(k, v, portSize0)
            if (old !== null) {
                let oldOne = showKV(k, old, portSize0)
                newOne += " (was: " + oldOne.replace(/.* = /, "") + ")"
            }
            changes += newOne + "\n"
        }
    }

    let patched = readWriteConfig(buf, patch)

    return {
        changes,
        patched
    }
}

function parseHFile(hFile) {
    if (!hFile) return
    for (let line of hFile.split(/\n/)) {
        line = line.trim()
        let m = /#define\s+CFG_(\w+)\s+(\d+)/.exec(line)
        if (m) {
            let k = m[1]
            let v = parseInt(m[2])
            configKeys[k] = parseInt(v)
            configInvKeys[v + ""] = k
            console.log(`  ${k}: ${v},`)
        }
    }
}

function init() {
    for (let k of Object.keys(configKeys)) {
        let v = configKeys[k]
        configInvKeys[v + ""] = k
    }
}

function main() {
    let uf2 = readBin(process.argv[2])

    if (process.argv[3]) {
        let cfg = readBin(process.argv[3]).toString("utf8")
        let r = patchConfig(uf2, cfg)
        if (!r.changes)
            console.log("No changes.")
        else
            console.log("\nChanges:\n" + r.changes)
        console.log("# Writing config...")
        fs.writeFileSync(process.argv[2], r.patched)
    } else {
        console.log(readConfig(uf2))
    }
}


if (typeof window == "undefined")
    main()