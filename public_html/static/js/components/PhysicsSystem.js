
var PhysicsSystem = System.extend({
	
	collidableEntites: [],
	
	init: function (intervalPeriod) {
		this.componentClasses = ["Position", "Dimensions", "Velocity"];
		this._super(intervalPeriod);
	},
	
	before: function () {
		this.collidableEntities = System.getEntitiesWithComponents(["Position", "Dimensions", "Collidable"]);
	},
	
	action : function (entity) {
		var newX = entity.components.Position.x + entity.components.Velocity.x;
		var newY = entity.components.Position.y + entity.components.Velocity.y;
		
		var collided = false;
		// determine if the entity is collidable
		if (!!entity.components.Collidable) {
			// check if the newX,newY collides with any of the above
			
			for (var id in this.collidableEntities) {
				if (entity != this.collidableEntities[id] && overlap(newX, newY, entity.components.Dimensions, this.collidableEntities[id])) {
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

var overlap = function (newX, newY, dimensions, secondEntity) {
	
	

	return !(
			(newY + dimensions.height <= secondEntity.components.Position.y) ||
			(newY >= secondEntity.components.Position.y + secondEntity.components.Dimensions.height) ||
			(newX >= secondEntity.components.Position.x + secondEntity.components.Dimensions.width) ||
			(newX + dimensions.width <= secondEntity.components.Position.x)
)
};