var L = require("leaflet");
var elevationMode = require("./elevation_mode.js");

var PolygonShim = L.Polygon.extend({
	options: {
        elevation: 0,
        elevationMode: elevationMode.ElevationModeType.HEIGHT_ABOVE_GROUND
	},
		
	_projectLatlngs: function (latlngs, result, projectedBounds) {
		if(!this._map._projectLatlngs(this, latlngs, result, projectedBounds))
		{			
			L.Polygon.prototype._projectLatlngs.call(this, latlngs, result, projectedBounds);
		}
	},

	// @method setLatLngs(latlngs: LatLng[]): this
	// Replaces all the points in the polygon with the given array of geographical points.
	setLatLngs: function (latlngs) {

        this._setLatLngs(latlngs);
        
        if(this._map) {
            this._map._createPointMapping(this);
        }

        return this.redraw();
	},

    _convertLatLngs: function (latlngs) {
        var result = L.Polygon.prototype._convertLatLngs.call(this, latlngs);

        if(this._map) {
            this._map._createPointMapping(this);
        }

        return result;
    },

	getElevation: function() {
        return this.options.elevation;
    },

    setElevation: function(elevation) {
        this.options.elevation = elevation;

        if (this._map !== null) {
            this._map._createPointMapping(this);
        }
        
        return this;
    },

    setElevationMode: function(mode) {
        if (elevationMode.isValidElevationMode(mode)) {
            this.options.elevationMode = mode;

            if (this._map !== null) {
                this._map._createPointMapping(this);
            }
        }

        return this;
    },

    getElevationMode: function() {
        return this.options.elevationMode;
    }
});

var polygonShim = function (latlng, options) {
	return new PolygonShim(latlng, options);
};

module.exports = {
    PolygonShim: PolygonShim,
    polygonShim: polygonShim
};