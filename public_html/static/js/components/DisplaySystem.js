

var DisplaySystem = System.extend({
    displayWidth:0, 
    displayHeight: 0,
    canvasContainer: null,
    canvas: null,

    init: function (intervalPeriod, canvasContainer, displayWidth, displayHeight) {
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
        this.canvasContainer = canvasContainer;
        this.canvas = new TwoDCanvas(this.canvasContainer, this.displayWidth, this.displayHeight);
        this.componentClasses = ["Position", "Dimensions", "Rectangle"];
        this._super(intervalPeriod);
    },

    before: function (){
        this.canvas.clear();
    },

    action: function (entity) {
		var poly = {
			i: [
				{
					p: ["bp"]
				},
				{
					p: ["fc", entity.components.Color.color]
				},
				{
					p: ["lc", entity.components.Color.color]
				},
				{
					p: ["lt", entity.components.Position.x, entity.components.Position.y]
				},
				{
					p: ["lt", entity.components.Position.x + entity.components.Dimensions.width, entity.components.Position.y]
				},
				{
					p: ["lt", entity.components.Position.x + entity.components.Dimensions.width, entity.components.Position.y + entity.components.Dimensions.height]
				},
				{
					p: ["lt", entity.components.Position.x, entity.components.Position.y + entity.components.Dimensions.height]
				},
				{
					p: ["lt", entity.components.Position.x, entity.components.Position.y]
				},
				{
					p: ["fi"]
				},
				{
					p: ["cp"]
				}
			]
		};
		this.canvas.drawPolygon(poly);
    },

    after: function () {

    }
});