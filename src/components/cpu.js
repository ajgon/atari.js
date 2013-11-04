define(['src/components/data/addressmodes', 'src/components/data/opcodes'], function(ADDRESS_MODES, OPCODES) {
    var CPU = {
        // instructions table
        OPCODES: OPCODES,
        AM: ADDRESS_MODES,

        reg: {
            // REGISTERS
            // See: http://www.obelisk.demon.co.uk/6502/registers.html
            //
            // Program Counter
            PC: 0x0000,
            // Stack Pointer
            SP: 0xFF,
            // Accumulator
            A:  0x00,
            // Index Register X
            X:  0x00,
            // Index Register Y
            Y:  0x00,
            // Processor Status
            // +---+---+---+---+---+---+---+---+
            // | N | V | 1 | B | D | I | Z | C |
            // +---+---+---+---+---+---+---+---+
            // See: http://www.atarimagazines.com/compute/issue53/047_1_All_About_The_Status_Register.php
            P: 0x20 // 00100000
        },
        memory: null,
        cycles: 0,

        // Increase Program Counter
        incPC: function incPC(amount) {
            this.reg.PC = (this.reg.PC + (amount || 1)) & 0xFFFF;
        },

        // Set N,Z status bits based on argument
        setNZ: function setNZ(arg) {
            this.reg.P &= 0x7d; // clean NZ
            this.reg.P |= (arg & 0x80); // set N
            this.reg.P |= (arg === 0 ? 0x02 : 0x00);
        },
        setC: function setC(arg) {
            this.reg.P &= 0xfe; // clean C
            if (arg > 0xff) {
                this.reg.P |= 0x01;
            }
        },
        setV: function setV(M, N, result) {
            this.reg.P &= 0xBF; // clean V
            this.reg.P |= ((M^result)&(N^result)&0x80) >> 1;
        },
        // Sum two arguments, adjust cycles if pageBoundary is set
        sumWithPageBoundary: function sumWithPageBoundary(address, offset, modifier) {
            if (modifier === 1 && ((address & 0xff) + offset > 0xff)) {
                this.cycles += 1;
            }
            return address + offset;
        },
        adjustCyclesForPages: function adjustCyclesForPages(src, dst) {
            this.cycles += 1 + (((src & 0xff00) === (dst & 0xff00)) ? 0 : 1);
        },

        // Process one instruction
        step: function step() {
            var b, opcode, address, arg, result; //mnemonic, addresing, bytes, cycles, cycles_modifier;

            // Read byte from memory
            byte = this.memory.readByte(this.reg.PC);
            // Increment Program Counter
            this.incPC();
            // Retrieve opcode
            opcode = this.OPCODES[byte];
            // Increase cycles
            this.cycles += opcode[3];
            // Determing address
            switch (opcode[2]) {
                case 1:
                    break;
                case 2:
                    address = this.memory.readByte(this.reg.PC);
                    this.incPC();
                    break;
                case 3:
                    address = this.memory.readWord(this.reg.PC);
                    this.incPC(2);
                    break;
            }
            // Determine argument for address
            switch (opcode[1]) {
                case this.AM.A:
                    arg = this.reg.A;
                    break;
                case this.AM.abs:
                    arg = this.memory.readByte(address);
                    break;
                case this.AM.absX:
                    address = this.sumWithPageBoundary(address, this.reg.X, opcode[4]);
                    arg = this.memory.readByte(address);
                    break;
                case this.AM.absY:
                    address = this.sumWithPageBoundary(address, this.reg.Y, opcode[4]);
                    arg = this.memory.readByte(address);
                    break;
                case this.AM.imm:
                    arg = address;
                    break;
                case this.AM.impl:
                    arg = null;
                    break;
                case this.AM.ind:
                    address = this.memory.readWord(address);
                    arg = this.memory.readByte(address);
                    break;
                case this.AM.Xind:
                    address = this.memory.readByte(address + this.reg.X);
                    arg = this.memory.readByte(address);
                    break;
                case this.AM.indY:
                    address = this.sumWithPageBoundary(this.memory.readByte(address), this.reg.Y, opcode[4]);
                    arg = this.memory.readByte(address);
                    break;
                case this.AM.rel:
                    address = this.reg.PC + (address > 127 ? -((~(address - 1)) & 0xff) : address);
                    address = address < 0 ? address + 0x10000 : address & 0xffff;
                    arg = this.memory.readByte(address);
                    break;
                case this.AM.zpg:
                    arg = this.memory.readByte(address);
                    break;
                case this.AM.zpgX:
                    address = address + this.reg.X;
                    arg = this.memory.readByte(address);
                    break;
                case this.AM.zpgY:
                    address = address + this.reg.Y;
                    arg = this.memory.readByte(address);
                    break;
            }

            // Parse mnemonic
            switch (opcode[0]) {
                case 'ADC':
                    result = this.reg.A + arg + (this.reg.P & 0x01);
                    this.setC(result);
                    this.setV(this.reg.A, arg, result);
                    this.reg.A = result & 0xff;
                    this.setNZ(this.reg.A);
                    break;
                case 'AND':
                    this.reg.A &= arg;
                    this.setNZ(this.reg.A);
                    break;
                case 'ASL':
                    result = arg << 1;
                    this.setC(result);
                    result &= 0xff;
                    switch(opcode[1]) {
                        case this.AM.A:
                            this.reg.A = result;
                        break;
                        default:
                            this.memory.setByte(address, result);
                        break;
                    }
                    this.setNZ(result);
                    break;
                case 'BCC':
                    if((this.reg.P & 0x01) == 0x00) {
                        this.adjustCyclesForPages(this.reg.PC, address);
                        this.reg.PC = address;
                    }
                    break;
                case 'BCS':
                    if((this.reg.P & 0x01) == 0x01) {
                        this.adjustCyclesForPages(this.reg.PC, address);
                        this.reg.PC = address;
                    }
                    break;
                case 'BEQ':
                    if((this.reg.P & 0x02) == 0x02) {
                        this.adjustCyclesForPages(this.reg.PC, address);
                        this.reg.PC = address;
                    }
                    break;
                case 'LDA':
                    this.reg.A = arg;
                    this.setNZ(arg);
                    break;
                case 'LDX':
                    this.reg.X = arg;
                    this.setNZ(arg);
                    break;
                case 'LDY':
                    this.reg.Y = arg;
                    this.setNZ(arg);
                    break;
                case 'SEC':
                    this.reg.P |= 0x01;
                    break;
                case 'SED':
                    this.reg.P |= 0x08;
                    break;
                case 'SEI':
                    this.reg.P |= 0x04;
                    break;
            }
        }
    };

    return CPU;
});
