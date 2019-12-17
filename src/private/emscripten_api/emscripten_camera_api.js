function EmscriptenCameraApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _cameraApi_setViewUsingZenithAngle = cwrap("cameraApi_setViewUsingZenithAngle", "number", ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number" ]);
    var _cameraApi_setViewToBounds = cwrap("cameraApi_setViewToBounds", null, ["number", "number", "number", "number", "number", "number", "number", "number", "number"]);

    var _cameraApi_getDistanceToInterest = cwrap("cameraApi_getDistanceToInterest", "number", ["number"]);
    var _cameraApi_getInterestLatLong = cwrap("cameraApi_getInterestLatLong", null, ["number", "number"]);
    var _cameraApi_getPitchDegrees = cwrap("cameraApi_getPitchDegrees", "number", ["number"]);
    var _cameraApi_getHeadingDegrees = cwrap("cameraApi_getHeadingDegrees", "number", ["number"]);
    var _cameraApi_setEventCallback = cwrap("cameraApi_setEventCallback", null, ["number", "number"]);
    var _cameraApi_getDistanceFromZoomLevel = cwrap("cameraApi_getDistanceFromZoomLevel", "number", ["number", "number"]);
    var _cameraApi_getZoomLevel = cwrap("cameraApi_getZoomLevel", "number", ["number"]);
    var _cameraApi_setVerticallyLocked = cwrap("cameraApi_setVerticallyLocked", null, ["number", "number"]);

    var _setView = function(animated, location, distance, headingDegrees, tiltDegrees, durationSeconds, jumpIfFarAway, allowInterruption) {

       var modifyLocation = true;
       if(location === null ) {
         location = {lat:0, lng: 0, alt: 0};
         modifyLocation = false;
       }

        return _cameraApi_setViewUsingZenithAngle(
            _emscriptenApiPointer,
            animated,
            location.lat || 0, location.lng || 0, location.alt || 0, modifyLocation,
            distance || 0, distance !== null,
            headingDegrees || 0, headingDegrees !== null,
            tiltDegrees || 0, tiltDegrees !== null,
            durationSeconds || 0, durationSeconds !== null,
            jumpIfFarAway,
            allowInterruption
        );
    };

    var _setViewToBounds = function(northEast, southWest, animated, allowInterruption) {


        _cameraApi_setViewToBounds(
            _emscriptenApiPointer,
            northEast.lat, northEast.lng, northEast.alt || 0,
            southWest.lat, southWest.lng, southWest.alt || 0,
            animated,
            allowInterruption
        );
    };

    this.setView = function(config) {
        var animated = "animate" in config ? config["animate"] : true;
        var location = "location" in config ? L.latLng(config["location"]): null;
        var distance = "zoom" in config ? this.getDistanceFromZoomLevel(config["zoom"]) : "distance" in config ? config["distance"] : null;
        var headingDegrees = "headingDegrees" in config ? config["headingDegrees"] : null;
        var tiltDegrees = "tiltDegrees" in config ? config["tiltDegrees"] : null;
        var durationSeconds = "durationSeconds" in config ? config["durationSeconds"] : null;
        var alwaysAnimate = "animate" in config && config["animate"] === true;
        var jumpIfFarAway = !alwaysAnimate;
        var allowInterruption = "allowInterruption" in config ? config["allowInterruption"] : true;

        return _setView(animated, location, distance, headingDegrees, tiltDegrees, durationSeconds, jumpIfFarAway, allowInterruption);
    };

    this.setViewToBounds = function(config) {
        var bounds = L.latLngBounds(config["bounds"]);
        var animated = "animate" in config ? config["animate"] : true;
        var allowInterruption = "allowInterruption" in config ? config["allowInterruption"] : true;

        return _setViewToBounds(
            bounds._northEast,
            bounds._southWest,
            animated,
            allowInterruption
        );
    };

    this.getDistanceToInterest = function() {
        return _cameraApi_getDistanceToInterest(_emscriptenApiPointer);
    };

    this.getInterestLatLong = function() {
        var latLong = [0, 0];
        _emscriptenMemory.passDoubles(latLong, function(resultArray, arraySize) {
            _cameraApi_getInterestLatLong(_emscriptenApiPointer, resultArray);
            latLong = _emscriptenMemory.readDoubles(resultArray, 2);
        });

        return latLong;
    };

    this.getPitchDegrees = function() {

        return _cameraApi_getPitchDegrees(_emscriptenApiPointer);
    };

    this.getHeadingDegrees = function() {
        return _cameraApi_getHeadingDegrees(_emscriptenApiPointer);
    };

    this.setEventCallback = function(callback) {
        _cameraApi_setEventCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback));
    };

    this.getDistanceFromZoomLevel = function(zoomLevel) {
        return _cameraApi_getDistanceFromZoomLevel(_emscriptenApiPointer, zoomLevel);
    };

    this.getZoomLevel = function() {
        return _cameraApi_getZoomLevel(_emscriptenApiPointer);
    };

    this.setVerticallyLocked = function(isVerticallyLocked) {
        _cameraApi_setVerticallyLocked(_emscriptenApiPointer, isVerticallyLocked);
    };

}

module.exports = EmscriptenCameraApi;