"use strict";

const configKeys = {
    PIN_ACCELEROMETER_INT: 1,
    PIN_ACCELEROMETER_SCL: 2,
    PIN_ACCELEROMETER_SDA: 3,
    PIN_BTN_A: 4,
    PIN_BTN_B: 5,
    PIN_BTN_SLIDE: 6,
    PIN_DOTSTAR_CLOCK: 7,
    PIN_DOTSTAR_DATA: 8,
    PIN_FLASH_CS: 9,
    PIN_FLASH_MISO: 10,
    PIN_FLASH_MOSI: 11,
    PIN_FLASH_SCK: 12,
    PIN_LED: 13,
    PIN_LIGHT: 14,
    PIN_MICROPHONE: 15,
    PIN_MIC_CLOCK: 16,
    PIN_MIC_DATA: 17,
    PIN_MISO: 18,
    PIN_MOSI: 19,
    PIN_NEOPIXEL: 20,
    PIN_RX: 21,
    PIN_RXLED: 22,
    PIN_SCK: 23,
    PIN_SCL: 24,
    PIN_SDA: 25,
    PIN_SPEAKER_AMP: 26,
    PIN_TEMPERATURE: 27,
    PIN_TX: 28,
    PIN_TXLED: 29,
    PIN_IR_OUT: 30,
    PIN_IR_IN: 31,
    PIN_DISPLAY_SCK: 32,
    PIN_DISPLAY_MISO: 33,
    PIN_DISPLAY_MOSI: 34,
    PIN_DISPLAY_CS: 35,
    PIN_DISPLAY_DC: 36,
    DISPLAY_WIDTH: 37,
    DISPLAY_HEIGHT: 38,
    DISPLAY_CFG0: 39,
    DISPLAY_CFG1: 40,
    DISPLAY_CFG2: 41,
    DISPLAY_CFG3: 42,
    PIN_DISPLAY_RST: 43,
    PIN_DISPLAY_BL: 44,
    PIN_SERVO_1: 45,
    PIN_SERVO_2: 46,
    PIN_BTN_LEFT: 47,
    PIN_BTN_RIGHT: 48,
    PIN_BTN_UP: 49,
    PIN_BTN_DOWN: 50,
    PIN_BTN_MENU: 51,
    PIN_LED_R: 52,
    PIN_LED_G: 53,
    PIN_LED_B: 54,
    PIN_LED1: 55,
    PIN_LED2: 56,
    PIN_LED3: 57,
    PIN_LED4: 58,
    SPEAKER_VOLUME: 59,
    PIN_JACK_TX: 60,
    PIN_JACK_SENSE: 61,
    PIN_JACK_HPEN: 62,
    PIN_JACK_BZEN: 63,
    PIN_JACK_PWREN: 64,
    PIN_JACK_SND: 65,
    PIN_JACK_BUSLED: 66,
    PIN_JACK_COMMLED: 67,
    PIN_BTN_SOFT_RESET: 69,
    ACCELEROMETER_TYPE: 70,
    PIN_BTNMX_LATCH: 71,
    PIN_BTNMX_CLOCK: 72,
    PIN_BTNMX_DATA: 73,
    PIN_BTN_MENU2: 74,
    PIN_BATTSENSE: 75,
    PIN_VIBRATION: 76,
    PIN_PWREN: 77,

    PIN_A0: 100,
    PIN_A1: 101,
    PIN_A2: 102,
    PIN_A3: 103,
    PIN_A4: 104,
    PIN_A5: 105,
    PIN_A6: 106,
    PIN_A7: 107,
    PIN_A8: 108,
    PIN_A9: 109,
    PIN_A10: 110,
    PIN_A11: 111,
    PIN_A12: 112,
    PIN_A13: 113,
    PIN_A14: 114,
    PIN_A15: 115,
    PIN_D0: 150,
    PIN_D1: 151,
    PIN_D2: 152,
    PIN_D3: 153,
    PIN_D4: 154,
    PIN_D5: 155,
    PIN_D6: 156,
    PIN_D7: 157,
    PIN_D8: 158,
    PIN_D9: 159,
    PIN_D10: 160,
    PIN_D11: 161,
    PIN_D12: 162,
    PIN_D13: 163,
    PIN_D14: 164,
    PIN_D15: 165,
    NUM_NEOPIXELS: 200,
    NUM_DOTSTARS: 201,
    DEFAULT_BUTTON_MODE: 202,
    SWD_ENABLED: 203,
    FLASH_BYTES: 204,
    RAM_BYTES: 205,
    SYSTEM_HEAP_BYTES: 206,
    LOW_MEM_SIMULATION_KB: 207,
    BOOTLOADER_BOARD_ID: 208,
    UF2_FAMILY: 209,
    PINS_PORT_SIZE: 210,
    BOOTLOADER_PROTECTION: 211,
}

const enums = {
    // these are the same as the default I2C ID
    ACCELEROMETER_TYPE: {
        LIS3DH: 0x32,
        MMA8453: 0x38,
        FXOS8700: 0x3C,
        MMA8653: 0x3A,
        MSA300: 0x4C,
        MPU6050: 0x68,
    },
    UF2_FAMILY: {
        ATSAMD21: 0x68ed2b88,
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
            add(`${k}_${kk}`, enums[k][kk])
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
                        s += `    ${k}, 0x${v.toString(16)}, // ${showKV(k,v,portSize,patch)}\n`
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
                    log(`Skipping second CFG DATA at ${addrS}`)
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
                    if (isHeaderPin(pn) && lookupCfg(data, configKeys[pn]) === v)
                        vn = pn
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

    let m = /^P([A-Z])_?(\d+)$/.exec(v)
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
        let m = /(\w+)\s*=\s*(\w+)/.exec(line)
        if (!m)
            err("syntax error at config line " + lineNo)
        let kn = m[1].toUpperCase()
        let k = configKeys[kn]
        if (!k && /^_\d+$/.test(kn))
            k = parseInt(kn.slice(1))
        if (!k)
            err("Unrecognized key name: " + kn)
        cfgMap[configKeys[kn] + ""] = m[2]
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