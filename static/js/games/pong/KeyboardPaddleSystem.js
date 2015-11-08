
var KeyboardPaddleSystem = System.extend({
    systemType: "KeyboardPaddle",
    intervalPeriod: 2,

	init: function () {
		KeyboardPaddleSystem.prototype.pressedkeys = [];
		this.componentClasses = ["KeyControlledPaddle"];
		this.setupEvents();
		this._super(this.intervalPeriod);
	},
	
	action: function (entity) {
		var paddle = entity.components.KeyControlledPaddle;
		var moveIncrement = paddle.increment;
		var position = entity.components.Position;
		var rectangle = entity.components.Rectangle;
		var newY = position.y;

		if (KeyboardPaddleSystem.prototype.pressedkeys[paddle.upKey])
		{
			newY -= moveIncrement;
		}
		if (KeyboardPaddleSystem.prototype.pressedkeys[paddle.downKey])
		{
			newY += moveIncrement;
		}

		if (newY < paddle.minY)
		{
			newY = paddle.minY;
		}

		if (newY > (paddle.maxY - rectangle.height)) {
			newY = (paddle.maxY - rectangle.height);
		}

		position.y = newY;
	},

	upHandler: function(e)
	{
		if (e.which > 0 && e.which < 127) {
			e.stopPropagation();
			e.preventDefault();
			KeyboardPaddleSystem.prototype.pressedkeys[e.which] = false;
		}
	},

	downHandler : function(e)
	{
		if (e.which > 0 && e.which < 127) {
			e.stopPropagation();
			e.preventDefault();
			KeyboardPaddleSystem.prototype.pressedkeys[e.which] = true;
		}
	},

	setupEvents: function () {
		document.body.removeEventListener("keydown", this.downHandler);
		document.body.removeEventListener("keyUp", this.upHandler);
		document.body.addEventListener("keydown", this.downHandler);
		document.body.addEventListener("keyup", this.upHandler);
	},

	teardownEvents : function()
	{
		document.body.removeEventListener("keydown", this.downHandler);
		document.body.removeEventListener("keyUp", this.upHandler);
	}

});