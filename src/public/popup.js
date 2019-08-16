var Popup = L.Popup.extend({
    options: {
        elevation: 0,
        closeWhenMovedOffscreen: false
    },

    _onScreen: false,

    getElevation: function() {
        return this.options.elevation;
    },

    setElevation: function(elevation) {
        this.options.elevation = elevation;
        return this;
    },

    getCloseWhenMovedOffscreen: function() {
        return this.options.closeWhenMovedOffscreen;
    },

    setCloseWhenMovedOffscreen: function(closeWhenMovedOffscreen) {
        this.options.closeWhenMovedOffscreen = closeWhenMovedOffscreen;
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

    update: function() {
        if (!this._map) { return; }

        this._container.style.visibility = "hidden";

        this._updateContent();
        this._updateLayout();
        this._updatePosition();

        this._container.style.visibility = "";

        this._adjustPan();

        if(this.options.closeWhenMovedOffscreen) {

            if(this._onScreen && this._checkOutOfBounds()) {
                this._onScreen = false;
                this._close();
            }
            else {
                this._onScreen = !this._checkOutOfBounds();
            }
        }
    },

    _updatePosition: function() {
		if (!this._map) { return; }

        // todo: should probably just have a single api point here to get screen pos
        var latLngs = this._map.latLngsForLayer(this);            
        var pos = this._map.latLngToLayerPoint(latLngs[0]);
        var offset = L.point(this.options.offset);

        var anchor = this._getAnchor();
		anchor.x = Math.round(anchor.x);
		anchor.y = Math.round(anchor.y);

        if (this._zoomAnimated) {
            L.DomUtil.setPosition(this._container, pos.add(anchor));
        } else {
            offset = offset.add(pos).add(anchor);
        }

		var bottom = this._containerBottom = -offset.y;
        var left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

		var bottom_style = Math.round(bottom) + "px";
		var left_style = Math.round(left) + "px";

		if (L.DomUtil.getStyle(this._container, "left") !== left_style) { // Do not update if style is already applied to prevent vertical wiggling
			this._container.style.left = left_style;
		}

		if (L.DomUtil.getStyle(this._container, "bottom") !== bottom_style) {
			// bottom position the popup in case the height of the popup changes (images loading etc)
			this._container.style.bottom = bottom_style;
		}
    },

    _checkOutOfBounds: function() {
        var rect = this._container.getBoundingClientRect();
        var rectHeight = rect.bottom - rect.top;
        var rectWidth = rect.right - rect.left;
        var mapRect = this._map._container.getBoundingClientRect();

        var offBottom = rect.bottom > mapRect.bottom + rectHeight/2.0;
        var offTop = rect.top < mapRect.top - rectHeight/2.0;
        var offRight = rect.right > mapRect.right + rectWidth/2.0;
        var offleft = rect.left < mapRect.left - rectWidth/2.0;
        return (offBottom || offTop || offRight || offleft);
    }
});

var popup = function(options, source) {
    return new Popup(options, source);
};

module.exports = {
    Popup: Popup,
    popup: popup
};
