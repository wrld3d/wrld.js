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

var _lerp = function (a,  b,  c) {
    return a + c * (b - a);
};

var _altitudeToZoom = function(altitude, comparisonFunc) {
    var zoom = _altitudes.findIndex(function(zoomLevelDistance) {
        return comparisonFunc(altitude, zoomLevelDistance);
    });
    var maxZoom = _altitudes.length - 1;
    return (zoom === -1) ? maxZoom : zoom;
};

var _nearestZoomAbove = function(distance) {
    var zoomAbove = _altitudeToZoom(distance, function(d, z) { return d > z; });
    return Math.max(0, zoomAbove - 1);
};

var _nearestZoomBelow = function(distance) {
    return _altitudeToZoom(distance, function(d, z) { return d >= z; });
};

var zoomToDistance = function(zoom) {
    var zoomlevel = zoom;
    if(zoomlevel < 0) {
        zoomlevel =  0;
    }
    else if (zoomlevel >= _altitudes.length) {
        zoomlevel = _altitudes.length - 1;
    }

    var nearestZoomBelow = Math.floor(zoomlevel);
    var nearestZoomAbove = Math.ceil(zoomlevel);
    var valueBetweenNearestZoomLevels = zoomlevel - nearestZoomBelow;
    return _lerp(_altitudes[nearestZoomBelow], _altitudes[nearestZoomAbove], valueBetweenNearestZoomLevels);
};

var distanceToZoom = function(distance) {
    var smallestAltitude = _altitudes.length - 1;
    if(distance < _altitudes[smallestAltitude])
    {
        distance = _altitudes[smallestAltitude];
    }
    if(distance > _altitudes[0])
    {
        distance = _altitudes[0];
    }
    var nearestZoomAbove = _nearestZoomAbove(distance);
    var nearestZoomBelow = _nearestZoomBelow(distance);
    var distanceBetweenNearestZoomLevels = _altitudes[nearestZoomAbove] - _altitudes[nearestZoomBelow];
    var distanceFromZoomLevelBelow = distance - _altitudes[nearestZoomBelow];

    return (nearestZoomAbove === nearestZoomBelow) ? nearestZoomBelow : _lerp(nearestZoomBelow, nearestZoomAbove, distanceFromZoomLevelBelow / distanceBetweenNearestZoomLevels);
};

var space = {
    Vector3: Vector3,
    Vector4: Vector4,
    zoomToDistance: zoomToDistance,
    distanceToZoom: distanceToZoom
};

module.exports = space;