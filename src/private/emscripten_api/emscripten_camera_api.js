var emscriptenMemory = require("./emscripten_memory");

function EmscriptenCameraApi(apiPointer, cwrap, runtime) {
    var _apiPointer = apiPointer;
    var _setViewInterop = null; 
    var _setViewToBoundsInterop = null;
    var _getDistanceToInterestInterop = null;
    var _getInterestLatLongInterop = null;
    var _getPitchDegreesInterop = null;
    var _setEventCallbackInterop = null;

    var _setView = function(animated, location, distance, headingDegrees, tiltDegrees, durationSeconds, jumpIfFarAway, allowInterruption) {
        _setViewInterop = _setViewInterop || cwrap("setView", "number", ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number" ]);
       
        return _setViewInterop(
        	_apiPointer, 
            animated,
        	location.lat, location.lng, location.alt || 0, true,
        	distance || 0, distance !== null, 
            headingDegrees || 0, headingDegrees !== null, 
            tiltDegrees || 0, tiltDegrees !== null, 
            durationSeconds || 0, durationSeconds !== null, 
            jumpIfFarAway,
            allowInterruption
        );
    };

    var _setViewToBounds = function(northEast, southWest, animated, allowInterruption) {
        _setViewToBoundsInterop = _setViewToBoundsInterop || cwrap("setViewToBounds", null, ["number", "number", "number", "number", "number", "number", "number", "number", "number"]);
        
        _setViewToBoundsInterop(
        	_apiPointer, 
        	northEast.lat, northEast.lng, northEast.alt || 0, 
        	southWest.lat, southWest.lng, southWest.alt || 0, 
        	animated,
            allowInterruption
        );
    };

    this.setView = function(config) {
        var animated = "animate" in config ? config["animate"] : true;
    	var location = L.latLng(config["location"]);
        var distance = "distance" in config ? config["distance"] : null;
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
        _getDistanceToInterestInterop = _getDistanceToInterestInterop || cwrap("getDistanceToInterest", "number", ["number"]);
        return _getDistanceToInterestInterop(_apiPointer);
    };

    this.getInterestLatLong = function() {
        _getInterestLatLongInterop = _getInterestLatLongInterop || cwrap("getInterestLatLong", null, ["number", "number"]);

        var latLong = [0, 0];
        emscriptenMemory.passDoubles(latLong, function(resultArray, arraySize) {
            _getInterestLatLongInterop(_apiPointer, resultArray);
            latLong = emscriptenMemory.readDoubles(resultArray, 2);
        });

        return latLong;
    };

    this.getPitchDegrees = function() {
        _getPitchDegreesInterop = _getPitchDegreesInterop || cwrap("getPitchDegrees", "number", ["number"]);
        return _getPitchDegreesInterop(_apiPointer);
    };

    this.setEventCallback = function(callback) {
        _setEventCallbackInterop = _setEventCallbackInterop || cwrap("setEventCallback", null, ["number", "number"]);
        _setEventCallbackInterop(_apiPointer, runtime.addFunction(callback));
    };

}

module.exports = EmscriptenCameraApi;