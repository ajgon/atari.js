define(function() {

    var Memory = {
        // Simple code:
        // SEC
        // SED
        // SEI
        // LDX #$69
        // LDX #$00
        // LDX #$ff
        data: [0x38, 0xF8, 0x78, 0xA2, 0x69, 0xA2, 0x00, 0xA2, 0xFF],
        readByte: function readByte(address) {
            return this.data[address];
        },
        readWord: function readWord(address) {
            return this.readByte(address) | (this.readByte(address + 1) << 8);
        }
    };

    return Memory;
});
