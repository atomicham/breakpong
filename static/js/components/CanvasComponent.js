
var Canvas = Component.extend({
    name: 'Canvas',
    canvasElement : "",
    width : 0 ,
    height: 0,

    init: function (canvasElement, width, height) {
        this.canvasElement = canvasElement;
        this.width = width;
        this.height = height;
    }
});
