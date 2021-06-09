var space = require("../../public/space");

function EmscriptenSpacesApi(eegeoApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _worldToScreenWrap = null;
    var _screenToTerrainPointWrap = null;
    var _screenToIndoorPointWrap = null;
    var _getAltitudeAtLatLngWrap = null;
    var _getUpdatedAltitudeAtLatLngWrap = null;
    var _getMortonKeyAtLatLngWrap = null;
    var _getMortonKeyCenterWrap = null;
    var _getMortonKeyCornersWrap = null;

    var _spacesApi_ScreenPointToRay = cwrap("spacesApi_ScreenPointToRay", null, ["number", "number", "number", "number"]);
    var _spacesApi_LatLongToVerticallyDownRay = cwrap("spacesApi_LatLongToVerticallyDownRay", null, ["number", "number", "number", "number"]);

    var _worldToScreen = function(lat, long, alt) {
        _worldToScreenWrap = _worldToScreenWrap || cwrap("worldToScreen", null, ["number", "number", "number", "number", "number"]);

        var screenPos = [0, 0, 0];
        _emscriptenMemory.passDoubles(screenPos, function(resultArray, arraySize) {
            _worldToScreenWrap(_eegeoApiPointer, lat, long, alt, resultArray);
            screenPos = _emscriptenMemory.readDoubles(resultArray, 3);
        });
        return new space.Vector3(screenPos);
    };

    var _screenToLatLng = function(screenX, screenY, raycastFunc) {
        var latLngAltArray = [0, 0, 0];
        var foundWorldPoint = false;
        _emscriptenMemory.passDoubles(latLngAltArray, function(resultArray, arraySize) {
            var success = raycastFunc(_eegeoApiPointer, screenX, screenY, resultArray);
            foundWorldPoint = !!success;
            latLngAltArray = _emscriptenMemory.readDoubles(resultArray, 3);
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
        return _getAltitudeAtLatLngWrap(_eegeoApiPointer, lat, long);
    };

    var _getUpdatedAltitudeAtLatLng = function(lat, long, previousHeight, previousLevel) {
        _getUpdatedAltitudeAtLatLngWrap = _getUpdatedAltitudeAtLatLngWrap || cwrap("getUpdatedAltitudeAtLatLng", "number", ["number", "number", "number", "number", "number", "number"]);
        var results = [0, 0];
        var altitudeUpdated = false;
        _emscriptenMemory.passDoubles(results, function(resultArray, arraySize) {
            var success = _getUpdatedAltitudeAtLatLngWrap(_eegeoApiPointer, lat, long, previousHeight, previousLevel, resultArray);
            altitudeUpdated = !!success;
            if (altitudeUpdated) {
                results = _emscriptenMemory.readDoubles(resultArray, 2);
            }
        });
        return altitudeUpdated ? results : null;
    };

    var _getMortonKeyAtLatLng = function(lat, long) {
        _getMortonKeyAtLatLngWrap = _getMortonKeyAtLatLngWrap || cwrap("getMortonKeyAtLatLng", null, ["number", "number", "number"]);
        var mortonKey = "";
        _emscriptenMemory.passString(mortonKey, function(resultString){
            _getMortonKeyAtLatLngWrap(lat, long, resultString);
            mortonKey = _emscriptenMemory.stringifyPointer(resultString);
        });
        return mortonKey;
    };

    var _getMortonKeyCenter = function(mortonKey) {
        _getMortonKeyCenterWrap = _getMortonKeyCenterWrap || cwrap("getMortonKeyCenter", null, ["string", "number"]);
        var latLngCenterArray = [0, 0];
        _emscriptenMemory.passDoubles(latLngCenterArray, function(resultArray, arraySize) {
            _getMortonKeyCenterWrap(mortonKey, resultArray);
            latLngCenterArray = _emscriptenMemory.readDoubles(resultArray, 2);
        });
        latLngCenterArray.forEach(function(value, index) {
            if (isNaN(value)) {
                latLngCenterArray[index] = 0;
            }
        });
        return L.latLng(latLngCenterArray);
    };

    var _getMortonKeyCorners = function(mortonKey, insetMeters) {
        _getMortonKeyCornersWrap = _getMortonKeyCornersWrap || cwrap("getMortonKeyCorners", null, ["string", "number", "number"]);
        var latLngCornersArray = [0, 0, 0, 0, 0, 0, 0, 0];
        _emscriptenMemory.passDoubles(latLngCornersArray, function(resultArray, arraySize) {
            _getMortonKeyCornersWrap(mortonKey, insetMeters, resultArray);
            latLngCornersArray = _emscriptenMemory.readDoubles(resultArray, 8);
        });
        latLngCornersArray.forEach(function(value, index) {
            if (isNaN(value)) {
                latLngCornersArray[index] = 0;
            }
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
        latLng = L.latLng(latLng);
        return _getAltitudeAtLatLng(latLng.lat, latLng.lng);
    };

    this.getUpdatedAltitudeAtLatLng = function(latLng, previousHeight, previousLevel) {
        return _getUpdatedAltitudeAtLatLng(latLng.lat, latLng.lng, previousHeight, previousLevel);
    };


    this.screenPointToRay = function(screenPoint) {
        var point = L.point(screenPoint);
        var resultRayBuffer = _emscriptenMemory.createDoubleBuffer(6);
        _spacesApi_ScreenPointToRay(_eegeoApiPointer, point.x, point.y, resultRayBuffer.ptr);
        var resultArray = _emscriptenMemory.consumeBufferToArray(resultRayBuffer);
        var rayOrigin = new space.Vector3(resultArray[0], resultArray[1], resultArray[2]);
        var rayDirection = new space.Vector3(resultArray[3], resultArray[4], resultArray[5]);
        return {
            origin: rayOrigin,
            direction: rayDirection
        };
    };

    this.latLongToVerticallyDownRay = function(latLng) {
        var resultRayBuffer = _emscriptenMemory.createDoubleBuffer(6);
        _spacesApi_LatLongToVerticallyDownRay(_eegeoApiPointer, latLng.lat, latLng.lng, resultRayBuffer.ptr);
        var resultArray = _emscriptenMemory.consumeBufferToArray(resultRayBuffer);
        var rayOrigin = new space.Vector3(resultArray[0], resultArray[1], resultArray[2]);
        var rayDirection = new space.Vector3(resultArray[3], resultArray[4], resultArray[5]);
        return {
            origin: rayOrigin,
            direction: rayDirection
        };
    };

    this.getMortonKeyAtLatLng = function(latLng) {
        var _latLng = L.latLng(latLng);
        return _getMortonKeyAtLatLng(_latLng.lat, _latLng.lng);
    };

    this.getMortonKeyCenter = function(mortonKey) {
        return _getMortonKeyCenter(mortonKey);
    };

    this.getMortonKeyCorners = function(mortonKey, insetMeters) {
        return _getMortonKeyCorners(mortonKey, insetMeters || 0.0);
    };
}

module.exports = EmscriptenSpacesApi;