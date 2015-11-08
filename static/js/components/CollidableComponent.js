

var Collidable = Component.extend({
	name: 'Collidable',
	passThruVelocity : null,
	init: function (passThruVelocity) {
		this.passThruVelocity = passThruVelocity;
	}
});
