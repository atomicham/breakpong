

var Game = Class.extend({
    commChannel : null,
    element : null,
    controls : null,
    width: null,
    height : null,

    init: function (options) {
        this.element = options.element;
        this.width = options.width;
        this.height = options.height;
    },

    setCommChannel: function (commChannel) {
        this.commChannel = commChannel;
    },

    createGameSystems : function(systems, entities)
    {
        // extend this to add a game-specific systems
    },

    createEntities : function(entities)
    {
        // extend this to add a game-specific entities
    },

    start: function () {
        // extend this to add any game-specific start functionality
    },

    stop: function () {
        // extend this to add any game-specific start functionality
    }
});