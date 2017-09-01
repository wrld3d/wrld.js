var Vector3 = function(x, y, z) {
    if (typeof(x) === "number") {
        this.x = x;
        this.y = y;
        this.z = z || 0.0;
    }
    else {
        this.x = x.x || x[0];
        this.y = x.y || x[1];
        this.z = x.z || x[2] || 0.0;
    }

    this.toPoint = function() {
        return L.point(this.x, this.y);
    };
};

var Vector4 = function(x, y, z, w) {
    if (typeof(x) === "number") {
        this.x = x;
        this.y = y;
        this.z = z || 0.0;
        this.w = w || 1.0;
    }
    else {
        this.x = x.x || x[0];
        this.y = x.y || x[1];
        this.z = x.z || x[2] || 0.0;
        this.w = x.w || x[3] || 1.0;
    }
};

// TODO: fix DRY fail -- this should move to platform
// Judging by Leaflet, approx = 2.74287e7 * Math.exp(-0.622331 * zoom)
var _altitudes = [
    27428700,
    14720762,
    8000000,
    4512909,
    2087317,
    1248854,
    660556,
    351205,
    185652,
    83092,
    41899,
    21377,
    11294,
    5818,
    3106,
    1890,
    1300,
    821,
    500,
    300,
    108,
    58,
    31,
    17,
    9,
    5
];

var _altitudeToZoom = function(altitude, comparisonFunc) {
    var zoom = _altitudes.findIndex(function(zoomLevelDistance) {
        return comparisonFunc(altitude, zoomLevelDistance);
    });
    var maxZoom = _altitudes.length - 1;
    return (zoom === -1) ? maxZoom : zoom;
};


var zoomToDistance = function(zoom) {
    if(zoom < 0) {
        return _altitudes[0];
    }
    else if (zoom >= _altitudes.length) {
        return _altitudes[_altitudes.length - 1];
    }
    return _altitudes[zoom];
};

var distanceToZoom = function(distance) {
    return nearestZoomAbove(distance);
};

var nearestZoomAbove = function(distance) {
    var zoomAbove = _altitudeToZoom(distance, function(d, z) { return d > z; });
    return Math.max(0, zoomAbove - 1);
};

var nearestZoomBelow = function(distance) {
    return _altitudeToZoom(distance, function(d, z) { return d >= z; });
};


var space = {
    Vector3: Vector3,
    Vector4: Vector4,
    zoomToDistance: zoomToDistance,
    distanceToZoom: distanceToZoom,
    nearestZoomAbove: nearestZoomAbove,
    nearestZoomBelow: nearestZoomBelow
};

module.exports = space;