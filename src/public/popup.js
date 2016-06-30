var Popup = L.Popup.extend({
    options: {
        elevation: 0
    },

    getElevation: function() {
        return this.options.elevation;
    },

    setElevation: function(elevation) {
        this.options.elevation = elevation;
        return this;
    },

    _updatePosition: function() {
        if (!this._map) { return; }

        var pos = this._map.getScreenPositionOfLayer(this).round(),
            animated = this._animated,
            offset = L.point(this.options.offset);

        if (animated) {
            L.DomUtil.setPosition(this._container, pos);
        }

        this._containerBottom = -offset.y - (animated ? 0 : pos.y);
        this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x + (animated ? 0 : pos.x);

        // bottom position the popup in case the height of the popup changes (images loading etc)
        this._container.style.bottom = this._containerBottom + "px";
        this._container.style.left = this._containerLeft + "px";
    }
});

var popup = function(options, source) {
    return new Popup(options, source);
};

module.exports = {
    Popup: Popup,
    popup: popup
};