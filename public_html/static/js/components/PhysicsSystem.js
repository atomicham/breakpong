
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
		
		// determine if the entity is collidable
		if (!!entity.components.Collidable && entity.components.Collidable.collidable) {
			// check if the newX,newY collides with any of the above

		} else {
			entity.components.Position.x = newX;
			entity.components.Position.y = newY;
		}
	}
});