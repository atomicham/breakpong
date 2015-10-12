
var PhysicsSystem = System.extend({

    init: function (components, intervalPeriod) {
        this.componentClasses = ["Ball", "Paddle", "SideWall", "BackWall"];
        this._super(components, intervalPeriod);
    },

    action : function(component){
        // update positions for each applicable component
    }
});