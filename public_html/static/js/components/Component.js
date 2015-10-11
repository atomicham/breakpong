
var Component = Class.extend({
    checkForCollisions: false,

    componentType: "Component",

    // screen coordinates
    position: { x: 0, y: 0 },

    // pixels / sec
    velocity: { x: 0, y: 0 },

    hitBox : {x:0, y:0, width:0, height:0},

    // This field can be used to account for latency. It represents absolute time when this
    // information was last accurate. Communicating game instances will need to synchronize
    // their absolute time somehow.
    timeStamp: 0,

    init: function () {
        // this._super();
    },

    // override this method to handle when sytem detects collisions (change direction, stop moving, explode, etc...)
    collision: function () {}
});