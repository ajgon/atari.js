define(['src/components/cpu', 'src/components/memory'], function(CPU, Memory) {
    var Atari;

    Atari = {
        CPU: CPU,
        Memory: Memory,

        init: function init() {
            this.attachMemory();
        },
        attachMemory: function attachMemory() {
            CPU.memory = Memory;
        }
    };

    Atari.init();

    // 38 F8 78 A2 01 A0 02 A9 69 AD 00 00 AD 01 00 BD 01 00 B9 02 00 A1 09 B1 0A
    Atari.CPU.memory.data = [
        0x38,             // SEC
        0xF8,             // SED
        0x78,             // SEI
        0xA2, 0x01,       // LDX #$01
        0xA0, 0x02,       // LDY #$02
        0xA9, 0x69,       // LDA #$69
        0xAD, 0x00, 0x00, // LDA $00
        0xAD, 0x01, 0x00, // LDA $0001
        0xBD, 0x01, 0x00, // LDA $01,X
        0xB9, 0x02, 0x00, // LDA $02,Y
        0xA1, 0x09,       // LDA ($09,X)
        0xB1, 0x0A        // LDA ($0A),Y
    ];

    return Atari;
});
