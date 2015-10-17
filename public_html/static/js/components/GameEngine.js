
var GameEngine = Class.extend({
	displayWidth: 640,
	displayHeight: 300,
	physicsUpdateInterval : 20,
	displayUpdateInterval: 40,
	paddleUpdateInterval: 10,
	paddleMotionIncrement: 3,
	wallThickness : 4,
	scoreY : 35,
	canvasContainer: null,
	leftScore: 0,
	rightScore: 0,

	init: function (canvasContainer) {
		// create entities
		var ball = System.createEntity()
			.addComponent(new Position(this.displayWidth / 2, this.displayHeight / 2))
			.addComponent(new Rectangle(8, 8))
			.addComponent(new Velocity(5, 0))
			.addComponent(new Collidable())
			.addComponent(new Ball())
			.addComponent(new Color());
		
		var ball2 = System.createEntity()
			.addComponent(new Position(this.displayWidth / 2, this.displayHeight / 2 + 10))
			.addComponent(new Rectangle(8, 8))
			.addComponent(new Velocity(-5, 0))
			.addComponent(new Collidable())
			.addComponent(new Ball())
			.addComponent(new Color("red"));
		
		var ball3 = System.createEntity()
			.addComponent(new Position(this.displayWidth / 2, this.displayHeight / 2 - 10))
			.addComponent(new Rectangle(8, 8))
			.addComponent(new Velocity(5, 0))
			.addComponent(new Collidable())
			.addComponent(new Ball())
			.addComponent(new Color("green"));
		
		var leftPlayerScore = new Score();
		var p1Score = System.createEntity()
			.addComponent(new Position(this.displayWidth / 2 - 100, this.scoreY))
			.addComponent(new Color("cyan"))
			.addComponent(new Text(this.leftScore))
			.addComponent(leftPlayerScore);
		
		var rightPlayerScore = new Score();
		var p2Score = System.createEntity()
			.addComponent(new Position(this.displayWidth / 2 + 50, this.scoreY))
			.addComponent(new Color("yellow"))
			.addComponent(new Text())
			.addComponent(rightPlayerScore);
		
		var p1Paddle = System.createEntity()
			.addComponent(new Position(50, this.displayHeight / 2 + 75))
			.addComponent(new Rectangle(8, 50))
			.addComponent(new Collidable({ x: 1, y: 0 }))
			.addComponent(new Color("cyan"));
			//.addComponent(new AIControlledPaddle(8, this.displayHeight - 8, this.paddleMotionIncrement));
		
		var p2Paddle = System.createEntity()
			.addComponent(new Position(this.displayWidth - 50, this.displayHeight / 2 - 125))
			.addComponent(new Rectangle(8, 50))
			.addComponent(new Collidable({ x: -1, y: 0 }))
			.addComponent(new Color("yellow"))
			.addComponent(new KeyControlledPaddle(this.wallThickness, this.displayHeight - this.wallThickness, this.paddleMotionIncrement));
		
		var p1Goal = System.createEntity()
			.addComponent(new Position(this.displayWidth - this.wallThickness, this.wallThickness))
			.addComponent(new Rectangle(this.wallThickness, this.displayHeight - this.wallThickness))
			.addComponent(new Color("cyan"))
			.addComponent(new GoalZone())
			.addComponent(leftPlayerScore);
	
		var p2Goal = System.createEntity()
			.addComponent(new Position(0, this.wallThickness))
			.addComponent(new Rectangle(this.wallThickness, this.displayHeight - this.wallThickness))
			.addComponent(new Color("yellow"))
			.addComponent(new GoalZone())
			.addComponent(rightPlayerScore);
		
		var topWall = System.createEntity()
			.addComponent(new Position(0, 0))
			.addComponent(new Rectangle(this.displayWidth, this.wallThickness))
			.addComponent(new Color("white"))
			.addComponent(new Collidable());
		
		var bottomWall = System.createEntity()
			.addComponent(new Position(0, this.displayHeight - this.wallThickness))
			.addComponent(new Rectangle(this.displayWidth, this.wallThickness))
			.addComponent(new Color("white"))
			.addComponent(new Collidable());

		var net = System.createEntity()
			.addComponent(new DashedLine((this.displayWidth / 2) - (this.wallThickness / 2), this.displayHeight - this.wallThickness, this.wallThickness, [10]))
			.addComponent(new Position((this.displayWidth / 2) - (this.wallThickness / 2), this.wallThickness))
			.addComponent(new Color("white"));

		GameHelper.serve(ball, p2Goal, 5, 1);
		GameHelper.serve(ball2, p1Goal, 5, -1);
		GameHelper.serve(ball3, p2Goal, 5, 1);

		this.canvasContainer = canvasContainer;
		new DisplaySystem(this.displayUpdateInterval, this.canvasContainer, this.displayWidth, this.displayHeight);
		new PhysicsSystem(this.physicsUpdateInterval);
		new GoalSystem(this.physicsUpdateInterval);
		new KeyboardPaddleSystem(this.paddleUpdateInterval);
		//new AIPaddleSystem(this.paddleUpdateInterval);
	},
	
	start: function () {
		System.startSystems();
	},
	
	stop : function () {
		System.stopSystems();
	}
});

var GameHelper = {
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

		ballPosition.x = rectanglePosition.x + (ballRectangle.width * xStartDirection);
		ballPosition.y = this.randFromRange(rectanglePosition.y, rectanglePosition.y + rectangle.height + (ballRectangle.height * xStartDirection));
		// x determined randomly
		ballVelocity.x = this.randFromRange(2, desiredSpeed);
		// determine y velocity for desired speed
		var speedSquared = Math.pow(desiredSpeed, 2);
		var xSquared = Math.pow(ballVelocity.x, 2);
		ballVelocity.y = Math.sqrt(speedSquared - xSquared);
		ballVelocity.x *= xStartDirection;
	},

	randFromRange : function (min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	bounce : function(bouncingEntity, surface)
	{
		var velocity = bouncingEntity.components.Velocity;
		var rectangle = surface.components.Rectangle;

		// angle of incidence should equal angle of reflection
		// if it hits the left or right wall, change the x sign
		// if it hits the top or bottom wall, change the y sign
		//
		//          -,+    +,+
		//      0-----------------N
		//      |                 |
		//  +,- |    -,-   +,-    | -,- 
		//      |       \ /       |
		//      |        +        |
		//      |       / \       |
		//  +,+ |    -,+   +,+    | +,-
		//      |                 |
		//      N-----------------N
		//           -,-   +,- 
		//

		var vertical = rectangle.width < rectangle.height;
		var horizontal = rectangle.width > rectangle.height;

		if (vertical)
		{
			velocity.x *= -1;
		}
		if (horizontal)
		{
			velocity.y *= -1;
		}
	}
};
