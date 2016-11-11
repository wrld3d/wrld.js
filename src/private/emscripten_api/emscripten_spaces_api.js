var emscriptenMemory = require("./emscripten_memory");
var space = require("../../public/space");

function EmscriptenSpacesApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;

    var _worldToScreenWrap = null;
    var _screenToTerrainPointWrap = null;
    var _screenToIndoorPointWrap = null;
    var _getAltitudeAtLatLngWrap = null;

    var _worldToScreen = function(lat, long, alt) {
        _worldToScreenWrap = _worldToScreenWrap || cwrap("worldToScreen", null, ["number", "number", "number", "number", "number"]);

        var screenPos = [0, 0, 0];
        emscriptenMemory.passDoubles(screenPos, function(resultArray, arraySize) {
            _worldToScreenWrap(_apiPointer, lat, long, alt, resultArray);
            screenPos = emscriptenMemory.readDoubles(resultArray, 3);
        });
        return new space.Vector3(screenPos);
    };

    var _screenToLatLng = function(screenX, screenY, raycastFunc) {
        var latLngAltArray = [0, 0, 0];
        var foundWorldPoint = false;
        emscriptenMemory.passDoubles(latLngAltArray, function(resultArray, arraySize) {
            var success = raycastFunc(_apiPointer, screenX, screenY, resultArray);
            foundWorldPoint = !!success;
            latLngAltArray = emscriptenMemory.readDoubles(resultArray, 3);
        });
        return (foundWorldPoint) ? L.latLng(latLngAltArray) : null;
    };

    var _screenToTerrainPoint = function(screenX, screenY) {
        _screenToTerrainPointWrap = _screenToTerrainPointWrap || cwrap("screenToTerrainPoint", "number", ["number", "number", "number", "number"]);
        return _screenToLatLng(screenX, screenY, _screenToTerrainPointWrap);
    };

    var _screenToIndoorPoint = function(screenX, screenY) {
        _screenToIndoorPointWrap = _screenToIndoorPointWrap || cwrap("screenToIndoorPoint", "number", ["number", "number", "number", "number"]);
        return _screenToLatLng(screenX, screenY, _screenToIndoorPointWrap);
    };

    var _getAltitudeAtLatLng = function(lat, long) {
        _getAltitudeAtLatLngWrap = _getAltitudeAtLatLngWrap || cwrap("getAltitudeAtLatLng", "number", ["number", "number", "number"]);
        return _getAltitudeAtLatLngWrap(_apiPointer, lat, long);
    };

    this.worldToScreen = function(position) {
        var point = L.latLng(position);
        return _worldToScreen(point.lat, point.lng, point.alt || 0);
    };

    this.screenToTerrainPoint = function(screenPoint) {
        var point = L.point(screenPoint);
        return _screenToTerrainPoint(point.x, point.y);
    };

    this.screenToIndoorPoint = function(screenPoint) {
        var point = L.point(screenPoint);
        return _screenToIndoorPoint(point.x, point.y);
    };

    this.screenToWorldPoint = function(screenPoint) {
        return this.screenToIndoorPoint(screenPoint) || this.screenToTerrainPoint(screenPoint);
    };

    this.getAltitudeAtLatLng = function(position) {
        return _getAltitudeAtLatLng(position.lat, position.lng);
    };
}

module.exports = EmscriptenSpacesApi;