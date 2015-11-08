
var Text = Component.extend({
    name: 'Text',
    font: null,
    value : null,
    init: function (font, value) {
        this.font = font;
        this.value = value;
    }
});
