

var PongDisplaySystem = System.extend({
	displayWidth: 0, 
	displayHeight: 0,
	canvasContainer: null,
	canvas: null,
	systemType: "Display",
    intervalPeriod : 40,
	
    init: function (entities) {
        var canvas = this.getEntityWithComponent(entities, "Canvas");
		this.displayWidth = canvas.width;
		this.displayHeight = canvas.height;
		this.canvasContainer = canvas.canvasElement;
		this.canvas = new TwoDCanvas(this.canvasContainer, this.displayWidth, this.displayHeight);
		this.componentClasses = ["Position", "Color"];
		this._super(this.intervalPeriod);
	},
	
	before: function () {
		this.canvas.clear();
	},
	
	action: function (entity) {
	    var components = entity.components;
	    var position = components.Position;
	    var color = components.Color.color;
	    var rectangle = components.Rectangle;

	    if (!!components.Rectangle) {
			var poly = {
				i: [
					{
						p: ["bp"]
					},
					{
					    p: ["fc", color]
					},
					{
					    p: ["lc", color]
					},
					{
					    p: ["lt", position.x, position.y]
					},
					{
					    p: ["lt", position.x + rectangle.width, position.y]
					},
					{
					    p: ["lt", position.x + rectangle.width, position.y + rectangle.height]
					},
					{
					    p: ["lt", position.x, position.y + rectangle.height]
					},
					{
					    p: ["lt", position.x, position.y]
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
	    }
	    else if (!!components.DashedLine) {
	        var dL = components.DashedLine;
	        this.canvas.drawLine(position.x, position.y, dL.endX, dL.endY, color, dL.lineWidth, dL.dashArray);
	    }
	    else if (!!entity.components.Text) {
			var text = '';
			if (entity.hasComponent('Score')) {
				text = entity.components.Score.value;
			}
			else if (entity.components.Text.value)
			{
			    text = entity.components.Text.value;
			}
            // TODO: make font, size Text properties
			this.canvas.drawText(text, entity.components.Text.font, entity.components.Color.color, entity.components.Position.x, entity.components.Position.y);
		}
	},
});