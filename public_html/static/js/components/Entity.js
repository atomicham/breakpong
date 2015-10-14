

var Entity = Class.extend({
	id: 0,
	components: {},
	
	init : function () {
		this.id = this.guid();
        this.components = {};
        // this._super();
	},
	
	addComponent: function (component) {
		this.components[component.name] = component;
		return this;
	},
	
	deleteComponent: function (component) {
		var name = component;
		if (typeof component === 'function') {
			name = component.name;
		}
		
		delete this.components[name];
		return this;
	},
	
	hasComponent: function (name) {
		return !!this.components[name];
	},
	
	// generate (hopefully) random 16-digit guid
	guid : function () {
		var result = "";
		var basis = "0123456789ABCDEF";
		
		for (var i = 0; i < 16; i++) {
			result += basis.charAt(Math.floor(Math.random() * basis.length));
		}
		return result;
	}
});