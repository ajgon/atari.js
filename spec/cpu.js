define(['src/atari'], function(Atari) {

    describe('Atari CPU', function() {
        var CPU = Atari.CPU,
            testNZ = function testNZ(N, Z) {
                expect(CPU.reg.P & 0x80).toEqual(N ? 0x80 : 0x00);
                expect(CPU.reg.P & 0x02).toEqual(Z ? 0x02 : 0x00);
            };
            testC = function testC(C) {
                expect(CPU.reg.P & 0x01).toEqual(C ? 0x01 : 0x00);
            };
            testV = function testV(V) {
                expect(CPU.reg.P & 0x40).toEqual(V ? 0x40 : 0x00);
            };

        beforeEach(function() {
            CPU.reg = {
                PC: 0x0000,
                SP: 0xFF,
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
                testNZ(0, 0);
                testC(0);
                testV(0);
            });

            it('LDA #$64; ADC #$9C', function() {
                CPU.memory.data = [0xA9, 0x64, 0x69, 0x9C];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x00);
                testNZ(0, 1);
                testC(1);
                testV(0);
            });

            it('LDA #$64; ADC #$1C', function() {
                CPU.memory.data = [0xA9, 0x64, 0x69, 0x1C];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x80);
                testNZ(1, 0);
                testC(0);
                testV(1);
            });

            it('LDA #$D0, ADC #$90', function() {
                CPU.memory.data = [0xA9, 0xD0, 0x69, 0x90];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x60);
                testNZ(0, 0);
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
                testNZ(1, 0);
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
                testNZ(0, 1);
                testC(1);
                testV(0);
            });

            it('LDA #$15; ADC $01', function() {
                CPU.memory.data = [0xA9, 0x15, 0x65, 0x01];
                CPU.step();
                CPU.step();
                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.A).toEqual(0x2A);
                testNZ(0, 0);
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
                testNZ(1, 0);
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
                testNZ(0, 0);
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
                testNZ(0, 0);
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
                testNZ(0, 0);
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
                testNZ(1, 0);
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
                testNZ(1, 0);
                testC(0);
                testV(1);
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
                testNZ(0, 1); // N = 0, Z = 1
                expect(CPU.reg.A).toEqual(0x00);
            });

            it('LDA #$F5', function() {
                CPU.memory.data = [0xA9, 0xF5];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testNZ(1, 0); // N = 1, Z = 0
                expect(CPU.reg.A).toEqual(0xF5);
            });

            it('LDA $02', function() {
                CPU.memory.data = [0xA5, 0x02, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(3);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDX #$05; LDA $01,X', function() {
                CPU.memory.data = [0xA2, 0x05, 0xB5, 0x01, 0x17, 0x11, 0x42];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA $0347', function() {
                CPU.memory.data = [0xAD, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDX #$03; LDA $0347,X', function() {
                CPU.memory.data = [0xA2, 0x03, 0xBD, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDX #$13; LDA $03F5,X (page boundary)', function() {
                CPU.memory.data = [0xA2, 0x13, 0xBD, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(7);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDY #$03; LDA $0347,Y', function() {
                CPU.memory.data = [0xA0, 0x03, 0xB9, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDY #$13; LDA $03F5,Y (page boundary)', function() {
                CPU.memory.data = [0xA0, 0x13, 0xB9, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(7);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDX #$04; LDA ($01,X)', function() {
                CPU.memory.data = [0xA2, 0x04, 0xA1, 0x01, 0x05, 0xF5];
                CPU.memory.data[0xF5] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(8);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDY #$03; LDA ($04),Y', function() {
                CPU.memory.data = [0xA0, 0x03, 0xB1, 0x04, 0x03, 0xF5, 0x42];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(7);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDY #$03; LDA ($F5),Y (page boundary)', function() {
                CPU.memory.data = [0xA0, 0x03, 0xB1, 0xF5];
                CPU.memory.data[0xF5] = 0xFE;
                CPU.memory.data[0x101] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(8);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });
        });

        describe('LDX', function() {
            it('LDX #$42', function() {
                CPU.memory.data = [0xA2, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDX #$00', function() {
                CPU.memory.data = [0xA2, 0x00];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testNZ(0, 1); // N = 0, Z = 1
                expect(CPU.reg.X).toEqual(0x00);
            });

            it('LDX #$F5', function() {
                CPU.memory.data = [0xA2, 0xF5];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testNZ(1, 0); // N = 1, Z = 0
                expect(CPU.reg.X).toEqual(0xF5);
            });

            it('LDX $02', function() {
                CPU.memory.data = [0xA6, 0x02, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(3);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDY #$05; LDX $01,Y', function() {
                CPU.memory.data = [0xA0, 0x05, 0xB6, 0x01, 0x17, 0x11, 0x42];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDX $0347', function() {
                CPU.memory.data = [0xAE, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDY #$03; LDX $0347,Y', function() {
                CPU.memory.data = [0xA0, 0x03, 0xBE, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDY #$13; LDX $03F5,Y (page boundary)', function() {
                CPU.memory.data = [0xA0, 0x13, 0xBE, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(7);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

        });

        describe('LDY', function() {
            it('LDY #$42', function() {
                CPU.memory.data = [0xA0, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDY #$00', function() {
                CPU.memory.data = [0xA0, 0x00];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testNZ(0, 1); // N = 0, Z = 1
                expect(CPU.reg.Y).toEqual(0x00);
            });

            it('LDY #$F5', function() {
                CPU.memory.data = [0xA0, 0xF5];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                testNZ(1, 0); // N = 1, Z = 0
                expect(CPU.reg.Y).toEqual(0xF5);
            });

            it('LDY $02', function() {
                CPU.memory.data = [0xA4, 0x02, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(3);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDX #$05; LDY $01,X', function() {
                CPU.memory.data = [0xA2, 0x05, 0xB4, 0x01, 0x17, 0x11, 0x42];
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDY $0347', function() {
                CPU.memory.data = [0xAC, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDX #$03; LDY $0347,X', function() {
                CPU.memory.data = [0xA2, 0x03, 0xBC, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDX #$13; LDY $03F5,X (page boundary)', function() {
                CPU.memory.data = [0xA2, 0x13, 0xBC, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();
                CPU.step();

                expect(CPU.cycles).toEqual(7);
                testNZ(0, 0); // N = 0, Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

        });
        describe('SEC', function() {
            it('SEC', function() {
                CPU.memory.data = [0x38];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x01).toEqual(0x01); // C = 1
            });
        });

        describe('SED', function() {
            it('SED', function() {
                CPU.memory.data = [0xF8];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x08).toEqual(0x08); // D = 1
            });
        });


        describe('SEI', function() {
            it('SEI', function() {
                CPU.memory.data = [0x78];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x04).toEqual(0x04); // I = 1
            });
        });
    });
});
