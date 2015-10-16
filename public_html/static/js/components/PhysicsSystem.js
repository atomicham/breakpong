
var PhysicsSystem = System.extend({
	
	collidableEntites: [],
	
	init: function (intervalPeriod) {
		this.componentClasses = ["Position", "Rectangle", "Velocity"];
		this.trackedEntities = 0;
		this._super(intervalPeriod);
	},
	
	before: function () {
		var count = System.getEntityCount();
		if (this.trackedEntities != count) {
			this.collidableEntities = System.getEntitiesWithComponents(["Position", "Rectangle", "Collidable"]);
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
			
		    for (var id in this.collidableEntities) {
		        if (entity != this.collidableEntities[id] &&
                    !GameHelper.passthru(entity, this.collidableEntities[id]) &&
                    GameHelper.overlap(newX, newY, entity.components.Rectangle, this.collidableEntities[id])) {
			            entity.components.Velocity.x *= -1;
			            entity.components.Velocity.y *= -1;
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