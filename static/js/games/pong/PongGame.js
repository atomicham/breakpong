var PongGame = Game.extend({
    UP_ARROW : 38,
    DOWN_ARROW : 40,
    w_KEY : 87,
    s_KEY : 83,
    controls: null,
    upKey: null,
    downKey: null,

    //physicsupdateinterval : 10,
    //displayupdateinterval: 40,
    //paddleupdateinterval: 10,
    paddleMotionIncrement: 2,
    wallThickness: 4,
    ballSpeed: 7,
    scoreY : 35,
    canvasContainer: null,
    p1Paddle: null,
    p2Paddle: null,
    p1Score: null,
    p2Score: null,
    ball: null,
    leftPlayerScore: null,
    rightPlayerScore: null,
    entities: null,
    startupBanner : null,

    init: function (options) {
        this.upKey = this.UP_ARROW;
        this.downKey = this.DOWN_ARROW;
        this._super(options);
    },

    createEntities: function(entities)
    {
        this.entities = entities;

        this.startupBanner = new Entity()
            .addComponent(new Position(this.width / 4 - 80, this.height / 2))
            .addComponent(new Color("white"))
            .addComponent(new Text('80px "Share Tech Mono"',"BREAK PONG"));

        var canvas = new Entity()
            .addComponent(new Canvas(this.element, this.width, this.height));       

        var topWall = new Entity()
        	.addComponent(new Position(0, 0))
        	.addComponent(new Rectangle(this.width, this.wallThickness))
        	.addComponent(new Color("white"))
        	.addComponent(new Collidable());

        var bottomWall = new Entity()
        	.addComponent(new Position(0, this.height - this.wallThickness))
        	.addComponent(new Rectangle(this.width, this.wallThickness))
        	.addComponent(new Color("white"))
        	.addComponent(new Collidable());

        var net = new Entity()
        	.addComponent(new DashedLine((this.width / 2) - (this.wallThickness / 2), this.height - this.wallThickness, this.wallThickness, [10]))
        	.addComponent(new Position((this.width / 2) - (this.wallThickness / 2), this.wallThickness))
        	.addComponent(new Color("white"));

        entities.push(this.startupBanner);
        entities.push(canvas);
        entities.push(topWall);
        entities.push(bottomWall);
        entities.push(net);
    },

    createGameSystems: function (systems, entities)
    {
        systems.push(new PongDisplaySystem(entities));
        systems.push(new PongPhysicsSystem(this, entities));
        systems.push(new GoalSystem(this));
        systems.push(new KeyboardPaddleSystem());
        systems.push(new PongUpdateSystem(this));
    },

    start : function (ballStart)
    {
        var entities = this.entities;

        // remove startupBanner
        entities.splice(0, 1);

        this.ball = new Entity()
        	.addComponent(new Position(this.width / 2, this.height / 2))
        	.addComponent(new Rectangle(8, 8))
        	.addComponent(new Velocity(5, 0))
        	.addComponent(new Collidable())
        	.addComponent(new Ball())
        	.addComponent(new Color());

        this.p1Score = new Entity()
        	.addComponent(new Position(this.width / 2 - 100, this.scoreY))
        	.addComponent(new Color("cyan"))
        	.addComponent(new Text('30px "Share Tech Mono"'))
        	.addComponent(this.leftPlayerScore = new Score());

        this.p2Score = new Entity()
        	.addComponent(new Position(this.width / 2 + 50, this.scoreY))
        	.addComponent(new Color("yellow"))
        	.addComponent(new Text('30px "Share Tech Mono"'))
        	.addComponent(this.rightPlayerScore = new Score());

        this.p1Paddle = new Entity()
        	.addComponent(new Position(50, this.height / 2 + 75))
        	.addComponent(new Rectangle(8, 50))
        	.addComponent(new Collidable({ x: 1, y: 0 }))
        	.addComponent(new Paddle())
        	.addComponent(new Color("cyan"));

        this.centerPaddle(this.p1Paddle, this.height);

        this.p2Paddle = new Entity()
        	.addComponent(new Position(this.width - 50, this.height / 2 - 125))
        	.addComponent(new Rectangle(8, 50))
        	.addComponent(new Collidable({ x: -1, y: 0 }))
        	.addComponent(new Paddle())
        	.addComponent(new Color("yellow"))
        	.addComponent(new KeyControlledPaddle(this.wallThickness, this.height - this.wallThickness, this.paddleMotionIncrement, this.upKey, this.downKey));

        this.centerPaddle(this.p2Paddle, this.height);

        var p1Goal = new Entity()
        	.addComponent(new Position(this.width - this.wallThickness, this.wallThickness))
        	.addComponent(new Rectangle(this.wallThickness, this.height - this.wallThickness))
        	.addComponent(new Color("cyan"))
        	.addComponent(new GoalZone())
        	.addComponent(this.leftPlayerScore);

        var p2Goal = new Entity()
        	.addComponent(new Position(0, this.wallThickness))
        	.addComponent(new Rectangle(this.wallThickness, this.height - this.wallThickness))
        	.addComponent(new Color("yellow"))
        	.addComponent(new GoalZone())
        	.addComponent(this.rightPlayerScore);

        entities.push(this.ball);
        entities.push(this.p1Score);
        entities.push(this.p2Score);
        entities.push(this.p1Paddle);
        entities.push(this.p2Paddle);
        entities.push(p1Goal);
        entities.push(p2Goal);

        if (ballStart) {
        	    this.serve(this.ball, p2Goal, this.ballSpeed, 1);
        }
        else // create ball entity hidden
        {
            this.ball.components.Position.x = -20;
            this.ball.components.Position.y = -20;
            this.ball.components.Velocity.x = 0;
            this.ball.components.Velocity.y = 0;
        }
    },

    overlap : function (newX, newY, Rectangle, secondEntity) {
    	return !(
    		(newY + Rectangle.height <= secondEntity.components.Position.y) ||
    		(newY >= secondEntity.components.Position.y + secondEntity.components.Rectangle.height) ||
    		(newX >= secondEntity.components.Position.x + secondEntity.components.Rectangle.width) ||
    		(newX + Rectangle.width <= secondEntity.components.Position.x));
    },

    // allows collidables to be permeable from one direction, but not others.
    passthru : function (itemThatPasses, itemThatIsPassed)
    {
    	comparisonCollidable = itemThatIsPassed.components.Collidable;
    	if (comparisonCollidable.passThruVelocity && comparisonCollidable.passThruVelocity.x)
    	{
    		if ((itemThatPasses.components.Velocity.x > 0 && comparisonCollidable.passThruVelocity.x > 0) ||
    			(itemThatPasses.components.Velocity.x < 0 && comparisonCollidable.passThruVelocity.x < 0))
    		{
    			return true;
    		}
    	}
    	return false;
    },

    serve : function(ballEntity, rectangleEntity, desiredSpeed, xStartDirection)
    {
    	var rectangle = rectangleEntity.components.Rectangle;
    	var rectanglePosition = rectangleEntity.components.Position;
    	var ballPosition = ballEntity.components.Position;
    	var ballVelocity = ballEntity.components.Velocity;
    	var ballRectangle = ballEntity.components.Rectangle;
    	var protectiveYSetback = 50; // prevent appearing inside top & bottom walls
    	var protectiveXSetback = 10; // prevent appearing inside left& right walls
    	var yStartDirection = (this.randFromRange(1,10) <=5 ? -1 : 1);

    	// starting position
    	ballPosition.x = rectanglePosition.x + ((ballRectangle.width + protectiveXSetback) * xStartDirection);
    	ballPosition.y = this.randFromRange(rectanglePosition.y + protectiveYSetback, rectanglePosition.y + rectangle.height + (ballRectangle.height * xStartDirection) - protectiveYSetback);

    	// starting velocity 
    	// x determined randomly

    	var step = desiredSpeed / 10; 
    	var table = {};

    	var count = 0;
    	for (var i = 5; i < 10; i++) {
    		var entry = { x: (i * step), y: desiredSpeed - (i * step) };
    		table[count++] = entry;
    	}

    	var randIndex = this.randFromRange(0,4);
    	// make sure that x velocity accounts for at least 60% (serves have more forward motion than vertical motion)
    	//ballVelocity.x = this.randFromRange(desiredSpeed - (desiredSpeed * 0.3), desiredSpeed - (desiredSpeed * 0.1));
    	ballVelocity.x = table[randIndex].x * xStartDirection;
    	ballVelocity.y = table[randIndex].y * yStartDirection;


    	// apply X direction
    	ballVelocity.x *= xStartDirection;
    },

    randFromRange : function (min, max)
    {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    bounce : function(newX, newY, bouncingEntity, surface)
    {
    	var ballVelocity = bouncingEntity.components.Velocity;
    	var ballPosition = bouncingEntity.components.Position;
    	var ballRectangle = bouncingEntity.components.Rectangle;
    	var surfacePosition = surface.components.Position;
    	var surfaceRectangle = surface.components.Rectangle;

    	// determine Overlapping Side, so we know which way to bounce. 

    	var hitVerticalSurface = false;
    	var hitHorizontalSurface = false;

    	//               ^
    	//               |
    	//             +---+
    	//          +--| A |---+ 
    	//          |  +---+   |
    	//      +----+       +----+ 
    	//  <-- |  C |       | D  |  -->
    	//      +----+       +----+
    	//          |          |
    	//          |  +---+  +---+
    	//          +--| B |--| E | -?>
    	//             +---+  +---+ 
    	//               |      ?    
    	//               V      V

    	// TOP
    	if (this.pointContainedWithinRectangle(newX, newY + ballRectangle.height, surfaceRectangle, surfacePosition) &&
    		this.pointContainedWithinRectangle(newX + ballRectangle.width, newY + ballRectangle.height, surfaceRectangle, surfacePosition))
    	{
    		hitHorizontalSurface = true;
    	}
    	// BOTTOM
    	else if(this.pointContainedWithinRectangle(newX,newY,surfaceRectangle,surfacePosition) &&
    		this.pointContainedWithinRectangle(newX + ballRectangle.width, newY, surfaceRectangle, surfacePosition))
    	{
    		hitHorizontalSurface = true;
    	}
    	// LEFT
    	else if(this.pointContainedWithinRectangle(newX,newY,surfaceRectangle,surfacePosition) &&
    		this.pointContainedWithinRectangle(newX, newY + ballRectangle.height, surfaceRectangle, surfacePosition))
    	{
    		hitVerticalSurface = true;
    	}
    	// RIGHT
    	else if (this.pointContainedWithinRectangle(newX + ballRectangle.width, newY, surfaceRectangle, surfacePosition) &&
    		this.pointContainedWithinRectangle(newX + ballRectangle.width, newY + ballRectangle.height, surfaceRectangle, surfacePosition))
    	{
    		hitVerticalSurface = true;
    	}
    	else
    	{
    		hitVerticalSurface = true;
    	}

    	// if you hit vertical surface, change the x sign
    	// if you hit horizontal surface, change the y sign
    	//
    	//        -,+   0,+   +,+
    	//      0-----------------N
    	//      |       0,-       |
    	//  +,- |    -,-   +,-    | -,- 
    	//      |       \ /       |
    	//  +,0 | -,0    +    +,0 | -,0
    	//      |       / \       |
    	//  +,+ |    -,+   +,+    | +,-
    	//      |       0,+       |
    	//      N-----------------N
    	//        -,-   0,-   +,-

    	if (hitVerticalSurface)
    	{
    		ballVelocity.x *= -1;
    	}

    	if (hitHorizontalSurface)
    	{
    		ballVelocity.y *= -1;
    	}

    	//  paddle hit zones allow ball trajectory to vary somewhat
    	//   +--+  ^
    	//   |  | /
    	//   |  |   
    	//   |  |  -->
    	//   |  | 
    	//   |  | \
    	//   +--+  v

    	if (!!surface.components.Paddle)
    	{
    		var change = 0.4;
    		var xSign = ((ballVelocity.x / -1) > 0 ? -1 : 1);
    		var ySign = ((ballVelocity.y / -1) > 0 ? -1 : 1);

    		if (ballPosition.y < surfacePosition.y + (surfaceRectangle.height / 3) || ballPosition.y > surfacePosition.y + ((surfaceRectangle.height / 3) * 2))
    		{
    			// (constrain so you never decrease X to < 60% of absoluteSpeed)
    			var absoluteSpeed = Math.sqrt( Math.pow(ballVelocity.x,2) + Math.pow(ballVelocity.y,2));
    			var minX = Math.sqrt(Math.pow(absoluteSpeed,2) - Math.pow(absoluteSpeed * 0.4,2));

    			if (Math.abs(ballVelocity.x) - change > minX)
    			{
    				ballVelocity.x -= (change * xSign);
    				ballVelocity.y += (change * ySign);
    			}
    		}
    	}
    },

    pointContainedWithinRectangle : function(x,y, rectangle, rectanglePosition)
    {
    	if(x >= rectanglePosition.x && 
    		x <= rectanglePosition.x + rectangle.width &&
    		y >= rectanglePosition.y &&
    		y <= rectanglePosition.y + rectangle.height)
    	{
    		return true;
    	}
    	else
    	{
    		return false;
    	}
    },

    centerPaddle: function(paddle, height)
    {
    	paddle.components.Position.y = (height / 2) - (paddle.components.Rectangle.height / 2);
    }
});
