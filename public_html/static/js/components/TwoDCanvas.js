
var TwoDCanvas = Class.extend({
	canvas: null,
	context: null,
	canvasWidth : null, 
	canvasHeight : null, 
	//xCorrection: 0.5,
	//yCorrection: 0.5,
	//pixelWidth: 0.5,
	xCorrection: 0,
	yCorrection: 0,
	pixelWidth: 1,
	finishedDrawing : function () { },
	
	init : function (canvasContainer, canvasWidth, canvasHeight, finishedDrawing) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		
		var canvas = document.createElement('canvas');
		canvas.width = this.canvasWidth;
		canvas.height = this.canvasHeight;
		canvas.style.width = this.canvasWidth + 'px';
		canvas.style.height = this.canvasHeight + 'px';
		jQuery("#" + canvasContainer).append(canvas);
		
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		if (typeof finishedDrawing === "function") {
			this.finishedDrawing = finishedDrawing;
		}
	},    
	
	clear : function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	
	drawText : function (text, font, color, x, y) {
		this.context.font = font;
		this.context.fillStyle = color;
		this.context.fillText(text, x, y);
	},
	
	drawImage : function (url, x, y) {
		var self = this;
		
		var image = new Image();
		image.src = url;
		
		image.onload = function () {
			self.context.drawImage(image, x, y);
			self.finishedDrawing();
		};
		
	},
	
	fill : function (color) {
		this.context.fillStyle = color;
		this.context.rect(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2);
		this.context.fill();
	},
	
	drawEmbeddedImage: function (imageElement, x, y) {
		this.context.drawImage(imageElement, x, y);
	},
	
	drawClippedEmbeddedImage: function (imageElement, sx, sy, swidth, sheight, x, y) {
		try {
			this.context.drawImage(imageElement, sx, sy, swidth, sheight, x, y, swidth, sheight);
		} catch (ex) {
            // older webkit does not like negative indexes. When you have negative indexes, you probably don't want things shown anyway,
            // so just move a long.
		}
	},
	
	drawFrame : function (frame) {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		var polygons = frame.p;
		for (var i = 0; i < polygons.length; i++) {
			this.drawPolygon(polygons[i]);
		}
	},
	
	drawLine : function(startX,startY,endX,endY, color, width, dashArray)
	{
	    var context = this.context;

	    if (color){
	        context.strokeStyle = color;
	    }

	    if (width) {
	        context.lineWidth = width;
	    }

	    if (dashArray) {
	        context.setLineDash(dashArray);
	    }

	    context.beginPath();
	    context.moveTo(startX, startY);
	    context.lineTo(endX, endY);
	    context.stroke();
	},

	drawPolygon : function (polygon) {
		var context = this.context;
		
		var instructions = polygon.i;
		
		for (var j = 0; j < instructions.length; j++) {
			var parameters = instructions[j].p;
			
			switch (parameters[0]) {
				case "bp":// begin path
					context.beginPath();
					break;
				case "cp":// close path
					context.closePath();
					break;
				case "mt":// moveto
					var xAsInt = parseInt(parameters[1]);
					var yAsInt = parseInt(parameters[2]);
					context.moveTo(xAsInt + this.xCorrection, yAsInt + this.yCorrection);
					break;
				case "lt":// lineto
					var xAsInt = parseInt(parameters[1]);
					var yAsInt = parseInt(parameters[2]);
					context.lineTo(xAsInt + this.xCorrection, yAsInt + this.yCorrection);
					break;
				case "fi":// fill
					context.fill();
					break;
				case "th":// line thickness
					context.lineWidth = parameters[1];
					break;
				case "lc":// line color
					context.strokeStyle = parameters[1];
					break;
				case "fc":// fill color
					context.fillStyle = parameters[1];
					break;
			}
		}
	}
});
