
var KeyControlledPaddle = Component.extend({
	name: 'KeyControlledPaddle',
	maxY: 0,
	minY: 0,
	increment: 0,
    upKey:0,
    downKey:0,
	init: function (minY, maxY, increment, upKey, downKey) {
		this.maxY = maxY;
		this.minY = minY;
		this.increment = increment;
		this.upKey = upKey;
		this.downKey = downKey;
	}
});

