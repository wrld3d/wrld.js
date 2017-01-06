var emscriptenMemory = require("./emscripten_memory");
var space = require("../../public/space");

function EmscriptenSpacesApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;

    var _worldToScreenWrap = null;
    var _screenToTerrainPointWrap = null;
    var _screenToIndoorPointWrap = null;
    var _getAltitudeAtLatLngWrap = null;
    var _getUpdatedAltitudeAtLatLngWrap = null;
    var _getMortonKeyAtLatLngWrap = null;
    var _getMortonKeyCornersWrap = null;

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

    var _getUpdatedAltitudeAtLatLng = function(lat, long, previousHeight, previousLevel) {
        _getUpdatedAltitudeAtLatLngWrap = _getUpdatedAltitudeAtLatLngWrap || cwrap("getUpdatedAltitudeAtLatLng", "number", ["number", "number", "number", "number", "number", "number"]);
        var results = [0, 0];
        var altitudeUpdated = false;
        emscriptenMemory.passDoubles(results, function(resultArray, arraySize) {
            var success = _getUpdatedAltitudeAtLatLngWrap(_apiPointer, lat, long, previousHeight, previousLevel, resultArray);
            altitudeUpdated = !!success;
            if (altitudeUpdated) {
                results = emscriptenMemory.readDoubles(resultArray, 2);
            }
        });
        return altitudeUpdated ? results : null;
    };

    var _getMortonKeyAtLatLng = function(lat, long) {
        _getMortonKeyAtLatLngWrap = _getMortonKeyAtLatLngWrap || cwrap("getMortonKeyAtLatLng", null, ["number", "number", "number"]);
        var mortonKey = "";
        emscriptenMemory.passString(mortonKey, function(resultString){
            _getMortonKeyAtLatLngWrap(lat, long, resultString);
            mortonKey = Module.Pointer_stringify(resultString);
        });
        return mortonKey;
    };

    var _getMortonKeyCorners = function(mortonKey) {
        _getMortonKeyCornersWrap = _getMortonKeyCornersWrap || cwrap("getMortonKeyCorners", null, ["string", "number"]);
        var latLngCornersArray = [0, 0, 0, 0, 0, 0, 0, 0];
        emscriptenMemory.passDoubles(latLngCornersArray, function(resultArray, arraySize) {
            _getMortonKeyCornersWrap(mortonKey, resultArray);
            latLngCornersArray = emscriptenMemory.readDoubles(resultArray, 8);
        });
        return [
            L.latLng(latLngCornersArray.slice(0, 2)),
            L.latLng(latLngCornersArray.slice(2, 4)),
            L.latLng(latLngCornersArray.slice(4, 6)),
            L.latLng(latLngCornersArray.slice(6))
        ];
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

    this.getAltitudeAtLatLng = function(latLng) {
        return _getAltitudeAtLatLng(latLng.lat, latLng.lng);
    };

    this.getUpdatedAltitudeAtLatLng = function(latLng, previousHeight, previousLevel) {
        return _getUpdatedAltitudeAtLatLng(latLng.lat, latLng.lng, previousHeight, previousLevel);
    };

    this.getMortonKeyAtLatLng = function(latLng) {
        return _getMortonKeyAtLatLng(latLng.lat, latLng.lng);
    };

    this.getMortonKeyCorners = function(mortonKey) {
        return _getMortonKeyCorners(mortonKey);
    };
}

module.exports = EmscriptenSpacesApi;