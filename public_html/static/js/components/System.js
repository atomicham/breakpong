var System = null;
(function () {
	var entities = [];
	var systems = [];
	System = Class.extend({
		// in your base class constructor, identify the componentTypes, this system operates on
		componentClasses: [],
		intervalPeriod: 1000,
		entities: [],
		interval: null,
		active: false,
		
		init: function (intervalPeriod) {
			this.intervalPeriod = intervalPeriod;
			systems.push(this);
		},
		
		processEntities: function () {
			this.before();
			
			var length = entities.length;
			for (var i = 0; i < length; i++) {
				var entity = entities[i];
				
				var qualifyEntity = this.componentClasses.every(function (element) {
					return entity.hasComponent(element);
				});
				if (qualifyEntity) {
					this.action(entity);
				}
			}

			this.after();
		},
		
		start: function () {
			var self = this;
			self.interval = setInterval(function () {
				self.processEntities();
			}, self.intervalPeriod);
			this.active = true;
		},
		
		stop: function () {
			clearInterval(this.interval);
			this.interval = null;
			this.active = false;
		},
		
		// override this to implement special setup before processing all entities
		before: function () { }, 
		
		// override this to do whatever your system does to the components it operates on
		action: function (entity) { },
		
		// override this to implement special completion after processing all entities
		after: function () { }
	});
	
	System.startSystems = function $startSystems() {
		for (var system in systems) {
			if (systems.hasOwnProperty(system) && !systems[system].active) {
				systems[system].start();
			}
		}
	};
	
	System.stopSystems = function $stopSystems() {
		for (var system in systems) {
			if (systems.hasOwnProperty(system) && systems[system].active) {
				systems[system].stop();
			}
		}
	};
	
	System.createEntity = function $createEntity() {
		var entity = new Entity();
		entities.push(entity);
		return entity;
	};

	System.getEntitiesWithComponents = function $getEntitiesWithComponents(components) {
		var qualified = [];
		
		if (!Array.isArray(components)) {
			components = [components];
		}

		for (var id in entities) {
			var entity = entities[id];
			var qualifyEntity = components.every(function (element) {
				return entity.hasComponent(element);
			});
			if (qualifyEntity) {
				qualified.push(entity);
			}
		}

		return qualified;
	};
}());