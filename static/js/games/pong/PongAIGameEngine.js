


var BallInteceptSystem = System.extend({
    systemType: "KeyboardPaddle",
    entities: null,
    game: null,
    intervalPeriod: 2,

    init: function (entities, game) {
        this.entities = entities;
        this.game = game;
        this.componentClasses = ["KeyControlledPaddle"];
        this._super(this.intervalPeriod);
    },

    action: function (entity) {
        var ball = this.getBallEntity();
        var paddle = entity.components.KeyControlledPaddle;
        var moveIncrement = paddle.increment / 2; // AI handicap 1/2 paddle speed
        var position = entity.components.Position;
        var rectangle = entity.components.Rectangle;
        var newY = position.y;

        var moveUp = this.needToMoveUp(ball, entity);
        var moveDown = this.needToMoveDown(ball, entity);

        if (moveUp) {
            newY -= moveIncrement;
        }
        if (moveDown) {
            newY += moveIncrement;
        }

        if (newY < paddle.minY) {
            newY = paddle.minY;
        }

        if (newY > (paddle.maxY - rectangle.height)) {
            newY = (paddle.maxY - rectangle.height);
        }

        position.y = newY;
    },

    getBallEntity: function () {
        var entities = this.entities;

        for (var i in entities)
        {
            if (entities[i].hasComponent("Ball"))
            {
                return entities[i];
            }
        }
    },

    needToMoveUp: function (ball, paddle) {
        var ballPosition = ball.components.Position;
        var ballRectangle = ball.components.Rectangle;
        var paddlePosition = paddle.components.Position;
        var paddleRectangle = paddle.components.Rectangle;
        var paddleYmidpoint = paddlePosition.y + (paddleRectangle.height / 2);

        // give AI a handicap so it doesn't start moving unitl ball is on it's side
        var ballIsOnTheirSide = ballPosition.x < (this.game.width / 2);

        // if the ball y position is less than the postion of our midpoint, move up
        if (!ballIsOnTheirSide && ballPosition.y < paddleYmidpoint)
        {
            return true;
        }

        return false;
    },

    needToMoveDown : function(ball, paddle){
        var ballPosition = ball.components.Position;
        var ballRectangle = ball.components.Rectangle;
        var paddlePosition = paddle.components.Position;
        var paddleRectangle = paddle.components.Rectangle;
        var paddleYmidpoint = paddlePosition.y + (paddleRectangle.height / 2);

        // give AI a handicap so it doesn't start moving unitl ball is on it's side
        var ballIsOnTheirSide = ballPosition.x < (this.game.width / 2);

        // if the ball y position is greater than the postion of our midpoint, move down
        if (!ballIsOnTheirSide && ballPosition.y > paddleYmidpoint)
        {
            return true;
        }

        return false;
    },

    upHandler: function (e) {
        if (e.which > 0 && e.which < 127) {
            e.stopPropagation();
            e.preventDefault();
            KeyboardPaddleSystem.prototype.pressedkeys[e.which] = false;
        }
    }
});

var PongAIEngine = Class.extend({
    game: null,
    commChannel: null,
    entities: [],
    systems: [],
    showAIDisplay : false,

    init: function (game, showAIDisplay) {
        this.game = game;
        this.game.createEntities(this.entities);
        this.createBaseSystems(this.systems, this.entities, this.game);
        this.game.createGameSystems(this.systems, this.entities, this.game);

        if (showAIDisplay) {
            this.startDisplay();
        }
        else
        {
            // by default, don't show the display
            this.systems = this.systems.filter(function (item) { return item.systemType !== 'Display' });           
        }

        // don't use keyboard events
        this.systems = this.systems.filter(function (item) { return item.systemType !== 'KeyboardPaddle' });

        var ballIntercept = new BallInteceptSystem(this.entities, game);
        this.systems.push(ballIntercept);
    },

    setCommChannel: function (commChannel) {
        this.game.setCommChannel(commChannel);
    },

    startDisplay: function () {
        for (var i in this.systems) {
            if (this.systems[i].systemType === "Display") {
                this.systems[i].start(this.entities);
            }
        }
    },

    createBaseSystems: function () {
    },

    start : function()
    {
        this.game.start(false);
        var systems = this.systems;
        for (var i in systems)
        {
            systems[i].start(this.entities);
        }
    },

    stop: function () {
        this.game.stop();
        var systems = this.systems;
        for (var i in systems) {
            systems[i].stop();
        }
    }
});
