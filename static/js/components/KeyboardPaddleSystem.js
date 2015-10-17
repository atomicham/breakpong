
var KeyboardPaddleSystem = System.extend({
	
    init: function (intervalPeriod) {
        KeyboardPaddleSystem.prototype.upArrowIsDown = false;
        KeyboardPaddleSystem.prototype.downArrowIsDown = false;
	    this.componentClasses = ["KeyControlledPaddle"];
	    this.setupEvents();
		this._super(intervalPeriod);
	},
	
	action: function (entity) {
	    var paddle = entity.components.KeyControlledPaddle;
	    var moveIncrement = paddle.increment;
	    var position = entity.components.Position;
	    var rectangle = entity.components.Rectangle;
	    var newY = position.y;

	    if (KeyboardPaddleSystem.prototype.upArrowIsDown)
	    {
	        newY -= moveIncrement;
	    }
	    if (KeyboardPaddleSystem.prototype.downArrowIsDown)
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
	    // up 
	    if (e.which == 38) {
	        e.stopPropagation();
	        e.preventDefault();
	        KeyboardPaddleSystem.prototype.upArrowIsDown = false;
	    }

	    // down
	    if (e.which == 40) {
	        e.stopPropagation();
	        e.preventDefault();
	        KeyboardPaddleSystem.prototype.downArrowIsDown = false;
	    }
	},

	downHandler : function(e)
    {
        // up 
        if (e.which == 38) {
            e.stopPropagation();
            e.preventDefault();
            KeyboardPaddleSystem.prototype.upArrowIsDown = true;
        }

        // down
        if (e.which == 40) {
            e.stopPropagation();
            e.preventDefault();
            KeyboardPaddleSystem.prototype.downArrowIsDown = true;
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
	},

	resetPaddle : function(entity)
    {
        // entity.position.y = (max - min / 2) - (height / 2)...
    }
});