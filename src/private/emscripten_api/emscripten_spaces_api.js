var emscriptenMemory = require("./emscripten_memory");
var space = require("../../public/space");

function EmscriptenSpacesApi(apiPointer, cwrap) {

    var _apiPointer = apiPointer;

    var _worldToScreenWrap = cwrap(
        "worldToScreen", null, ["number", "number", "number", "number", "number"]);

    var _screenToTerrainPointWrap = cwrap(
        "screenToTerrainPoint", "number", ["number", "number", "number", "number"]);


    var _worldToScreen = function(lat, long, alt) {
        var screenPos = [0, 0, 0];
        emscriptenMemory.passDoubles(screenPos, function(resultArray, arraySize) {
            _worldToScreenWrap(_apiPointer, lat, long, alt, resultArray);
            screenPos = emscriptenMemory.readDoubles(resultArray, 3);
        });
        return new space.Vector3(screenPos);
    };

    var _screenToTerrainPoint = function(screenX, screenY) {
        var latLngAltArray = [0, 0, 0];
        var foundWorldPoint = false;
        emscriptenMemory.passDoubles(latLngAltArray, function(resultArray, arraySize) {
            var success = _screenToTerrainPointWrap(_apiPointer, screenX, screenY, resultArray);
            foundWorldPoint = !!success;
            latLngAltArray = emscriptenMemory.readDoubles(resultArray, 3);
        });
        return (foundWorldPoint) ? L.latLng(latLngAltArray) : null;
    };


    this.worldToScreen = function(position) {
        var point = L.latLng(position);
        return _worldToScreen(point.lat, point.lng, point.alt || 0);
    };

    this.screenToTerrainPoint = function(screenPoint) {
        var point = L.point(screenPoint);
        return _screenToTerrainPoint(point.x, point.y);
    };
}

module.exports = EmscriptenSpacesApi;