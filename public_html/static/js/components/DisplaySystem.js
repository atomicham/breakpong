

var DisplaySystem = System.extend({
	displayWidth: 0, 
	displayHeight: 0,
	canvasContainer: null,
	canvas: null,
	
	init: function (intervalPeriod, canvasContainer, displayWidth, displayHeight) {
		this.displayWidth = displayWidth;
		this.displayHeight = displayHeight;
		this.canvasContainer = canvasContainer;
		this.canvas = new TwoDCanvas(this.canvasContainer, this.displayWidth, this.displayHeight);
		this.componentClasses = ["Position", "Color"];
		this._super(intervalPeriod);
	},
	
	before: function () {
		this.canvas.clear();
	},
	
	action: function (entity) {
		if (!!entity.components.Rectangle) {
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
						p: ["lt", entity.components.Position.x + entity.components.Rectangle.width, entity.components.Position.y]
					},
					{
						p: ["lt", entity.components.Position.x + entity.components.Rectangle.width, entity.components.Position.y + entity.components.Rectangle.height]
					},
					{
						p: ["lt", entity.components.Position.x, entity.components.Position.y + entity.components.Rectangle.height]
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
		} else if (!!entity.components.Text) {
			var text = '';
			if (entity.hasComponent('Score')) {
				text = entity.components.Score.value;
			}
			this.canvas.drawText(text, "Share Tech Mono", entity.components.Color.color, entity.components.Position.x, entity.components.Position.y);
		}
	},
});