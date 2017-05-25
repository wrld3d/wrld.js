var Circle = L.Circle.extend({

    _project: function () {

        var lng = this._latlng.lng,
            lat = this._latlng.lat,
            map = this._map,
            degToRad = Math.PI / 180,
            earthRadius = 6378100;

        var alt = map.getAltitudeAtLatLng(this._latlng);
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
    }
});

var circle = function (latlng, options, legacyOptions) {
	return new Circle(latlng, options, legacyOptions);
};

module.exports = {
    Circle: Circle,
    circle: circle
};