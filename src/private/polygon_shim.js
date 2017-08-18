var L = require("leaflet");

var PolygonShim = L.Polygon.extend({		
	_projectLatlngs: function (latlngs, result, projectedBounds) {
		if(!this._map._projectLatlngs(this, latlngs, result, projectedBounds))
		{			
			L.Polygon.prototype._projectLatlngs.call(this, latlngs, result, projectedBounds);
		}
	},

	// @method setLatLngs(latlngs: LatLng[]): this
	// Replaces all the points in the polyline with the given array of geographical points.
	setLatLngs: function (latlngs) {
		var redraw = L.Polygon.prototype.setLatLngs.call(this, latlngs);

		if(this._map) {
			this._map._createPointMapping(this);
		}

		return redraw;
	}
});

var polygonShim = function (latlng, options) {
	return new PolygonShim(latlng, options);
};

module.exports = {
    PolygonShim: PolygonShim,
    polygonShim: polygonShim
};