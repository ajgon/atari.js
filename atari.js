require(['components/cpu', 'components/memory'], function(CPU, Memory) {
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

    window.Atari = Atari;

    return Atari;
});
