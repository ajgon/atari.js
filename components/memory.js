var Atari = this.Atari || {};

/**
 * Atari memory emulation
 *
 * @param {integer} size Memory size in bytes
 * @param {boolean} writable Is memory writable?
 */
Atari.Memory = function Memory(size, writable) {
    var i;

    this.data = [];
    this.size = size;
    this.writable = writable === undefined ? true : writable;

    // As seen in http://www.atarimagazines.com/compute/issue43/203_1_INSIGHT_Atari.php
    this.BANK_TYPES = {
        RAM_32K:   0x0000, // 32k of freely writable ram
        ROM_DEBUG: 0x5000, // Diagnostic ROM
        RAM_8K:    0x8000, // 8k extra 8K of RAM of Microsoft basic
        ROM_BASIC: 0xA000, // Atari Basic ROM
        ROM_ICS:   0xC000, // International Character Set
        ROM_OS:    0xC400, // Atari OS ROM
        ROM_IO:    0xD000, // Input/Output ports
        ROM_FLOAT: 0xD800, // Floating point ROM
        ROM_CHAR:  0xE000, // Character Set ROM
        ROM_OS2:   0xE400  // Extra OS ROM
    };

    for(i = 0; i < size; i += 1) {
        this.data[i] = 0;
    }
};

Atari.Memory.prototype = {
    /**
     * Loads data to memory, starting with given offset.
     *
     * @param  {string} data   Data string
     * @param  {integer} offset Beginning address (default 0x0000)
     */
    load: function load(data, bank_type) {
        var i,
            data_len = data.length;
        offset = this.BANK_TYPES[bank_type] ? this.BANK_TYPES[bank_type] : 0;

        for (i = 0; i < data_len; i += 1) {
            this.data[i + offset] = data[i];
        }
    }
};
