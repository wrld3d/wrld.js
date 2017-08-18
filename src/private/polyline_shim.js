var L = require("leaflet");

var PolylineShim = L.Polyline.extend({	
	_projectLatlngs: function (latlngs, result, projectedBounds) {		
		if(!this._map._projectLatlngs(this, latlngs, result, projectedBounds))
		{		
			L.Polyline.prototype._projectLatlngs.call(this, latlngs, result, projectedBounds);
		}
	},

	// @method setLatLngs(latlngs: LatLng[]): this
	// Replaces all the points in the polyline with the given array of geographical points.
	setLatLngs: function (latlngs) {				
		var redraw = L.Polyline.prototype.setLatLngs.call(this, latlngs);

		if(this._map) {
			this._map._createPointMapping(this);
		}

		return redraw;
	}
});

var polylineShim = function (latlng, options) {
	return new PolylineShim(latlng, options);
};

module.exports = {
    PolylineShim: PolylineShim,
    polylineShim: polylineShim
};