
var GoalSystem = System.extend({
    interval: 20,
    game: null,
    init: function (game) {
        this.game = game;
		this.componentClasses = ['Ball', 'Position', 'Rectangle', 'Velocity'];
		this.goalEntities = [];
		this.trackedEntities = 0;
		this._super(this.interval);
	},
	
	before: function (entities) {
	    var count = System.getEntityCount(entities);
		if (this.trackedEntities != count) {
		    this.goalEntities = System.getEntitiesWithComponents(entities, ["GoalZone"]);
			this.trackedEntities = count;
		}
	},
	
	action: function (entity) {
		for (var id in this.goalEntities) {
			var goal = this.goalEntities[id];
			if (this.game.overlap(entity.components.Position.x + entity.components.Velocity.x, entity.components.Position.y + entity.components.Velocity.y, entity.components.Rectangle, goal)) {
				entity.components.Velocity.x *= -1;
				goal.components.Score.value += 1;
			}
		}
	}
});
