
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
