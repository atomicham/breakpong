
var PongUpdateSystem = System.extend({
    values: null,
    displayWidth : 0,
    ballEntity: null, 
    leftPlayerPaddleEntity : null, 
    leftPlayerScoreEntity : null,
    rightPlayerPaddleEntity: null,
    rightPlayerScoreEntity: null,
    initialized: false,
    intervalPeriod: 40,
    game : null,

    init: function (game)
    {
        this.game = game;
        this.displayWidth = game.width;
        this._super(this.intervalPeriod);
    },

    before: function () {
        if (this.initialized)
        {
            this.game.commChannel.write(this.stringifyMyState());
        }
    },

    action: function (entity) {
        if (!this.initialized) {
            var midX = this.displayWidth / 2;

            if (!!entity.components.Ball) {
                this.ballEntity = entity;
            }

            if (!!entity.components.Paddle && entity.components.Position.x < midX) {
                this.leftPlayerPaddleEntity = entity;
            }

            if (!!entity.components.Score && entity.components.Position.x < midX) {
                this.leftPlayerScoreEntity = entity;
            }

            if (!!entity.components.Paddle && entity.components.Position.x > midX) {
                this.rightPlayerPaddleEntity = entity;
            }

            if (!!entity.components.Score && entity.components.Position.x > midX) {
                this.rightPlayerScoreEntity = entity;
            }
        }
    },

    after: function () {
        var message = this.game.commChannel.read();
        if (message) {
            this.parseTheirState(message);
        }
        this.initialized = true;
    },

    flipCoordinates: function (result) {
        var midX = this.displayWidth / 2;
        for (var i in result) {
            var components = result[i].components;
            if (!!components.Velocity)
            {
                components.Velocity.x *= -1;
            }
            if (!!components.Position) {
                components.Position.x += 2 * (midX - components.Position.x);
            }
        }
    },

    stringifyMyState: function () {
        var result = {};
        result["ball"] = this.ballEntity
        result["paddle"] = this.rightPlayerPaddleEntity;
        result["score"] = this.rightPlayerScoreEntity;
        return JSON.stringify(result);
    },

    parseTheirState: function (response) {
        var result = JSON.parse(response);
        this.flipCoordinates(result);

        var horizon = this.leftPlayerPaddleEntity.components.Position.x + this.leftPlayerPaddleEntity.components.Rectangle.width;
        var p1Ball = result["ball"];
        var p1Paddle = result["paddle"];
        var p1Score = result["score"];

        if (p1Ball.components.Position.x <= horizon || (this.ballEntity.components.Velocity.x == 0 && this.ballEntity.components.Velocity.y == 0)) {
            this.ballEntity.components.Position = p1Ball.components.Position;
            this.ballEntity.components.Velocity = p1Ball.components.Velocity;
        }

        this.leftPlayerPaddleEntity.components.Position = p1Paddle.components.Position;
        this.leftPlayerScoreEntity.components.Score.value = p1Score.components.Score.value;
    }

});
