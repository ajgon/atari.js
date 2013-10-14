var Atari = this.Atari || {};

(function() {
    var AM;
    Atari.ADDRESS_MODES = {
        A:    0,   // Accumulator
        abs:  1,   // absolute
        absX: 2,   // absolute, X-indexed
        absY: 3,   // absolute, Y-indexed
        imm:  4,   // immediate
        impl: 5,   // implied
        ind:  6,   // indirect
        Xind: 7,   // X-indexed, indirect
        indY: 8,   // indirect, Y-indexed
        rel:  9,   // relative
        zpg:  10,  // zeropage
        zpgX: 11,  // zeropage, X-indexed
        zpgY: 12,  // zeropage, Y-indexed
        none: null // no address mode
    };

    AM = Atari.ADDRESS_MODES;

    // http://www.masswerk.at/6502/6502_instruction_set.html
    Atari.OPCODES = [
        /* 0x00 */ ['BRK', AM.impl],
        /* 0x01 */ ['ORA', AM.Xind],
        /* 0x02 */ ['',    AM.none],
        /* 0x03 */ ['',    AM.none],
        /* 0x04 */ ['',    AM.none],
        /* 0x05 */ ['ORA', AM.zpg ],
        /* 0x06 */ ['ASL', AM.zpg ],
        /* 0x07 */ ['',    AM.none],
        /* 0x08 */ ['PHP', AM.impl],
        /* 0x09 */ ['ORA', AM.imm ],
        /* 0x0A */ ['ASL', AM.A   ],
        /* 0x0B */ ['',    AM.none],
        /* 0x0C */ ['',    AM.none],
        /* 0x0D */ ['ORA', AM.abs ],
        /* 0x0E */ ['ORA', AM.abs ],
        /* 0x0F */ ['',    AM.none],
        /* 0x10 */ ['BPL', AM.rel ],
        /* 0x11 */ ['ORA', AM.indY],
        /* 0x12 */ ['',    AM.none],
        /* 0x13 */ ['',    AM.none],
        /* 0x14 */ ['',    AM.none],
        /* 0x15 */ ['ORA', AM.zpgX],
        /* 0x16 */ ['ASL', AM.zpgX],
        /* 0x17 */ ['',    AM.none],
        /* 0x18 */ ['CLC', AM.impl],
        /* 0x19 */ ['ORA', AM.absY],
        /* 0x1A */ ['',    AM.none],
        /* 0x1B */ ['',    AM.none],
        /* 0x1C */ ['',    AM.none],
        /* 0x1D */ ['ORA', AM.absX],
        /* 0x1E */ ['ASL', AM.absX],
        /* 0x1F */ ['',    AM.none],
        /* 0x20 */ ['JSR', AM.abs ],
        /* 0x21 */ ['AND', AM.Xind],
        /* 0x22 */ ['',    AM.none],
        /* 0x23 */ ['',    AM.none],
        /* 0x24 */ ['BIT', AM.zpg ],
        /* 0x25 */ ['AND', AM.zpg ],
        /* 0x26 */ ['ROL', AM.zpg ],
        /* 0x27 */ ['',    AM.none],
        /* 0x28 */ ['PLP', AM.impl],
        /* 0x29 */ ['AND', AM.imm ],
        /* 0x2A */ ['ROL', AM.A   ],
        /* 0x2B */ ['',    AM.none],
        /* 0x2C */ ['BIT', AM.abs ],
        /* 0x2D */ ['AND', AM.abs ],
        /* 0x2E */ ['ROL', AM.abs ],
        /* 0x2F */ ['',    AM.none],
        /* 0x30 */ ['BMI', AM.rel ],
        /* 0x31 */ ['AND', AM.indY],
        /* 0x32 */ ['',    AM.none],
        /* 0x33 */ ['',    AM.none],
        /* 0x34 */ ['',    AM.none],
        /* 0x35 */ ['AND', AM.zpgX],
        /* 0x36 */ ['ROL', AM.zpgX],
        /* 0x37 */ ['',    AM.none],
        /* 0x38 */ ['SEC', AM.impl],
        /* 0x39 */ ['AND', AM.absY],
        /* 0x3A */ ['',    AM.none],
        /* 0x3B */ ['',    AM.none],
        /* 0x3C */ ['',    AM.none],
        /* 0x3D */ ['AND', AM.absX],
        /* 0x3E */ ['ROL', AM.absX],
        /* 0x3F */ ['',    AM.none],
        /* 0x40 */ ['RTI', AM.impl],
        /* 0x41 */ ['EOR', AM.Xind],
        /* 0x42 */ ['',    AM.none],
        /* 0x43 */ ['',    AM.none],
        /* 0x44 */ ['',    AM.none],
        /* 0x45 */ ['EOR', AM.zpg ],
        /* 0x46 */ ['LSR', AM.zpg ],
        /* 0x47 */ ['',    AM.none],
        /* 0x48 */ ['PHA', AM.impl],
        /* 0x49 */ ['EOR', AM.imm ],
        /* 0x4A */ ['LSR', AM.A   ],
        /* 0x4B */ ['',    AM.none],
        /* 0x4C */ ['JMP', AM.abs ],
        /* 0x4D */ ['EOR', AM.abs ],
        /* 0x4E */ ['LSR', AM.abs ],
        /* 0x4F */ ['',    AM.none],
        /* 0x50 */ ['BVC', AM.rel ],
        /* 0x51 */ ['EOR', AM.indY],
        /* 0x52 */ ['',    AM.none],
        /* 0x53 */ ['',    AM.none],
        /* 0x54 */ ['',    AM.none],
        /* 0x55 */ ['EOR', AM.zpgX],
        /* 0x56 */ ['LSR', AM.zpgX],
        /* 0x57 */ ['',    AM.none],
        /* 0x58 */ ['CLI', AM.impl],
        /* 0x59 */ ['EOR', AM.absY],
        /* 0x5A */ ['',    AM.none],
        /* 0x5B */ ['',    AM.none],
        /* 0x5C */ ['',    AM.none],
        /* 0x5D */ ['EOR', AM.absX],
        /* 0x5E */ ['LSR', AM.absX],
        /* 0x5F */ ['',    AM.none],
        /* 0x60 */ ['RTS', AM.impl],
        /* 0x61 */ ['ADC', AM.Xind],
        /* 0x62 */ ['',    AM.none],
        /* 0x63 */ ['',    AM.none],
        /* 0x64 */ ['',    AM.none],
        /* 0x65 */ ['ADC', AM.zpg ],
        /* 0x66 */ ['ROR', AM.zpg ],
        /* 0x67 */ ['',    AM.none],
        /* 0x68 */ ['PLA', AM.impl],
        /* 0x69 */ ['ADC', AM.imm ],
        /* 0x6A */ ['ROR', AM.A   ],
        /* 0x6B */ ['',    AM.none],
        /* 0x6C */ ['JMP', AM.ind ],
        /* 0x6D */ ['ADC', AM.abs ],
        /* 0x6E */ ['ROR', AM.abs ],
        /* 0x6F */ ['',    AM.none],
        /* 0x70 */ ['BVS', AM.rel ],
        /* 0x71 */ ['ADC', AM.indY],
        /* 0x72 */ ['',    AM.none],
        /* 0x73 */ ['',    AM.none],
        /* 0x74 */ ['',    AM.none],
        /* 0x75 */ ['ADC', AM.zpgX],
        /* 0x76 */ ['ROR', AM.zpgX],
        /* 0x77 */ ['',    AM.none],
        /* 0x78 */ ['SEI', AM.impl],
        /* 0x79 */ ['ADC', AM.absY],
        /* 0x7A */ ['',    AM.none],
        /* 0x7B */ ['',    AM.none],
        /* 0x7C */ ['',    AM.none],
        /* 0x7D */ ['ADC', AM.absX],
        /* 0x7E */ ['ROR', AM.absX],
        /* 0x7F */ ['',    AM.none],
        /* 0x80 */ ['',    AM.none],
        /* 0x81 */ ['STA', AM.Xind],
        /* 0x82 */ ['',    AM.none],
        /* 0x83 */ ['',    AM.none],
        /* 0x84 */ ['STY', AM.zpg ],
        /* 0x85 */ ['STA', AM.zpg ],
        /* 0x86 */ ['STX', AM.zpg ],
        /* 0x87 */ ['',    AM.none],
        /* 0x88 */ ['DEY', AM.impl],
        /* 0x89 */ ['',    AM.none],
        /* 0x8A */ ['TXA', AM.impl],
        /* 0x8B */ ['',    AM.none],
        /* 0x8C */ ['STY', AM.abs ],
        /* 0x8D */ ['STA', AM.abs ],
        /* 0x8E */ ['STX', AM.abs ],
        /* 0x8F */ ['',    AM.none],
        /* 0x90 */ ['BCC', AM.rel ],
        /* 0x91 */ ['STA', AM.indY],
        /* 0x92 */ ['',    AM.none],
        /* 0x93 */ ['',    AM.none],
        /* 0x94 */ ['STY', AM.zpgX],
        /* 0x95 */ ['STA', AM.zpgX],
        /* 0x96 */ ['STX', AM.zpgY],
        /* 0x97 */ ['',    AM.none],
        /* 0x98 */ ['TYA', AM.impl],
        /* 0x99 */ ['STA', AM.absY],
        /* 0x9A */ ['TXS', AM.impl],
        /* 0x9B */ ['',    AM.none],
        /* 0x9C */ ['',    AM.none],
        /* 0x9D */ ['STA', AM.absX],
        /* 0x9E */ ['',    AM.none],
        /* 0x9F */ ['',    AM.none],
        /* 0xA0 */ ['LDY', AM.imm ],
        /* 0xA1 */ ['LDA', AM.Xind],
        /* 0xA2 */ ['LDX', AM.imm ],
        /* 0xA3 */ ['',    AM.none],
        /* 0xA4 */ ['LDY', AM.zpg ],
        /* 0xA5 */ ['LDA', AM.zpg ],
        /* 0xA6 */ ['LDX', AM.zpg ],
        /* 0xA7 */ ['',    AM.none],
        /* 0xA8 */ ['TAY', AM.impl],
        /* 0xA9 */ ['LDA', AM.imm],
        /* 0xAA */ ['TAX', AM.impl],
        /* 0xAB */ ['',    AM.none],
        /* 0xAC */ ['LDY', AM.abs ],
        /* 0xAD */ ['LDA', AM.abs ],
        /* 0xAE */ ['LDX', AM.abs ],
        /* 0xAF */ ['',    AM.none],
        /* 0xB0 */ ['BCS', AM.rel ],
        /* 0xB1 */ ['LDA', AM.indY],
        /* 0xB2 */ ['',    AM.none],
        /* 0xB3 */ ['',    AM.none],
        /* 0xB4 */ ['LDY', AM.zpgX],
        /* 0xB5 */ ['LDA', AM.zpgX],
        /* 0xB6 */ ['LDX', AM.zpgY],
        /* 0xB7 */ ['',    AM.none],
        /* 0xB8 */ ['CLV', AM.impl],
        /* 0xB9 */ ['LDA', AM.absY],
        /* 0xBA */ ['TSX', AM.impl],
        /* 0xBB */ ['',    AM.none],
        /* 0xBC */ ['LDY', AM.absX],
        /* 0xBD */ ['LDA', AM.absX],
        /* 0xBE */ ['LDX', AM.absY],
        /* 0xBF */ ['',    AM.none],
        /* 0xC0 */ ['CPY', AM.imm ],
        /* 0xC1 */ ['CMP', AM.Xind],
        /* 0xC2 */ ['',    AM.none],
        /* 0xC3 */ ['',    AM.none],
        /* 0xC4 */ ['CPY', AM.zpg ],
        /* 0xC5 */ ['CMP', AM.zpg ],
        /* 0xC6 */ ['DEC', AM.zpg ],
        /* 0xC7 */ ['',    AM.none],
        /* 0xC8 */ ['INY', AM.impl],
        /* 0xC9 */ ['CMP', AM.imm ],
        /* 0xCA */ ['DEX', AM.impl],
        /* 0xCB */ ['',    AM.none],
        /* 0xCC */ ['CPY', AM.abs ],
        /* 0xCD */ ['CMP', AM.abs ],
        /* 0xCE */ ['DEC', AM.abs ],
        /* 0xCF */ ['',    AM.none],
        /* 0xD0 */ ['BNE', AM.rel ],
        /* 0xD1 */ ['CMP', AM.indY],
        /* 0xD2 */ ['',    AM.none],
        /* 0xD3 */ ['',    AM.none],
        /* 0xD4 */ ['',    AM.none],
        /* 0xD5 */ ['CMP', AM.zpgX],
        /* 0xD6 */ ['DEC', AM.zpgX],
        /* 0xD7 */ ['',    AM.none],
        /* 0xD8 */ ['CLD', AM.impl],
        /* 0xD9 */ ['CMP', AM.absY],
        /* 0xDA */ ['',    AM.none],
        /* 0xDB */ ['',    AM.none],
        /* 0xDC */ ['',    AM.none],
        /* 0xDD */ ['CMP', AM.absX],
        /* 0xDE */ ['DEC', AM.absX],
        /* 0xDF */ ['',    AM.none],
        /* 0xE0 */ ['CPX', AM.imm ],
        /* 0xE1 */ ['SBV', AM.Xind],
        /* 0xE2 */ ['',    AM.none],
        /* 0xE3 */ ['',    AM.none],
        /* 0xE4 */ ['CPX', AM.zpg ],
        /* 0xE5 */ ['SBC', AM.zpg ],
        /* 0xE6 */ ['INC', AM.zpg ],
        /* 0xE7 */ ['',    AM.none],
        /* 0xE8 */ ['INX', AM.impl],
        /* 0xE9 */ ['SBC', AM.imm ],
        /* 0xEA */ ['NOP', AM.impl],
        /* 0xEB */ ['',    AM.none],
        /* 0xEC */ ['CPX', AM.abs ],
        /* 0xED */ ['SBC', AM.abs ],
        /* 0xEE */ ['INC', AM.abs ],
        /* 0xEF */ ['',    AM.none],
        /* 0xF0 */ ['BEQ', AM.rel ],
        /* 0xF1 */ ['SBC', AM.indY],
        /* 0xF2 */ ['',    AM.none],
        /* 0xF3 */ ['',    AM.none],
        /* 0xF4 */ ['',    AM.none],
        /* 0xF5 */ ['SBC', AM.zpgX],
        /* 0xF6 */ ['INC', AM.zpgX],
        /* 0xF7 */ ['',    AM.none],
        /* 0xF8 */ ['SED', AM.impl],
        /* 0xF9 */ ['SBC', AM.absY],
        /* 0xFA */ ['',    AM.none],
        /* 0xFB */ ['',    AM.none],
        /* 0xFC */ ['',    AM.none],
        /* 0xFD */ ['SBC', AM.absX],
        /* 0xFE */ ['INC', AM.absX],
        /* 0xFF */ ['',    AM.none]
    ];
}());