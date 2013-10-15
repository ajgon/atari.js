define(function() {
    var ADDRESS_MODES = {
        A:    0,   // Accumulator
        abs:  1,   // absolute
        absX: 2,   // absolute, X-indexed
        absY: 3,   // absolute, Y-indexed
        imm:  4,   // immediate
        impl: 5,   // implied
        ind:  6,   // indirect
        Xind: 7,   // X-indexed, indirect
        indY: 8,   // indirect, Y-indexed
        rel:  9,   // relative
        zpg:  10,  // zeropage
        zpgX: 11,  // zeropage, X-indexed
        zpgY: 12,  // zeropage, Y-indexed
        none: null // no address mode
    };

    return ADDRESS_MODES;
});
