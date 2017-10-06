var elevationMode = require("../private/elevation_mode.js");

var Circle = L.Circle.extend({
    options: {
        elevation: 0,
        elevationMode: elevationMode.ElevationModeType.HEIGHT_ABOVE_GROUND
    },

    _project: function () {
        // Circles are defined as a single LatLng, and consequently won't scale correctly when indoor maps are expanded
        // (other prims like polygons 'just work', as all LatLngs are transformed on the C++ side).        
        // To fix this, we'd need to adjust the calculations below to take into account a scale transform, or similar
        // (this is not currently exposed in the api).
        var latLng = this._map.latLngsForLayer(this)[0];
        var lat = latLng.lat;
        var lng = latLng.lng;
        var alt = latLng.alt || 0.0;

        var map = this._map,
            degToRad = Math.PI / 180,
            earthRadius = 6378100;
        
        var latR = (this._mRadius / earthRadius) / degToRad;
        var a = Math.sin(lat * degToRad);
        var b = Math.cos(lat * degToRad);
        var lngR = Math.acos((Math.cos(latR * degToRad) - a * a) / (b * b)) / degToRad;

        if (isNaN(lngR) || lngR === 0) {
            lngR = latR / Math.cos(lat * degToRad);
        }

        var heading = map.getCameraHeadingDegrees() * degToRad;
        var forwardLatLng = [lat + latR * Math.cos(heading), lng + lngR * Math.sin(heading), alt];
        var rightLatLng = [lat - latR * Math.sin(heading), lng + lngR * Math.cos(heading), alt];
        this._point = map.latLngToLayerPoint([lat, lng, alt]);
        this._radius = isNaN(lngR) ? 0 : Math.max(Math.round(this._point.distanceTo(map.latLngToLayerPoint(rightLatLng))), 1);
        this._radiusY = Math.max(Math.round(this._point.distanceTo(map.latLngToLayerPoint(forwardLatLng))), 1);

        this._updateBounds();
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

var circle = function (latlng, options, legacyOptions) {
	return new Circle(latlng, options, legacyOptions);
};

module.exports = {
    Circle: Circle,
    circle: circle
};