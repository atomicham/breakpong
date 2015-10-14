
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

var Dimensions = Component.extend({
	name: 'Dimensions',
	width: 0,
	height: 0,
	init: function (width, height) {
		this.width = width;
		this.height = height;
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

var Color = Component.extend({
	name: 'Color',
	init: function () {
		this.color = 'white';
	}
});

var Rectangle = Component.extend({
	name: 'Rectangle'
});

var Text = Component.extend({
	name: 'Text'
});