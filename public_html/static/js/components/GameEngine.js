
var GameEngine = Class.extend({
    displayWidth: 500,
    displayHeight: 300,
    physicsUpdateInterval : 20,
    displayUpdateInterval: 40,
    leftScoreX : 100, 
    leftScoreY : 20,
    rightScoreX : displayWidth - 100, 
    rightScoreY: 20,
    leftPlayerPaddleY: 40,
    rightPlayerPaddleY: displayWidth - 40,
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
        this.ball = new Ball();
        this.entities.push(ball);
        this.p1Score = new Score(this.leftScoreX, this.leftScoreY);
        this.p2Score = new Score(this.rightScoreX, this.rightScoreY);
        this.p1Paddle = new Paddle(this.leftPlayerPaddleY);
        this.entities.push(p1Paddle);
        this.p2Paddle = new Paddle(this.rightPlayerPaddleY);
        this.entities.push(p2Paddle);

        "Ball", "Paddle", "Score", "SideWall", "BackWall", "Net"

        this.canvasContainer = canvasContainer;
        this.displaySystem = new DisplaySystem(this.entities, this.displayUpdateInterval, this.canvasContainer, this.displayWidth, this.displayWidth);
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