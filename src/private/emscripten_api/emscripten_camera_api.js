var emscriptenMemory = require("./emscripten_memory");

function EmscriptenCameraApi(apiPointer, cwrap) {
    var _apiPointer = apiPointer;
    var _setViewInterop = cwrap("setView", null, ["number", "number", "number", "number", "number", "number", "number"]);
    var _setViewToBoundsInterop = cwrap("setViewToBounds", null, ["number", "number", "number", "number", "number", "number", "number", "number", "number"]);
    var _getDistanceToInterestInterop = cwrap("getDistanceToInterest", "number", ["number"]);
    var _getInterestLatLongInterop = cwrap("getInterestLatLong", null, ["number", "number"]);

    var _setMoveStartCallback = cwrap("setMoveStartCallback", null, ["number", "number"]);
    var _setMoveCallback = cwrap("setMoveCallback", null, ["number", "number"]);
    var _setMoveEndCallback = cwrap("setMoveEndCallback", null, ["number", "number"]);

    var _setView = function(location, distance, animated, allowInterruption) {
        _setViewInterop(
        	_apiPointer, 
        	location.lat, location.lng, location.alt || 0, 
        	distance, 
        	animated,
            allowInterruption
        );
    };

    var _setViewToBounds = function(northEast, southWest, animated, allowInterruption) {
        _setViewToBoundsInterop(
        	_apiPointer, 
        	northEast.lat, northEast.lng, northEast.alt || 0, 
        	southWest.lat, southWest.lng, southWest.alt || 0, 
        	animated,
            allowInterruption
        );
    };

    this.setView = function(config) {
    	var location = L.latLng(config["location"]);
    	var distance = config["distance"] || 1781.0;
    	var animated = "animate" in config ? config["animate"] : true;
        var allowInterruption = "allowInterruption" in config ? config["allowInterruption"] : true;

        return _setView(location, distance, animated, allowInterruption);
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
        return _getDistanceToInterestInterop(_apiPointer);
    };

    this.getInterestLatLong = function() {
        var latLong = [0, 0];
        emscriptenMemory.passDoubles(latLong, function(resultArray, arraySize) {
            _getInterestLatLongInterop(_apiPointer, resultArray);
            latLong = emscriptenMemory.readDoubles(resultArray, 2);
        });

        return latLong;
    };

    this.setMoveStartCallback = function(callback) {
        _setMoveStartCallback(_apiPointer, Runtime.addFunction(callback));
    }

    this.setMoveCallback = function(callback) {
        _setMoveCallback(_apiPointer, Runtime.addFunction(callback));
    }

    this.setMoveEndCallback = function(callback) {
        _setMoveEndCallback(_apiPointer, Runtime.addFunction(callback));
    }

}

module.exports = EmscriptenCameraApi;