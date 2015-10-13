
var GameEngine = Class.extend({
    displayWidth: 500,
    displayHeight: 300,
    physicsUpdateInterval : 20,
    displayUpdateInterval: 40,
    leftScoreX : 100, 
    leftScoreY : 20,
    rightScoreX : this.displayWidth - 100, 
    rightScoreY: 20,
    leftPlayerPaddleX: 40,
    rightPlayerPaddleX: 460,
    ball: null,
    p1Score: null,
    p2Score: null,
    p1Paddle: null,
    p2Paddle: null,
    canvasContainer: null,
    displaySystem: null,
    physicsSystem: null,
    entities: [],

    init: function (canvasContainer)
    {
        // create entities
        this.ball = new Entity();
        this.ball.addComponent(new Ball());
        this.entities.push(this.ball);

        this.p1Score = new Entity();
        this.p1Score.addComponent(new Score(this.leftScoreX, this.leftScoreY));
        this.entities.push(this.p1Score);

        this.p1Paddle = new Entity();
        this.p1Paddle.addComponent(new Paddle(this.leftPlayerPaddleX));
        this.entities.push(this.p1Paddle);

        this.p2Score = new Entity();
        this.p2Score.addComponent(new Score(this.rightScoreX, this.rightScoreY));
        this.entities.push(this.p2Score);

        this.p2Paddle = new Entity();
        this.p2Paddle.addComponent(new Paddle(this.rightPlayerPaddleX));
        this.entities.push(this.p2Paddle);

        this.canvasContainer = canvasContainer;
        this.displaySystem = new DisplaySystem(this.entities, this.displayUpdateInterval, this.canvasContainer, this.displayWidth, this.displayHeight);
        this.physicsSystem = new PhysicsSystem(this.entities, this.physicsUpdateInterval);
    },

    start: function()
    {
        this.displaySystem.start();
        this.physicsSystem.start();
    },

    stop : function()
    {
        this.displaySystem.stop();
        this.physicsSystem.stop();
    }
});