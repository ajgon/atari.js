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
        readByte: function readByte(index) {
            return this.data[index];
        }
    };

    return Memory;
});
