var emscriptenMemory = require("./emscripten_memory");

function EmscriptenRoutesApi(apiPointer, cwrap) {

    var _apiPointer = apiPointer;

    var _createRoute = cwrap("createRoute", null, ["number", "number", "number", "number"]);
    var _removeRoute = cwrap("removeRoute", null, ["number", "number"]);

    this.createRoute = function(polygonId, points) {
        var data = [];

        for (var i=0; i<points.length; ++i) {
            var point = points[i];
            data.push(point.lat);
            data.push(point.lng);
            data.push(point.alt || 0);
        }

        emscriptenMemory.passDoubles(data, function(pointer, count) {
            _createRoute(_apiPointer, polygonId, pointer, count);
        });
    };

    this.removeRoute = function(polygonId) {
        _removeRoute(_apiPointer, polygonId);
    };
}

module.exports = EmscriptenRoutesApi;