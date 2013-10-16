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
            this.reg.P = (this.reg.P & 0x7d); // clean NZ
            this.reg.P |= (arg & 0x80); // set N
            this.reg.P |= (arg === 0 ? 0x02 : 0x00);
        },

        // Sum two arguments, adjust cycles if pageBoundary is set
        sumWithPageBoundary: function sumWithPageBoundary(address, offset, modifier) {
            if (modifier === 1 && ((address & 0xff) + offset > 0xff)) {
                this.cycles += 1;
            }
            return address + offset;
        },

        // Process one instruction
        step: function step() {
            var b, opcode, address, arg; //mnemonic, addresing, bytes, cycles, cycles_modifier;

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
                    arg = this.memory.readByte(this.sumWithPageBoundary(address, this.reg.X, opcode[4]));
                    break;
                case this.AM.absY:
                    arg = this.memory.readByte(this.sumWithPageBoundary(address, this.reg.Y, opcode[4]));
                    break;
                case this.AM.imm:
                    arg = address;
                    break;
                case this.AM.impl:
                    arg = null;
                    break;
                case this.AM.ind:
                    arg = this.memory.readByte(this.memory.readWord(address));
                    break;
                case this.AM.Xind:
                    arg = this.memory.readByte(this.memory.readWord(address + this.reg.X));
                    break;
                case this.AM.indY:
                    arg = this.memory.readByte(this.sumWithPageBoundary(this.memory.readByte(address), this.reg.Y, opcode[4]));
                    break;
                case this.AM.rel:
                    arg = this.reg.PC + (address > 127 ? -((~address) & 0xff) : address);
                    arg = this.memory.readByte(arg < 0 ? arg + 0x10000 : arg & 0xffff);
                    break;
                case this.AM.zpg:
                    arg = this.memory.readByte(address);
                    break;
                case this.AM.zpgX:
                    arg = this.memory.readByte(address + this.reg.X);
                    break;
                case this.AM.zpgY:
                    arg = this.memory.readByte(address + this.reg.Y);
                    break;
            }
            
            // Parse mnemonic
            switch (opcode[0]) {
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
