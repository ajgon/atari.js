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
    // [mnemonic, addressing, bytes, cycles, cycles-modifier]
    // cycles-modifier = 1 - add 1 to cycles if page boundery is crossed
    // cycles-modifier = 2 - add 1 to cycles if branch occurs on same page or add 2 to cycles if branch occurs to different page
    Atari.OPCODES = [
        /* 0x00 */ ['BRK', AM.impl, 1, 7, 0],
        /* 0x01 */ ['ORA', AM.Xind, 2, 6, 0],
        /* 0x02 */ ['',    AM.none, 0, 0, 0],
        /* 0x03 */ ['',    AM.none, 0, 0, 0],
        /* 0x04 */ ['',    AM.none, 0, 0, 0],
        /* 0x05 */ ['ORA', AM.zpg,  2, 3, 0],
        /* 0x06 */ ['ASL', AM.zpg,  2, 5, 0],
        /* 0x07 */ ['',    AM.none, 0, 0, 0],
        /* 0x08 */ ['PHP', AM.impl, 1, 3, 0],
        /* 0x09 */ ['ORA', AM.imm,  2, 2, 0],
        /* 0x0A */ ['ASL', AM.A,    1, 2, 0],
        /* 0x0B */ ['',    AM.none, 0, 0, 0],
        /* 0x0C */ ['',    AM.none, 0, 0, 0],
        /* 0x0D */ ['ORA', AM.abs,  3, 4, 0],
        /* 0x0E */ ['ASL', AM.abs,  3, 6, 0],
        /* 0x0F */ ['',    AM.none, 0, 0, 0],
        /* 0x10 */ ['BPL', AM.rel,  2, 2, 2],
        /* 0x11 */ ['ORA', AM.indY, 2, 5, 1],
        /* 0x12 */ ['',    AM.none, 0, 0, 0],
        /* 0x13 */ ['',    AM.none, 0, 0, 0],
        /* 0x14 */ ['',    AM.none, 0, 0, 0],
        /* 0x15 */ ['ORA', AM.zpgX, 2, 4, 0],
        /* 0x16 */ ['ASL', AM.zpgX, 2, 6, 0],
        /* 0x17 */ ['',    AM.none, 0, 0, 0],
        /* 0x18 */ ['CLC', AM.impl, 1, 2, 0],
        /* 0x19 */ ['ORA', AM.absY, 3, 4, 1],
        /* 0x1A */ ['',    AM.none, 0, 0, 0],
        /* 0x1B */ ['',    AM.none, 0, 0, 0],
        /* 0x1C */ ['',    AM.none, 0, 0, 0],
        /* 0x1D */ ['ORA', AM.absX, 3, 4, 1],
        /* 0x1E */ ['ASL', AM.absX, 3, 7, 0],
        /* 0x1F */ ['',    AM.none, 0, 0, 0],
        /* 0x20 */ ['JSR', AM.abs,  3, 6, 0],
        /* 0x21 */ ['AND', AM.Xind, 2, 6, 0],
        /* 0x22 */ ['',    AM.none, 0, 0, 0],
        /* 0x23 */ ['',    AM.none, 0, 0, 0],
        /* 0x24 */ ['BIT', AM.zpg,  2, 3, 0],
        /* 0x25 */ ['AND', AM.zpg,  2, 2, 3],
        /* 0x26 */ ['ROL', AM.zpg,  2, 5, 0],
        /* 0x27 */ ['',    AM.none, 0, 0, 0],
        /* 0x28 */ ['PLP', AM.impl, 1, 4, 0],
        /* 0x29 */ ['AND', AM.imm,  2, 2, 0],
        /* 0x2A */ ['ROL', AM.A,    1, 2, 0],
        /* 0x2B */ ['',    AM.none, 0, 0, 0],
        /* 0x2C */ ['BIT', AM.abs,  3, 4, 0],
        /* 0x2D */ ['AND', AM.abs,  3, 4, 0],
        /* 0x2E */ ['ROL', AM.abs,  3, 6, 0],
        /* 0x2F */ ['',    AM.none, 0, 0, 0],
        /* 0x30 */ ['BMI', AM.rel,  2, 2, 2],
        /* 0x31 */ ['AND', AM.indY, 2, 5, 1],
        /* 0x32 */ ['',    AM.none, 0, 0, 0],
        /* 0x33 */ ['',    AM.none, 0, 0, 0],
        /* 0x34 */ ['',    AM.none, 0, 0, 0],
        /* 0x35 */ ['AND', AM.zpgX, 2, 4, 0],
        /* 0x36 */ ['ROL', AM.zpgX, 2, 6, 0],
        /* 0x37 */ ['',    AM.none, 0, 0, 0],
        /* 0x38 */ ['SEC', AM.impl, 1, 2, 0],
        /* 0x39 */ ['AND', AM.absY, 3, 4, 1],
        /* 0x3A */ ['',    AM.none, 0, 0, 0],
        /* 0x3B */ ['',    AM.none, 0, 0, 0],
        /* 0x3C */ ['',    AM.none, 0, 0, 0],
        /* 0x3D */ ['AND', AM.absX, 3, 4, 1],
        /* 0x3E */ ['ROL', AM.absX, 3, 7, 0],
        /* 0x3F */ ['',    AM.none, 0, 0, 0],
        /* 0x40 */ ['RTI', AM.impl, 1, 6, 0],
        /* 0x41 */ ['EOR', AM.Xind, 2, 6, 0],
        /* 0x42 */ ['',    AM.none, 0, 0, 0],
        /* 0x43 */ ['',    AM.none, 0, 0, 0],
        /* 0x44 */ ['',    AM.none, 0, 0, 0],
        /* 0x45 */ ['EOR', AM.zpg,  2, 3, 0],
        /* 0x46 */ ['LSR', AM.zpg,  2, 5, 0],
        /* 0x47 */ ['',    AM.none, 0, 0, 0],
        /* 0x48 */ ['PHA', AM.impl, 1, 3, 0],
        /* 0x49 */ ['EOR', AM.imm,  2, 2, 0],
        /* 0x4A */ ['LSR', AM.A,    1, 2, 0],
        /* 0x4B */ ['',    AM.none, 0, 0, 0],
        /* 0x4C */ ['JMP', AM.abs,  3, 3, 0],
        /* 0x4D */ ['EOR', AM.abs,  3, 4, 0],
        /* 0x4E */ ['LSR', AM.abs,  3, 6, 0],
        /* 0x4F */ ['',    AM.none, 0, 0, 0],
        /* 0x50 */ ['BVC', AM.rel,  2, 2, 2],
        /* 0x51 */ ['EOR', AM.indY, 2, 5, 1],
        /* 0x52 */ ['',    AM.none, 0, 0, 0],
        /* 0x53 */ ['',    AM.none, 0, 0, 0],
        /* 0x54 */ ['',    AM.none, 0, 0, 0],
        /* 0x55 */ ['EOR', AM.zpgX, 2, 4, 0],
        /* 0x56 */ ['LSR', AM.zpgX, 2, 6, 0],
        /* 0x57 */ ['',    AM.none, 0, 0, 0],
        /* 0x58 */ ['CLI', AM.impl, 1, 2, 0],
        /* 0x59 */ ['EOR', AM.absY, 3, 4, 1],
        /* 0x5A */ ['',    AM.none, 0, 0, 0],
        /* 0x5B */ ['',    AM.none, 0, 0, 0],
        /* 0x5C */ ['',    AM.none, 0, 0, 0],
        /* 0x5D */ ['EOR', AM.absX, 3, 4, 1],
        /* 0x5E */ ['LSR', AM.absX, 3, 7, 0],
        /* 0x5F */ ['',    AM.none, 0, 0, 0],
        /* 0x60 */ ['RTS', AM.impl, 1, 6, 0],
        /* 0x61 */ ['ADC', AM.Xind, 2, 6, 0],
        /* 0x62 */ ['',    AM.none, 0, 0, 0],
        /* 0x63 */ ['',    AM.none, 0, 0, 0],
        /* 0x64 */ ['',    AM.none, 0, 0, 0],
        /* 0x65 */ ['ADC', AM.zpg,  2, 2, 3],
        /* 0x66 */ ['ROR', AM.zpg,  2, 5, 0],
        /* 0x67 */ ['',    AM.none, 0, 0, 0],
        /* 0x68 */ ['PLA', AM.impl, 1, 4, 0],
        /* 0x69 */ ['ADC', AM.imm,  2, 2, 0],
        /* 0x6A */ ['ROR', AM.A,    1, 2, 0],
        /* 0x6B */ ['',    AM.none, 0, 0, 0],
        /* 0x6C */ ['JMP', AM.ind,  3, 5, 0],
        /* 0x6D */ ['ADC', AM.abs,  3, 4, 0],
        /* 0x6E */ ['ROR', AM.abs,  3, 6, 0],
        /* 0x6F */ ['',    AM.none, 0, 0, 0],
        /* 0x70 */ ['BVS', AM.rel,  2, 2, 2],
        /* 0x71 */ ['ADC', AM.indY, 2, 5, 0],
        /* 0x72 */ ['',    AM.none, 0, 0, 0],
        /* 0x73 */ ['',    AM.none, 0, 0, 0],
        /* 0x74 */ ['',    AM.none, 0, 0, 0],
        /* 0x75 */ ['ADC', AM.zpgX, 2, 4, 0],
        /* 0x76 */ ['ROR', AM.zpgX, 2, 6, 0],
        /* 0x77 */ ['',    AM.none, 0, 0, 0],
        /* 0x78 */ ['SEI', AM.impl, 1, 2, 0],
        /* 0x79 */ ['ADC', AM.absY, 3, 4, 1],
        /* 0x7A */ ['',    AM.none, 0, 0, 0],
        /* 0x7B */ ['',    AM.none, 0, 0, 0],
        /* 0x7C */ ['',    AM.none, 0, 0, 0],
        /* 0x7D */ ['ADC', AM.absX, 3, 4, 1],
        /* 0x7E */ ['ROR', AM.absX, 3, 7, 0],
        /* 0x7F */ ['',    AM.none, 0, 0, 0],
        /* 0x80 */ ['',    AM.none, 0, 0, 0],
        /* 0x81 */ ['STA', AM.Xind, 2, 6, 0],
        /* 0x82 */ ['',    AM.none, 0, 0, 0],
        /* 0x83 */ ['',    AM.none, 0, 0, 0],
        /* 0x84 */ ['STY', AM.zpg,  2, 3, 0],
        /* 0x85 */ ['STA', AM.zpg,  2, 3, 0],
        /* 0x86 */ ['STX', AM.zpg,  2, 3, 0],
        /* 0x87 */ ['',    AM.none, 0, 0, 0],
        /* 0x88 */ ['DEY', AM.impl, 1, 2, 0],
        /* 0x89 */ ['',    AM.none, 0, 0, 0],
        /* 0x8A */ ['TXA', AM.impl, 1, 2, 0],
        /* 0x8B */ ['',    AM.none, 0, 0, 0],
        /* 0x8C */ ['STY', AM.abs,  3, 4, 0],
        /* 0x8D */ ['STA', AM.abs,  3, 4, 0],
        /* 0x8E */ ['STX', AM.abs,  3, 4, 0],
        /* 0x8F */ ['',    AM.none, 0, 0, 0],
        /* 0x90 */ ['BCC', AM.rel,  2, 2, 2],
        /* 0x91 */ ['STA', AM.indY, 2, 6, 0],
        /* 0x92 */ ['',    AM.none, 0, 0, 0],
        /* 0x93 */ ['',    AM.none, 0, 0, 0],
        /* 0x94 */ ['STY', AM.zpgX, 2, 4, 0],
        /* 0x95 */ ['STA', AM.zpgX, 2, 4, 0],
        /* 0x96 */ ['STX', AM.zpgY, 2, 4, 0],
        /* 0x97 */ ['',    AM.none, 0, 0, 0],
        /* 0x98 */ ['TYA', AM.impl, 1, 2, 0],
        /* 0x99 */ ['STA', AM.absY, 3, 5, 0],
        /* 0x9A */ ['TXS', AM.impl, 1, 2, 0],
        /* 0x9B */ ['',    AM.none, 0, 0, 0],
        /* 0x9C */ ['',    AM.none, 0, 0, 0],
        /* 0x9D */ ['STA', AM.absX, 3, 5, 0],
        /* 0x9E */ ['',    AM.none, 0, 0, 0],
        /* 0x9F */ ['',    AM.none, 0, 0, 0],
        /* 0xA0 */ ['LDY', AM.imm,  2, 2, 0],
        /* 0xA1 */ ['LDA', AM.Xind, 2, 6, 0],
        /* 0xA2 */ ['LDX', AM.imm,  2, 2, 0],
        /* 0xA3 */ ['',    AM.none, 0, 0, 0],
        /* 0xA4 */ ['LDY', AM.zpg,  2, 3, 0],
        /* 0xA5 */ ['LDA', AM.zpg,  2, 3, 0],
        /* 0xA6 */ ['LDX', AM.zpg,  2, 3, 0],
        /* 0xA7 */ ['',    AM.none, 0, 0, 0],
        /* 0xA8 */ ['TAY', AM.impl, 1, 2, 0],
        /* 0xA9 */ ['LDA', AM.imm,  2, 2, 0],
        /* 0xAA */ ['TAX', AM.impl, 1, 2, 0],
        /* 0xAB */ ['',    AM.none, 0, 0, 0],
        /* 0xAC */ ['LDY', AM.abs,  3, 4, 0],
        /* 0xAD */ ['LDA', AM.abs,  3, 4, 0],
        /* 0xAE */ ['LDX', AM.abs,  3, 4, 0],
        /* 0xAF */ ['',    AM.none, 0, 0, 0],
        /* 0xB0 */ ['BCS', AM.rel,  2, 2, 2],
        /* 0xB1 */ ['LDA', AM.indY, 2, 5, 1],
        /* 0xB2 */ ['',    AM.none, 0, 0, 0],
        /* 0xB3 */ ['',    AM.none, 0, 0, 0],
        /* 0xB4 */ ['LDY', AM.zpgX, 2, 4, 0],
        /* 0xB5 */ ['LDA', AM.zpgX, 2, 4, 0],
        /* 0xB6 */ ['LDX', AM.zpgY, 2, 4, 0],
        /* 0xB7 */ ['',    AM.none, 0, 0, 0],
        /* 0xB8 */ ['CLV', AM.impl, 1, 2, 0],
        /* 0xB9 */ ['LDA', AM.absY, 3, 4, 1],
        /* 0xBA */ ['TSX', AM.impl, 1, 2, 0],
        /* 0xBB */ ['',    AM.none, 0, 0, 0],
        /* 0xBC */ ['LDY', AM.absX, 3, 4, 1],
        /* 0xBD */ ['LDA', AM.absX, 3, 4, 1],
        /* 0xBE */ ['LDX', AM.absY, 3, 4, 1],
        /* 0xBF */ ['',    AM.none, 0, 0, 0],
        /* 0xC0 */ ['CPY', AM.imm,  2, 2, 0],
        /* 0xC1 */ ['CMP', AM.Xind, 2, 6, 0],
        /* 0xC2 */ ['',    AM.none, 0, 0, 0],
        /* 0xC3 */ ['',    AM.none, 0, 0, 0],
        /* 0xC4 */ ['CPY', AM.zpg,  2, 3, 0],
        /* 0xC5 */ ['CMP', AM.zpg,  2, 3, 0],
        /* 0xC6 */ ['DEC', AM.zpg,  2, 5, 0],
        /* 0xC7 */ ['',    AM.none, 0, 0, 0],
        /* 0xC8 */ ['INY', AM.impl, 1, 2, 0],
        /* 0xC9 */ ['CMP', AM.imm,  2, 2, 0],
        /* 0xCA */ ['DEX', AM.impl, 1, 2, 0],
        /* 0xCB */ ['',    AM.none, 0, 0, 0],
        /* 0xCC */ ['CPY', AM.abs,  3, 4, 0],
        /* 0xCD */ ['CMP', AM.abs,  3, 4, 0],
        /* 0xCE */ ['DEC', AM.abs,  3, 3, 0],
        /* 0xCF */ ['',    AM.none, 0, 0, 0],
        /* 0xD0 */ ['BNE', AM.rel,  2, 2, 2],
        /* 0xD1 */ ['CMP', AM.indY, 2, 5, 1],
        /* 0xD2 */ ['',    AM.none, 0, 0, 0],
        /* 0xD3 */ ['',    AM.none, 0, 0, 0],
        /* 0xD4 */ ['',    AM.none, 0, 0, 0],
        /* 0xD5 */ ['CMP', AM.zpgX, 2, 4, 0],
        /* 0xD6 */ ['DEC', AM.zpgX, 2, 6, 0],
        /* 0xD7 */ ['',    AM.none, 0, 0, 0],
        /* 0xD8 */ ['CLD', AM.impl, 1, 2, 0],
        /* 0xD9 */ ['CMP', AM.absY, 3, 4, 1],
        /* 0xDA */ ['',    AM.none, 0, 0, 0],
        /* 0xDB */ ['',    AM.none, 0, 0, 0],
        /* 0xDC */ ['',    AM.none, 0, 0, 0],
        /* 0xDD */ ['CMP', AM.absX, 3, 4, 1],
        /* 0xDE */ ['DEC', AM.absX, 3, 7, 0],
        /* 0xDF */ ['',    AM.none, 0, 0, 0],
        /* 0xE0 */ ['CPX', AM.imm,  2, 2, 0],
        /* 0xE1 */ ['SBV', AM.Xind, 2, 6, 0],
        /* 0xE2 */ ['',    AM.none, 0, 0, 0],
        /* 0xE3 */ ['',    AM.none, 0, 0, 0],
        /* 0xE4 */ ['CPX', AM.zpg,  2, 3, 0],
        /* 0xE5 */ ['SBC', AM.zpg,  2, 3, 0],
        /* 0xE6 */ ['INC', AM.zpg,  2, 5, 0],
        /* 0xE7 */ ['',    AM.none, 0, 0, 0],
        /* 0xE8 */ ['INX', AM.impl, 1, 2, 0],
        /* 0xE9 */ ['SBC', AM.imm,  2, 2, 0],
        /* 0xEA */ ['NOP', AM.impl, 1, 2, 0],
        /* 0xEB */ ['',    AM.none, 0, 0, 0],
        /* 0xEC */ ['CPX', AM.abs,  3, 4, 0],
        /* 0xED */ ['SBC', AM.abs,  3, 4, 0],
        /* 0xEE */ ['INC', AM.abs,  3, 6, 0],
        /* 0xEF */ ['',    AM.none, 0, 0, 0],
        /* 0xF0 */ ['BEQ', AM.rel,  2, 2, 2],
        /* 0xF1 */ ['SBC', AM.indY, 2, 5, 1],
        /* 0xF2 */ ['',    AM.none, 0, 0, 0],
        /* 0xF3 */ ['',    AM.none, 0, 0, 0],
        /* 0xF4 */ ['',    AM.none, 0, 0, 0],
        /* 0xF5 */ ['SBC', AM.zpgX, 2, 4, 0],
        /* 0xF6 */ ['INC', AM.zpgX, 2, 6, 0],
        /* 0xF7 */ ['',    AM.none, 0, 0, 0],
        /* 0xF8 */ ['SED', AM.impl, 1, 2, 0],
        /* 0xF9 */ ['SBC', AM.absY, 3, 4, 1],
        /* 0xFA */ ['',    AM.none, 0, 0, 0],
        /* 0xFB */ ['',    AM.none, 0, 0, 0],
        /* 0xFC */ ['',    AM.none, 0, 0, 0],
        /* 0xFD */ ['SBC', AM.absX, 3, 4, 1],
        /* 0xFE */ ['INC', AM.absX, 3, 7, 0],
        /* 0xFF */ ['',    AM.none, 0, 0, 0]
    ];
}());
