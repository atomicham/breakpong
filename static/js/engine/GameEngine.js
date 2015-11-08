
var GameEngine = Class.extend({
    game: null,
    commChannel: null,
    entities: [],
    systems: [],

    init: function (game) {
        this.game = game;
        this.game.createEntities(this.entities);
        this.createBaseSystems(this.systems, this.entities, this.game);
        this.game.createGameSystems(this.systems, this.entities, this.game);
        this.startDisplay();
    },

    setCommChannel: function (commChannel) {
        this.game.setCommChannel(commChannel);
    },

    startDisplay: function () {
        for (var i in this.systems) {
            if (this.systems[i].systemType === "Display") {
                this.systems[i].start(this.entities);
            }
        }
    },

    createBaseSystems: function () {
    },

    start : function()
    {
        this.game.start(true);
        var systems = this.systems;
        for (var i in systems)
        {
            systems[i].start(this.entities);
        }
    },

    stop: function () {
        this.game.stop();
        var systems = this.systems;
        for (var i in systems) {
            systems[i].stop();
        }
    }
});
