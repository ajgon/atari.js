define(['src/atari'], function(Atari) {

    describe('Atari CPU', function() {
        var CPU = Atari.CPU,
            testN = function testN(N) {
                expect(CPU.reg.P & 0x80).toEqual(N ? 0x80 : 0x00);
            }
            testV = function testV(V) {
                expect(CPU.reg.P & 0x40).toEqual(V ? 0x40 : 0x00);
            }
            testB = function testB(B) {
                expect(CPU.reg.P & 0x10).toEqual(B ? 0x10 : 0x00);
            }
            testD = function testD(D) {
                expect(CPU.reg.P & 0x08).toEqual(D ? 0x08 : 0x00);
            }
            testI = function testI(I) {
                expect(CPU.reg.P & 0x04).toEqual(I ? 0x04 : 0x00);
            }
            testZ = function testZ(Z) {
                expect(CPU.reg.P & 0x02).toEqual(Z ? 0x02 : 0x00);
            }
            testC = function testC(C) {
                expect(CPU.reg.P & 0x01).toEqual(C ? 0x01 : 0x00);
            }
            testStack = function testStack(sp, value) {
                expect(CPU.memory.data[0x100 + sp]).toEqual(value);
            }

        beforeEach(function() {
            CPU.reg = {
                PC: 0x0000,
                S:  0xFF,
                A:  0x00,
                X:  0x00,
                Y:  0x00,
                P: 0x20 // 00100000
            };
            CPU.cycles = 0;
            CPU.memory.data = [];
        });

        describe('ADC', function() {
            it('LDA #$64; ADC #$1B', function() {
                CPU.memory.data = [0xA9, 0x64, 0x69, 0x1B];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x7F);
                testN(0);
                testZ(0);
                testC(0);
                testV(0);
            });

            it('LDA #$64; ADC #$9C', function() {
                CPU.memory.data = [0xA9, 0x64, 0x69, 0x9C];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x00);
                testN(0);
                testZ(1);
                testC(1);
                testV(0);
            });

            it('LDA #$64; ADC #$1C', function() {
                CPU.memory.data = [0xA9, 0x64, 0x69, 0x1C];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x80);
                testN(1);
                testZ(0);
                testC(0);
                testV(1);
            });

            it('LDA #$D0, ADC #$90', function() {
                CPU.memory.data = [0xA9, 0xD0, 0x69, 0x90];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x60);
                testN(0);
                testZ(0);
                testC(1);
                testV(1);
            });

            it('SEC; LDA #$40; ADC #$3F', function() {
                CPU.memory.data = [0x38, 0xA9, 0x40, 0x69, 0x3F];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                expect(CPU.reg.A).toEqual(0x80);
                testN(1);
                testZ(0);
                testC(0);
                testV(1);
            });

            it('SEC; LDA #$80; ADC #$7F', function() {
                CPU.memory.data = [0x38, 0xA9, 0x80, 0x69, 0x7F];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                expect(CPU.reg.A).toEqual(0x00);
                testN(0);
                testZ(1);
                testC(1);
                testV(0);
            });

            it('LDA #$15; ADC $01', function() {
                CPU.memory.data = [0xA9, 0x15, 0x65, 0x01];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.A).toEqual(0x2A);
                testN(0);
                testZ(0);
                testC(0);
                testV(0);
            });

            it('LDX #$03; LDA #$25; ADC $01,X', function() {
                CPU.memory.data = [0xA2, 0x03, 0xA9, 0x25, 0x75, 0x01];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
                expect(CPU.reg.A).toEqual(0x9A);
                testN(1);
                testZ(0);
                testC(0);
                testV(1);
            });

            it('LDA #$25; ADC $0347', function() {
                CPU.memory.data = [0xA9, 0x25, 0x6D, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0xFA;
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                expect(CPU.reg.A).toEqual(0x1F);
                testN(0);
                testZ(0);
                testC(1);
                testV(0);
            });

            it('LDX #$03; LDA #$25; ADC $0347,X', function() {
                CPU.memory.data = [0xA2, 0x03, 0xA9, 0x25, 0x7D, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0xFA;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
                expect(CPU.reg.A).toEqual(0x67);
                testN(0);
                testZ(0);
                testC(0);
                testV(0);
            });

            it('LDY #$03; LDA #$25; ADC $0347,Y', function() {
                CPU.memory.data = [0xA0, 0x03, 0xA9, 0x25, 0x79, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0xFA;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
                expect(CPU.reg.A).toEqual(0x67);
                testN(0);
                testZ(0);
                testC(0);
                testV(0);
            });

            it('LDX #$02; LDA #$25; ADC ($04,X)', function() {
                CPU.memory.data = [0xA2, 0x02, 0xA9, 0x25, 0x61, 0x04, 0x07, 0x7F];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(10);
                expect(CPU.reg.A).toEqual(0xA4);
                testN(1);
                testZ(0);
                testC(0);
                testV(1);
            });

            it('LDY #$02; LDA #$25; ADC ($06),Y', function() {
                CPU.memory.data = [0xA0, 0x02, 0xA9, 0x25, 0x71, 0x06, 0x05, 0x7F];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(9);
                expect(CPU.reg.A).toEqual(0xA4);
                testN(1);
                testZ(0);
                testC(0);
                testV(1);
            });

        });

        describe('AND', function() {
            it('LDA #$2F; AND #$3A', function() {
                CPU.memory.data = [0xA9, 0x2F, 0x29, 0x3A];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x2A);
                testN(0);
                testZ(0);
            });

            it('LDA #$AA; AND #$D5', function() {
                CPU.memory.data = [0xA9, 0xAA, 0x29, 0xD5];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x80);
                testN(1);
                testZ(0);
            });

            it('LDA #$AA; AND #$55', function() {
                CPU.memory.data = [0xA9, 0xAA, 0x29, 0x55];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0);
                testN(0);
                testZ(1);
            });

            it('LDA #$2F; AND $04', function() {
                CPU.memory.data = [0xA9, 0x2F, 0x25, 0x04, 0x3A];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.A).toEqual(0x2A);
                testN(0);
                testZ(0);
            });

            it('LDX #$01; LDA#$2F; AND $05,X', function() {
                CPU.memory.data = [0xA2, 0x01, 0xA9, 0x2F, 0x35, 0x05, 0x3A];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
                expect(CPU.reg.A).toEqual(0x2A);
                testN(0);
                testZ(0);
            });

            it('LDA #$2F; AND $0347', function() {
                CPU.memory.data = [0xA9, 0x2F, 0x2D, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x3A;
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                expect(CPU.reg.A).toEqual(0x2A);
                testN(0);
                testZ(0);
            });

            it('LDX #$03; LDA #$2F; AND $0347,X', function() {
                CPU.memory.data = [0xA2, 0x03, 0xA9, 0x2F, 0x3D, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x1F;
                CPU.memory.data[0x034A] = 0x3A;
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
                expect(CPU.reg.A).toEqual(0x2A);
                testN(0);
                testZ(0);
            });

            it('LDY #$03; LDA #$2F; AND $0347,Y', function() {
                CPU.memory.data = [0xA0, 0x03, 0xA9, 0x2F, 0x39, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x1F;
                CPU.memory.data[0x034A] = 0x3A;
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
                expect(CPU.reg.A).toEqual(0x2A);
                testN(0);
                testZ(0);
            });

            it('LDX #$02; LDA #$2F; AND ($04,X)', function() {
                CPU.memory.data = [0xA2, 0x02, 0xA9, 0x2F, 0x21, 0x04, 0x07, 0x3A];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(10);
                expect(CPU.reg.A).toEqual(0x2A);
                testN(0);
                testZ(0);
            });

            it('LDY #$02; LDA #$2F; AND ($06),Y', function() {
                CPU.memory.data = [0xA0, 0x02, 0xA9, 0x2F, 0x31, 0x06, 0x05, 0x3A];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(9);
                expect(CPU.reg.A).toEqual(0x2A);
                testN(0);
                testZ(0);
            });

        });

        describe('ASL', function() {
            it('LDA #$0A; ASL A', function() {
                CPU.memory.data = [0xA9, 0x0A, 0x0A];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x14);
                testN(0);
                testZ(0);
                testC(0);
            });

            it('LDA #$7F; ASL A', function() {
                CPU.memory.data = [0xA9, 0x7F, 0x0A];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0xFE);
                testN(1);
                testZ(0);
                testC(0);
            });

            it('LDA #$00; ASL A', function() {
                CPU.memory.data = [0xA9, 0x00, 0x0A];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x00);
                testN(0);
                testZ(1);
                testC(0);
            });

            it('LDA #$80; ASL A', function() {
                CPU.memory.data = [0xA9, 0x80, 0x0A];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x00);
                testN(0);
                testZ(1);
                testC(1);
            });

            it('SEC; LDA #$04; ASL A', function() {
                CPU.memory.data = [0x38, 0xA9, 0x04, 0x0A];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                expect(CPU.reg.A).toEqual(0x08);
                testN(0);
                testZ(0);
                testC(0);
            });

            it('ASL $02', function() {
                CPU.memory.data = [0x06, 0x02, 0x04];
                CPU.step();
                expect(CPU.cycles).toEqual(5);
                expect(CPU.memory.data[0x02]).toEqual(0x08);
            });

            it('LDX #$01; ASL $03,X', function() {
                CPU.memory.data = [0xA2, 0x01, 0x16, 0x03, 0x08];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
                expect(CPU.memory.data[0x04]).toEqual(0x10);
            });

            it('ASL $1234', function() {
                CPU.memory.data = [0x0E, 0x34, 0x12];
                CPU.memory.data[0x1234] = 0x02;
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                expect(CPU.memory.data[0x1234]).toEqual(0x04);
            });

            it('LDX #$06; ASL $1234,X', function() {
                CPU.memory.data = [0xA2, 0x06, 0x1E, 0x34, 0x12];
                CPU.memory.data[0x1234] = 0x2F;
                CPU.memory.data[0x123A] = 0x10;
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(9);
                expect(CPU.memory.data[0x123A]).toEqual(0x20);
            });
        });

        describe('BCC', function() {
            it('BCC $01; SED; SEI', function() {
                CPU.memory.data = [0x90, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(5);
                testC(0);
                testI(1);
                testD(0);
            });

            it('SEC; BCC $01; SED; SEI', function() {
                CPU.memory.data = [0x38, 0x90, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                testC(1);
                testI(0);
                testD(1);
            });

            it('BCC $F0 (different pages, jump)', function() {
                CPU.memory.data = [0x90, 0xF0];
                CPU.step();
                expect(CPU.cycles).toEqual(4);
            });

            it('SEC; BCC $F0 (different pages, no jump)', function() {
                CPU.memory.data = [0x38, 0x90, 0xF0];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
            });
        });

        describe('BCS', function() {
            it('BCS $01; SED; SEI', function() {
                CPU.memory.data = [0xB0, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                testC(0);
                testI(0);
                testD(1);
            });

            it('SEC; BCS $01; SED; SEI', function() {
                CPU.memory.data = [0x38, 0xB0, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(7);
                testC(1);
                testI(1);
                testD(0);
            });

            it('SEC; BCS $F0 (different pages, jump)', function() {
                CPU.memory.data = [0x38, 0xB0, 0xF0];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
            });

            it('BCS $F0 (different pages, no jump)', function() {
                CPU.memory.data = [0xB0, 0xF0];
                CPU.step();
                expect(CPU.cycles).toEqual(2);
            });
        });

        describe('BEQ', function() {
            it('BEQ $01; SED; SEI', function() {
                CPU.memory.data = [0xF0, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                testZ(0);
                testI(0);
                testD(1);
            });

            it('LDA #$00; BEQ $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0x00, 0xF0, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(7);
                testZ(1);
                testI(1);
                testD(0);
            });

            it('LDA #$00; BEQ $F0 (different pages, jump)', function() {
                CPU.memory.data = [0xA9, 0x00, 0xF0, 0xF0];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
            });

            it('BEQ $F0 (different pages, no jump)', function() {
                CPU.memory.data = [0xF0, 0xF0];
                CPU.step();
                expect(CPU.cycles).toEqual(2);
            });
        });

        describe('BIT', function() {
            it('LDA #$00; BIT $04', function() {
                CPU.memory.data = [0xA9, 0x00, 0x24, 0x04, 0xC0];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.A).toEqual(0);
                testN(1);
                testV(1);
                testZ(1);
            });

            it('LDA #$FF; BIT $04', function() {
                CPU.memory.data = [0xA9, 0xFF, 0x24, 0x04, 0x03];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.A).toEqual(0xFF);
                testN(0);
                testV(0);
                testZ(0);
            });

            it('LDA #$FF; BIT $04', function() {
                CPU.memory.data = [0xA9, 0xFF, 0x24, 0x04, 0x80];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.A).toEqual(0xFF);
                testN(1);
                testV(0);
                testZ(0);
            });

            it('LDA #$00; BIT $04', function() {
                CPU.memory.data = [0xA9, 0x00, 0x24, 0x04, 0x40];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.A).toEqual(0x00);
                testN(0);
                testV(1);
                testZ(1);
            });

            it('LDA #$00; BIT $1410', function() {
                CPU.memory.data = [0xA9, 0x00, 0x2C, 0x10, 0x14];
                CPU.memory.data[0x1410] = 0xC0;
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                expect(CPU.reg.A).toEqual(0);
                testN(1);
                testV(1);
                testZ(1);
            });
        });

        describe('BMI', function() {
            it('LDA #$00; BMI $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0x00, 0x30, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                testN(0);
                testI(0);
                testD(1);
            });

            it('LDA #$FF; BMI $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0xFF, 0x30, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(7);
                testN(1);
                testI(1);
                testD(0);
            });

            it('LDA #$FF; BMI $F0 (different pages, jump)', function() {
                CPU.memory.data = [0xA9, 0xFF, 0x30, 0xF0];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
            });

            it('LDA #$00; BMI $F0 (different pages, no jump)', function() {
                CPU.memory.data = [0xA9, 0x00, 0x30, 0xF0];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
            });
        });

        describe('BNE', function() {
            it('LDA #$00; BNE $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0x00, 0xD0, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                testZ(1);
                testI(0);
                testD(1);
            });

            it('LDA #$FF; BNE $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0xFF, 0xD0, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(7);
                testZ(0);
                testI(1);
                testD(0);
            });

            it('LDA #$FF; BNE $F0 (different pages, jump)', function() {
                CPU.memory.data = [0xA9, 0xFF, 0xD0, 0xF0];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
            });

            it('LDA #$00; BNE $F0 (different pages, no jump)', function() {
                CPU.memory.data = [0xA9, 0x00, 0xD0, 0xF0];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
            });
        });

        describe('BPL', function() {
            it('LDA #$FF; BPL $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0xFF, 0x10, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
                testN(1);
                testI(0);
                testD(1);
            });

            it('LDA #$00; BPL $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0x00, 0x10, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(7);
                testN(0);
                testI(1);
                testD(0);
            });

            it('LDA #$00; BPL $F0 (different pages, jump)', function() {
                CPU.memory.data = [0xA9, 0x00, 0x10, 0xF0];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
            });

            it('LDA #$FF; BPL $F0 (different pages, no jump)', function() {
                CPU.memory.data = [0xA9, 0xFF, 0x10, 0xF0];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
            });
        });

        describe('BRK', function() {
            // TODO: test interrupts
            it('LDA #$CC; BRK', function() {
                CPU.memory.data = [0xA9, 0xCC, 0x00];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(9);
                testI(1);
                testB(1);
                testStack(0xFF, 0x00);
                testStack(0xFE, 0x03);
                testStack(0xFD, 0xB0);
                expect(CPU.reg.S).toEqual(0xFC);
            });
        });

        describe('BVC', function() {
            it('LDA #$64; ADC #$1C; BVC $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0x64, 0x69, 0x1C, 0x50, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
                testV(1);
                testI(0);
                testD(1);
            });

            it('LDA #$10; ADC #$05; BVC $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0x10, 0x69, 0x05, 0x50, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(9);
                testV(0);
                testI(1);
                testD(0);
            });

            it('LDA #$10; ADC #$05; BVC $F0 (different pages, jump)', function() {
                CPU.memory.data = [0xA9, 0x10, 0x69, 0x05, 0x50, 0xF0];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
            });

            it('LDA #$64; ADC #$1C; BVC $F0 (different pages, no jump)', function() {
                CPU.memory.data = [0xA9, 0x64, 0x69, 0x1C, 0x50, 0xF0];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
            });
        });

        describe('BVS', function() {
            it('LDA #$10; ADC #$05; BVS $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0x10, 0x69, 0x05, 0x70, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
                testV(0);
                testI(0);
                testD(1);
            });

            it('LDA #$64; ADC #$1C; BVS $01; SED; SEI', function() {
                CPU.memory.data = [0xA9, 0x64, 0x69, 0x1C, 0x70, 0x01, 0xF8, 0x78];
                CPU.step();
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(9);
                testV(1);
                testI(1);
                testD(0);
            });

            it('LDA #$64; ADC #$1C; BVS $F0 (different pages, jump)', function() {
                CPU.memory.data = [0xA9, 0x64, 0x69, 0x1C, 0x70, 0xF0];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(8);
            });

            it('LDA #$10; ADC #$05; BVS $F0 (different pages, no jump)', function() {
                CPU.memory.data = [0xA9, 0x10, 0x69, 0x05, 0x70, 0xF0];
                CPU.step();
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(6);
            });
        });

        describe('LDA', function() {
            it('LDA #$42', function() {
                CPU.memory.data = [0xA9, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA #$00', function() {
                CPU.memory.data = [0xA9, 0x00];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testN(0);
                testZ(1);
                expect(CPU.reg.A).toEqual(0x00);
            });

            it('LDA #$F5', function() {
                CPU.memory.data = [0xA9, 0xF5];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testN(1);
                testZ(0);
                expect(CPU.reg.A).toEqual(0xF5);
            });

            it('LDA $02', function() {
                CPU.memory.data = [0xA5, 0x02, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(3);
                testN(0);
                testZ(0);
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDX #$05; LDA $01,X', function() {
                CPU.memory.data = [0xA2, 0x05, 0xB5, 0x01, 0x17, 0x11, 0x42];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testN(0);
                testZ(0);
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA $0347', function() {
                CPU.memory.data = [0xAD, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                testN(0);
                testZ(0);
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDX #$03; LDA $0347,X', function() {
                CPU.memory.data = [0xA2, 0x03, 0xBD, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testN(0);
                testZ(0);
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDX #$13; LDA $03F5,X (page boundary)', function() {
                CPU.memory.data = [0xA2, 0x13, 0xBD, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(7);
                testN(0);
                testZ(0);
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDY #$03; LDA $0347,Y', function() {
                CPU.memory.data = [0xA0, 0x03, 0xB9, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testN(0);
                testZ(0);
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDY #$13; LDA $03F5,Y (page boundary)', function() {
                CPU.memory.data = [0xA0, 0x13, 0xB9, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(7);
                testN(0);
                testZ(0);
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDX #$04; LDA ($01,X)', function() {
                CPU.memory.data = [0xA2, 0x04, 0xA1, 0x01, 0x05, 0xF5];
                CPU.memory.data[0xF5] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(8);
                testN(0);
                testZ(0);
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDY #$03; LDA ($04),Y', function() {
                CPU.memory.data = [0xA0, 0x03, 0xB1, 0x04, 0x03, 0xF5, 0x42];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(7);
                testN(0);
                testZ(0);
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDY #$03; LDA ($F5),Y (page boundary)', function() {
                CPU.memory.data = [0xA0, 0x03, 0xB1, 0xF5];
                CPU.memory.data[0xF5] = 0xFE;
                CPU.memory.data[0x101] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(8);
                testN(0);
                testZ(0);
                expect(CPU.reg.A).toEqual(0x42);
            });
        });

        describe('LDX', function() {
            it('LDX #$42', function() {
                CPU.memory.data = [0xA2, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testN(0);
                testZ(0);
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDX #$00', function() {
                CPU.memory.data = [0xA2, 0x00];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testN(0);
                testZ(1);
                expect(CPU.reg.X).toEqual(0x00);
            });

            it('LDX #$F5', function() {
                CPU.memory.data = [0xA2, 0xF5];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testN(1);
                testZ(0);
                expect(CPU.reg.X).toEqual(0xF5);
            });

            it('LDX $02', function() {
                CPU.memory.data = [0xA6, 0x02, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(3);
                testN(0);
                testZ(0);
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDY #$05; LDX $01,Y', function() {
                CPU.memory.data = [0xA0, 0x05, 0xB6, 0x01, 0x17, 0x11, 0x42];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testN(0);
                testZ(0);
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDX $0347', function() {
                CPU.memory.data = [0xAE, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                testN(0);
                testZ(0);
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDY #$03; LDX $0347,Y', function() {
                CPU.memory.data = [0xA0, 0x03, 0xBE, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testN(0);
                testZ(0);
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDY #$13; LDX $03F5,Y (page boundary)', function() {
                CPU.memory.data = [0xA0, 0x13, 0xBE, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(7);
                testN(0);
                testZ(0);
                expect(CPU.reg.X).toEqual(0x42);
            });

        });

        describe('LDY', function() {
            it('LDY #$42', function() {
                CPU.memory.data = [0xA0, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testN(0);
                testZ(0);
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDY #$00', function() {
                CPU.memory.data = [0xA0, 0x00];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testN(0);
                testZ(1);
                expect(CPU.reg.Y).toEqual(0x00);
            });

            it('LDY #$F5', function() {
                CPU.memory.data = [0xA0, 0xF5];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testN(1);
                testZ(0);
                expect(CPU.reg.Y).toEqual(0xF5);
            });

            it('LDY $02', function() {
                CPU.memory.data = [0xA4, 0x02, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(3);
                testN(0);
                testZ(0);
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDX #$05; LDY $01,X', function() {
                CPU.memory.data = [0xA2, 0x05, 0xB4, 0x01, 0x17, 0x11, 0x42];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testN(0);
                testZ(0);
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDY $0347', function() {
                CPU.memory.data = [0xAC, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                testN(0);
                testZ(0);
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDX #$03; LDY $0347,X', function() {
                CPU.memory.data = [0xA2, 0x03, 0xBC, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testN(0);
                testZ(0);
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDX #$13; LDY $03F5,X (page boundary)', function() {
                CPU.memory.data = [0xA2, 0x13, 0xBC, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(7);
                testN(0);
                testZ(0);
                expect(CPU.reg.Y).toEqual(0x42);
            });

        });

        describe('CLC', function() {
            it('SEC; CLC', function() {
                CPU.memory.data = [0x38, 0x18];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                testC(0);
            });
        });

        describe('CLD', function() {
            it('SED; CLD', function() {
                CPU.memory.data = [0xF8, 0xD8];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                testD(0);
            });
        });

        describe('CLI', function() {
            it('SEI; CLI', function() {
                CPU.memory.data = [0x78, 0x58];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                testI(0);
            });
        });

        describe('CLV', function() {
            it('LDA #$64; ADC #$1C; CLV', function() {
                CPU.memory.data = [0xA9, 0x64, 0x69, 0x1C, 0xB8];
                CPU.step();
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testV(0);
            });
        });

        describe('SEC', function() {
            it('SEC', function() {
                CPU.memory.data = [0x38];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testC(1);
            });
        });

        describe('SED', function() {
            it('SED', function() {
                CPU.memory.data = [0xF8];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testD(1);
            });
        });

        describe('SEI', function() {
            it('SEI', function() {
                CPU.memory.data = [0x78];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testI(1);
            });
        });
    });
});
