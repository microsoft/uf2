import json
import re

# Stolen from uf2conv.py

families = {
    'SAMD21': 0x68ed2b88,
    'SAML21': 0x1851780a,
    'SAMD51': 0x55114460,
    'NRF52': 0x1b57745f,
    'STM32F0': 0x647824b6,
    'STM32F1': 0x5ee21072,
    'STM32F2': 0x5d1a0a2e,
    'STM32F3': 0x6b846188,
    'STM32F4': 0x57755a57,
    'STM32F7': 0x53b80f00,
    'STM32G0': 0x300f5633,
    'STM32G4': 0x4c71240a,
    'STM32H7': 0x6db66082,
    'STM32L0': 0x202e3a91,
    'STM32L1': 0x1e1f432d,
    'STM32L4': 0x00ff6919,
    'STM32L5': 0x04240bdf,
    'STM32WB': 0x70d16653,
    'STM32WL': 0x21460ff0,
    'ATMEGA32': 0x16573617,
    'MIMXRT10XX': 0x4FB2D5BD,
    'LPC55': 0x2abc77ec,
    'GD32F350': 0x31D228C6,
    'ESP32S2': 0xbfdd4eee,
    'RP2040': 0xe48bff56
}

# https://stackoverflow.com/questions/483666/reverse-invert-a-dictionary-mapping
ids_to_short_names = {v: k for k, v in families.items()}

# Stolen from README.md

readme_lines = """
* Microchip (Atmel) SAMD21 - 0x68ed2b88
* Microchip (Atmel) SAML21 - 0x1851780a
* Microchip (Atmel) SAMD51 - 0x55114460
* Nordic NRF52840 - 0xada52840
* ST STM32F0xx - 0x647824b6
* ST STM32F103 - 0x5ee21072
* ST STM32F2xx - 0x5d1a0a2e
* ST STM32F3xx - 0x6b846188
* ST STM32F401 - 0x57755a57
* ST STM32F407 - 0x6d0922fa
* ST STM32F407VG - 0x8fb060fe
* ST STM32F7xx - 0x53b80f00
* ST STM32G0xx - 0x300f5633
* ST STM32G4xx - 0x4c71240a
* ST STM32H7xx - 0x6db66082
* ST STM32L0xx - 0x202e3a91
* ST STM32L1xx - 0x1e1f432d
* ST STM32L4xx - 0x00ff6919
* ST STM32L5xx - 0x04240bdf
* ST STM32WBxx - 0x70d16653
* ST STM32WLxx - 0x21460ff0
* Microchip (Atmel) ATmega32 - 0x16573617
* Cypress FX2 - 0x5a18069b
* ESP8266 - 0x7eab61ed
* ESP32 - 0x1c5f21b0
* ESP32-S2 - 0xbfdd4eee
* ESP32-C3 - 0xd42ba06c
* ESP32-S3 - 0xc47e5767 
* NXP i.MX RT10XX - 0x4fb2d5bd
* NXP LPC55xx - 0x2abc77ec
* NXP KL32L2x - 0x7f83e793
* GD32F350 - 0x31d228c6
* Raspberry Pi RP2040 - 0xe48bff56
"""

ids_to_descriptions = dict()

pattern = re.compile(r"^\*\s+(?P<description>.*)\s+-\s+(?P<id>\S+)\s*$")

for line in filter(None, readme_lines.splitlines()):
    match = pattern.match(line)
    id = int(match["id"], 16)
    description = match["description"]

    if id in ids_to_descriptions:
        print(f"! Found README duplicate 0x{id:x} {description}")

    ids_to_descriptions[id] = description

# OK, so we have ids_to_short_names and ids_to_descriptions, let's check the
# integrity

descriptions_id_set = set(ids_to_descriptions)
short_names_id_set = set(ids_to_short_names)

for id in descriptions_id_set - short_names_id_set:
    print(f"! 0x{id:x} was not in Python")

for id in short_names_id_set - descriptions_id_set:
    print(f"! 0x{id:x} was not in README")

# That illustrates the problem

# Output what we can

final_elements = []

for id in descriptions_id_set | short_names_id_set:
    final_elements.append({"id": f"0x{id:x}", "short_name": ids_to_short_names.get(id, "!!!"), "description": ids_to_descriptions.get(id, "!!!") })

# Get a canonical order for final_elements based on ID

final_elements.sort(key = lambda element: element["id"])

# Output the final file

with open("uf2families.json", "w+") as output_file:
    json.dump(final_elements, output_file, indent = 4)
