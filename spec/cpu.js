define(['src/atari'], function(Atari) {
    describe('Atari CPU', function() {
        var CPU = Atari.CPU;

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


        describe('LDA', function() {
            it('LDA #$42', function() {
                CPU.memory.data = [0xA9, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA #$00', function() {
                CPU.memory.data = [0xA9, 0x00];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x02); // Z = 1
                expect(CPU.reg.A).toEqual(0x00);
            });

            it('LDA #$F5', function() {
                CPU.memory.data = [0xA9, 0xF5];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x80).toEqual(0x80); // N = 1
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0xF5);
            });

            it('LDA $02', function() {
                CPU.memory.data = [0xA5, 0x02, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(3);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA $01,X', function() {
                CPU.reg.X = 0x03;
                CPU.memory.data = [0xB5, 0x01, 0x17, 0x11, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA $0347', function() {
                CPU.memory.data = [0xAD, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA $0347,X', function() {
                CPU.reg.X = 0x03;
                CPU.memory.data = [0xBD, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA $03F5,X', function() { // Page Boundary Crossing
                CPU.reg.X = 0x13;
                CPU.memory.data = [0xBD, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA $0347,Y', function() {
                CPU.reg.Y = 0x03;
                CPU.memory.data = [0xB9, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA $03F5,Y', function() { // Page Boundary Crossing
                CPU.reg.Y = 0x13;
                CPU.memory.data = [0xB9, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA ($01,X)', function() {
                CPU.reg.X = 0x02;
                CPU.memory.data = [0xA1, 0x01, 0x05, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA ($02),Y', function() {
                CPU.reg.Y = 0x03;
                CPU.memory.data = [0xB1, 0x02, 0x01, 0xF5, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });

            it('LDA ($F5),Y', function() { // Page Boundary Crossing
                CPU.reg.Y = 0x03;
                CPU.memory.data = [0xB1, 0xF5];
                CPU.memory.data[0xF5] = 0xFE;
                CPU.memory.data[0x101] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(6);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.A).toEqual(0x42);
            });
        });

        describe('LDX', function() {
            it('LDX #$42', function() {
                CPU.memory.data = [0xA2, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDX #$00', function() {
                CPU.memory.data = [0xA2, 0x00];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x02); // Z = 1
                expect(CPU.reg.X).toEqual(0x00);
            });

            it('LDX #$F5', function() {
                CPU.memory.data = [0xA2, 0xF5];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x80).toEqual(0x80); // N = 1
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.X).toEqual(0xF5);
            });

            it('LDX $02', function() {
                CPU.memory.data = [0xA6, 0x02, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(3);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDX $01,Y', function() {
                CPU.reg.Y = 0x03;
                CPU.memory.data = [0xB6, 0x01, 0x17, 0x11, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDX $0347', function() {
                CPU.memory.data = [0xAE, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDX $0347,Y', function() {
                CPU.reg.Y = 0x03;
                CPU.memory.data = [0xBE, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

            it('LDX $03F5,Y', function() { // Page Boundary Crossing
                CPU.reg.Y = 0x13;
                CPU.memory.data = [0xBE, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.X).toEqual(0x42);
            });

        });

        describe('LDY', function() {
            it('LDY #$42', function() {
                CPU.memory.data = [0xA0, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDY #$00', function() {
                CPU.memory.data = [0xA0, 0x00];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x02); // Z = 1
                expect(CPU.reg.Y).toEqual(0x00);
            });

            it('LDY #$F5', function() {
                CPU.memory.data = [0xA0, 0xF5];
                CPU.step();

                expect(CPU.cycles).toEqual(2);
                expect(CPU.reg.P & 0x80).toEqual(0x80); // N = 1
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.Y).toEqual(0xF5);
            });

            it('LDY $02', function() {
                CPU.memory.data = [0xA4, 0x02, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(3);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDY $01,X', function() {
                CPU.reg.X = 0x03;
                CPU.memory.data = [0xB4, 0x01, 0x17, 0x11, 0x42];
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDY $0347', function() {
                CPU.memory.data = [0xAC, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDY $0347,X', function() {
                CPU.reg.X = 0x03;
                CPU.memory.data = [0xBC, 0x47, 0x03];
                CPU.memory.data[0x0347] = 0x17;
                CPU.memory.data[0x034A] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(4);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
                expect(CPU.reg.Y).toEqual(0x42);
            });

            it('LDY $03F5,X', function() { // Page Boundary Crossing
                CPU.reg.X = 0x13;
                CPU.memory.data = [0xBC, 0xF5, 0x03];
                CPU.memory.data[0x03F5] = 0x17;
                CPU.memory.data[0x0408] = 0x42;
                CPU.step();

                expect(CPU.cycles).toEqual(5);
                expect(CPU.reg.P & 0x80).toEqual(0x00); // N = 0
                expect(CPU.reg.P & 0x02).toEqual(0x00); // Z = 0
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
