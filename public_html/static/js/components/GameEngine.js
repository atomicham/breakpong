
var GameEngine = Class.extend({
	displayWidth: 500,
	displayHeight: 300,
	physicsUpdateInterval : 20,
	displayUpdateInterval: 40,
	leftScoreX : 100, 
	leftScoreY : 20,
	rightScoreX : 0, 
	rightScoreY: 20,
	leftPlayerPaddleY: 250,
	rightPlayerPaddleY: 250,
	ball: null,
	p1Score: null,
	p2Score: null,
	p1Paddle: null,
	p2Paddle: null,
	canvasContainer: null,
	displaySystem: null,
	physicsSystem: null,
	
	init: function (canvasContainer) {
		// init vars
		this.rightScoreX = this.displayWidth - 100;
		
		// create entities
		this.ball = System.createEntity();
		this.ball.addComponent(new Position(250, 250));
		this.ball.addComponent(new Dimensions(8, 8));
		this.ball.addComponent(new Velocity(5, 0));
		this.ball.addComponent(new Collidable());
		this.ball.addComponent(new Rectangle());
		this.ball.addComponent(new Color());
		
		this.p1Score = System.createEntity();
		this.p1Score.addComponent(new Position(this.leftScoreX, this.leftScoreY));
		this.p1Score.addComponent(new Text());
		
		this.p2Score = System.createEntity();
		this.p2Score.addComponent(new Position(this.rightScoreX, this.rightScoreY));
		this.p2Score.addComponent(new Text());
		
		this.p1Paddle = System.createEntity();
		this.p1Paddle.addComponent(new Position(50, this.leftPlayerPaddleY));
		this.p1Paddle.addComponent(new Dimensions(8, 50));
		this.p1Paddle.addComponent(new Collidable());
		this.p1Paddle.addComponent(new Rectangle());
		this.p1Paddle.addComponent(new Color());
		
		this.p2Paddle = System.createEntity();
		this.p2Paddle.addComponent(new Position(450, this.rightPlayerPaddleY));
		this.p2Paddle.addComponent(new Dimensions(8, 50));
		this.p2Paddle.addComponent(new Collidable());
		this.p2Paddle.addComponent(new Rectangle());
		this.p2Paddle.addComponent(new Color());
		
		this.canvasContainer = canvasContainer;
		this.displaySystem = new DisplaySystem(this.displayUpdateInterval, this.canvasContainer, this.displayWidth, this.displayWidth);
		this.physicsSystem = new PhysicsSystem(this.physicsUpdateInterval);
	},
	
	start: function () {
		System.startSystems();
	},
	
	stop : function () {
		System.stopSystems();
	}
});