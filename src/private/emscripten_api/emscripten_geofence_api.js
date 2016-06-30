var emscriptenMemory = require("./emscripten_memory");

function EmscriptenGeofenceApi(apiPointer, cwrap) {

    var _apiPointer = apiPointer;

    var _createGeofence = cwrap("createGeofence", null, ["number", "number", "number", "number"]);
    var _removeGeofence = cwrap("removeGeofence", null, ["number", "number"]);
    var _setGeofenceColor = cwrap("setGeofenceColor", null, ["number", "number", "number", "number", "number", "number"]);


    this.createGeofence = function(polygonId, points) {
        var data = [];

        for (var i=0; i<points.length; ++i) {
            var point = points[i];
            data.push(point.lat);
            data.push(point.lng);
            data.push(point.alt || 0);
        }

        emscriptenMemory.passDoubles(data, function(pointer, count) {
            _createGeofence(_apiPointer, polygonId, pointer, count);
        });
    };

    this.removeGeofence = function(polygonId) {
        _removeGeofence(_apiPointer, polygonId);
    };

    this.setGeofenceColor = function(polygonId, color) {
        _setGeofenceColor(_apiPointer, polygonId, color.x, color.y, color.z, color.w);
    };
}

module.exports = EmscriptenGeofenceApi;