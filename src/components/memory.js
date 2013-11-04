define(function() {

    var Memory = {
        data: [],
        readByte: function readByte(address) {
            return this.data[address];
        },
        setByte: function setByte(address, value) {
            this.data[address] = value;
        },
        readWord: function readWord(address) {
            return this.readByte(address) | (this.readByte(address + 1) << 8);
        }
    };

    return Memory;
});
