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

	_updateContent: function () {
		if (!this._content) { return; }

		var node = this._contentNode;
		var content = (typeof this._content === "function") ? this._content(this._source || this) : this._content;

        var contentNeedsUpdate = true;
        if (content.outerHTML && content.outerHTML === node.innerHTML) {
            // This test will fail to detect changes which don't affect HTML, but otherwise the DOM for the popup is
            // rebuilt every update cycle.  This makes embedding external HTML impossible.
            contentNeedsUpdate = false;
        }

		if (typeof content === "string") {
			node.innerHTML = content;
		} else if (!node.hasChildNodes() || contentNeedsUpdate) {
			while (node.hasChildNodes()) {
				node.removeChild(node.firstChild);
			}
			node.appendChild(content);
		}
		this.fire("contentupdate");
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
        this._container.style.bottom = bottom + "px";
        this._container.style.left = left + "px";
    }
});

var popup = function(options, source) {
    return new Popup(options, source);
};

module.exports = {
    Popup: Popup,
    popup: popup
};
