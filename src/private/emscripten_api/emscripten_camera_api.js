function EmscriptenCameraApi(eegeoApiPointer, cwrap, runtime, emscriptenMemory) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _setViewInterop = null; 
    var _setViewToBoundsInterop = null;
    var _getDistanceToInterestInterop = null;
    var _getInterestLatLongInterop = null;
    var _getPitchDegreesInterop = null;
    var _getHeadingDegreesInterop = null;
    var _setEventCallbackInterop = null;
    var _getDistanceFromZoomLevelInterop = null;
    var _getZoomLevelInterop = null;

    var _setView = function(animated, location, distance, headingDegrees, tiltDegrees, durationSeconds, jumpIfFarAway, allowInterruption) {
        _setViewInterop = _setViewInterop || cwrap("setViewUsingZenithAngle", "number", ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number" ]);
       
       var modifyLocation = true;
       if(location === null ) {
         location = {lat:0, lng: 0, alt: 0};
         modifyLocation = false;
       }
       
        return _setViewInterop(
        	_eegeoApiPointer, 
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
        _setViewToBoundsInterop = _setViewToBoundsInterop || cwrap("setViewToBounds", null, ["number", "number", "number", "number", "number", "number", "number", "number", "number"]);
        
        _setViewToBoundsInterop(
        	_eegeoApiPointer, 
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
        _getDistanceToInterestInterop = _getDistanceToInterestInterop || cwrap("getDistanceToInterest", "number", ["number"]);
        return _getDistanceToInterestInterop(_eegeoApiPointer);
    };

    this.getInterestLatLong = function() {
        _getInterestLatLongInterop = _getInterestLatLongInterop || cwrap("getInterestLatLong", null, ["number", "number"]);

        var latLong = [0, 0];
        _emscriptenMemory.passDoubles(latLong, function(resultArray, arraySize) {
            _getInterestLatLongInterop(_eegeoApiPointer, resultArray);
            latLong = _emscriptenMemory.readDoubles(resultArray, 2);
        });

        return latLong;
    };

    this.getPitchDegrees = function() {
        _getPitchDegreesInterop = _getPitchDegreesInterop || cwrap("getPitchDegrees", "number", ["number"]);
        return _getPitchDegreesInterop(_eegeoApiPointer);
    };

    this.getHeadingDegrees = function() {
        _getHeadingDegreesInterop = _getHeadingDegreesInterop || cwrap("getHeadingDegrees", "number", ["number"]);
        return _getHeadingDegreesInterop(_eegeoApiPointer);
    };

    this.setEventCallback = function(callback) {
        _setEventCallbackInterop = _setEventCallbackInterop || cwrap("setEventCallback", null, ["number", "number"]);
        _setEventCallbackInterop(_eegeoApiPointer, runtime.addFunction(callback));
    };

    this.getDistanceFromZoomLevel = function(zoomLevel) {
        _getDistanceFromZoomLevelInterop = _getDistanceFromZoomLevelInterop || cwrap("getDistanceFromZoomLevel", "number", ["number", "number"]);
        return _getDistanceFromZoomLevelInterop(_eegeoApiPointer, zoomLevel);
    };

    this.getZoomLevel = function() {
        _getZoomLevelInterop = _getZoomLevelInterop || cwrap("getZoomLevel", "number", ["number"]);
        return _getZoomLevelInterop(_eegeoApiPointer);
    };

}

module.exports = EmscriptenCameraApi;