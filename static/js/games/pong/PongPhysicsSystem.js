
var PongPhysicsSystem = System.extend({
    systemType: "Physics",
    collidableEntites: [],
    intervalPeriod: 20,
    game : null,
	
    init: function (game) {
        this.game = game;
		this.componentClasses = ["Position", "Rectangle", "Velocity"];
		this.trackedEntities = 0;
		this._super(this.intervalPeriod);
	},
	
	before: function (entities) {
	    var count = System.getEntityCount(entities);
		if (this.trackedEntities != count) {
		    this.collidableEntities = System.getEntitiesWithComponents(entities, ["Position", "Rectangle", "Collidable"]);
			this.trackedEntities = count;
		}
	},
	
	action : function (entity) {
		var newX = entity.components.Position.x + entity.components.Velocity.x;
		var newY = entity.components.Position.y + entity.components.Velocity.y;
		
		var collided = false;
		// determine if the entity is collidable
		if (!!entity.components.Collidable) {
			// check if the newX,newY collides with any of the above
			
			for (var id in this.collidableEntities)
			{
				if (entity != this.collidableEntities[id] &&
					!this.game.passthru(entity, this.collidableEntities[id]) &&
					this.game.overlap(newX, newY, entity.components.Rectangle, this.collidableEntities[id]))
				{
					if (!!entity.components.Ball)
					{
						this.game.bounce(newX, newY, entity, this.collidableEntities[id]);
					}
					collided = true;
				}
			}
		}
		
		if (!collided) {
			entity.components.Position.x = newX;
			entity.components.Position.y = newY;
		}
	}
});