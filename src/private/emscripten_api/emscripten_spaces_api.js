var emscriptenMemory = require("./emscripten_memory");
var space = require("../../public/space");

function EmscriptenSpacesApi(apiPointer, cwrap) {

    var _apiPointer = apiPointer;

    var _worldToScreenWrap = cwrap(
        "worldToScreen", "number", ["number", "number", "number", "number", "number"]);

    var _worldToScreen = function(lat, long, alt) {
        var screenPos = [0, 0, 0];
        emscriptenMemory.passDoubles(screenPos, function(resultArray, arraySize) {
            _worldToScreenWrap(_apiPointer, lat, long, alt, resultArray);
            screenPos = emscriptenMemory.readDoubles(resultArray, 3);
        });
        return new space.Vector3(screenPos);
    };


    this.worldToScreen = function(position) {
        var point = L.latLng(position);
        return _worldToScreen(point.lat, point.lng, point.alt || 0);
    };
}

module.exports = EmscriptenSpacesApi;