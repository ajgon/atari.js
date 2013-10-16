define(function() {

    var Memory = {
        data: [],
        readByte: function readByte(address) {
            return this.data[address];
        },
        readWord: function readWord(address) {
            return this.readByte(address) | (this.readByte(address + 1) << 8);
        }
    };

    return Memory;
});
