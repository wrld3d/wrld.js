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
            offset = L.point(this.options.offset),
            anchor = this._getAnchor();

        if (this._zoomAnimated) {
            L.DomUtil.setPosition(this._container, pos.add(anchor));
        } else {
            offset = offset.add(pos).add(anchor);
        }

        var bottom = this._containerBottom = -offset.y,
            left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

        // bottom position the popup in case the height of the popup changes (images loading etc)
        this._container.style.bottom = bottom + 'px';
        this._container.style.left = left + 'px';
    }
});

var popup = function(options, source) {
    return new Popup(options, source);
};

module.exports = {
    Popup: Popup,
    popup: popup
};