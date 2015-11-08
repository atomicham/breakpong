

var DashedLine = Class.extend({
	name: 'DashedLine',
	endX:0,
	endY:0,
	lineWidth: 0,
	dashArray: [],

	init: function (endX, endY, lineWidth, dashArray) {
		this.endX = endX;
		this.endY = endY;
		this.lineWidth = lineWidth;
		this.dashArray = dashArray;
	}
});
