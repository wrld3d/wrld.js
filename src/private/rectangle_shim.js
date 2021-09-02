import { Rectangle } from "leaflet";
import { ElevationModeType, isValidElevationMode } from "./elevation_mode.js";

export const RectangleShim = Rectangle.extend({
	options: {
        elevation: 0,
        elevationMode: ElevationModeType.HEIGHT_ABOVE_GROUND
	},
	
	_projectLatlngs: function (latlngs, result, projectedBounds) {						
		if(!this._map._projectLatlngs(this, latlngs, result, projectedBounds))
		{			
			Rectangle.prototype._projectLatlngs.call(this, latlngs, result, projectedBounds);
		}
	},

	// @method setLatLngs(latlngs: LatLng[]): this
	// Replaces all the points in the polyline with the given array of geographical points.
	setLatLngs: function (latlngs) {
		var redraw = Rectangle.prototype.setLatLngs.call(this, latlngs);
		
		if(this._map) {
			this._map._createPointMapping(this);
		}

		return redraw;
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
        if (isValidElevationMode(mode)) {
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

export const rectangleShim = function (latlng, options) {
	return new RectangleShim(latlng, options);
};
