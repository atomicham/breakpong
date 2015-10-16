
var Component = Class.extend({});

// screen coordinates
var Position = Component.extend({
	name: 'Position',
	x: 0, 
	y: 0,
	// This field can be used to account for latency. It represents absolute time when this
	// information was last accurate. Communicating game instances will need to synchronize
	// their absolute time somehow.
	timeStamp: 0,
	init: function (x, y) {
		this.x = x;
		this.y = y;
	}
});

// pixels / sec
var Velocity = Component.extend({
	name: 'Velocity',
	x: 0, 
	y: 0,
	init: function (x, y) {
		this.x = x;
		this.y = y;
	}
});

var Collidable = Component.extend({
	name: 'Collidable'
});

var Ball = Component.extend({
	name: 'Ball'
});

var GoalZone = Component.extend({
	name: 'GoalZone'
});

var Color = Component.extend({
	name: 'Color',
	init: function (color) {
		this.color = color || 'white';
	}
});

var Score = Component.extend({
	name: 'Score',
	value: 0,
	init: function () {
		this.value = 0;
	}
});

var Rectangle = Component.extend({
	name: 'Rectangle',
	width: 0,
	height: 0,
	init: function (width, height) {
		this.width = width;
		this.height = height;
	}
});

var DashedLine = Class.extend({
    name: 'DashedLine',
    endX:0,
    endY:0, 
    color:'white', 
    lineWidth: 0,
    dashArray: [],

    init: function (endX, endY, color, lineWidth, dashArray) {
        this.endX = endX;
        this.endY = endY;
        this.color = color;
        this.lineWidth = lineWidth;
        this.dashArray = dashArray;
    }
});


var Text = Component.extend({
	name: 'Text'
});

var KeyControlledPaddle = Component.extend({
    name: 'KeyControlledPaddle',
    maxY: 0,
    minY: 0,
    increment: 0,
    init: function (minY, maxY, increment) {
        this.maxY = maxY;
        this.minY = minY;
        this.increment = increment;
    }
});