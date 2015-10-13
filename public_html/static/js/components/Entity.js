

var Entity = Class.extend({
    id: 0,
    components: [],

    init : function()
    {
        this.id = this.guid();
        // this._super();
    },

    // generate (hopefully) random 16-digit guid
    guid : function()
    {
        var result = "";
        var basis = "0123456789ABCDEF";

        for( var i = 0; i < 16; i++ )
        {
            result += basis.charAt(Math.floor(Math.random() * basis.length));
        }
        return result;
    },
    
    getComponents: function()
    {
        return this.components;
    },

    addComponent : function(component)
    {
        this.components.push(component);
    }
});