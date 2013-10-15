define(['components/data/addressmodes', 'components/data/opcodes'], function(ADDRESS_MODES, OPCODES) {
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
        memory: [],
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
                    address = this.memory.readByte(this.reg.PC) | (this.memory.readByte(this.reg.PC + 1) << 8);
                    this.incPC(2);
                    break;
            }
            // Determine argument for address
            switch (opcode[1]) {
                case this.AM.A:
                    arg = this.reg.A;
                    break;
                case this.AM.abs:
                    break;
                case this.AM.absX:
                    break;
                case this.AM.absY:
                    break;
                case this.AM.imm:
                    arg = address;
                    break;
                case this.AM.impl:
                    break;
                case this.AM.ind:
                    break;
                case this.AM.Xind:
                    break;
                case this.AM.indY:
                    break;
                case this.AM.rel:
                    break;
                case this.AM.zpg:
                    break;
                case this.AM.zpgX:
                    break;
                case this.AM.zpgY:
                    break;
            }
            
            // Parse mnemonic
            switch (opcode[0]) {
                case 'LDX':
                    this.reg.X = arg;
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
