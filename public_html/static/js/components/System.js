
var System = Class.extend({
    // in your base class constructor, identify the componentTypes, this system operates on
    componentClasses: [],
    intervalPeriod: 1000,
    entities: [],
    interval: null,

    init: function (entities, intervalPeriod) {
        this.entities = entities;
        this.intervalPeriod = intervalPeriod;
        // this._super();
    },

    processEntities: function (entities) {
        this.before();
        var length = entities.length;
        for (var i = 0; i < length; i++) {
            this.processComponents(entities[i]);
        }
        this.after();
    },

    processComponents: function (entity) {
        var components = entities.components;
        var length = components.length;

        for (var i = 0; i < length; i++) {
            var component = components[i];
            if (jQuery.inArray(component.componentType,this.componentClasses)) {
                this.action(components[i]);
            }
        }
    },

    start: function () {
        var self = this;
        self.interval = setInterval(function () {
            self.processEntities(self.entities);
        }, self.intervalPeriod);
    },

    stop: function () {
        clearInterval(this.interval);
        this.interval = null;
    },

    // override this to implement special setup before processing all entities
    before: function () { }, 

    // override this to do whatever your system does to the components it operates on
    action: function () { },
    
    // override this to implement special completion after processing all entities
    after: function () { }
});