function EmscriptenCameraApi(apiPointer, cwrap) {
    var _apiPointer = apiPointer;
    var _setViewInterop = cwrap("setView", null, ["number", "number", "number", "number", "number", "number"]);
    var _setViewToBoundsInterop = cwrap("setViewToBounds", null, ["number", "number", "number", "number", "number", "number", "number", "number"]);

    var _setView = function(location, distance, animated) {
        _setViewInterop(
        	_apiPointer, 
        	location.lat, location.lng, location.alt || 0, 
        	distance, 
        	animated
        );
    };

    var _setViewToBounds = function(northEast, southWest, animated) {
        _setViewToBoundsInterop(
        	_apiPointer, 
        	northEast.lat, northEast.lng, northEast.alt || 0, 
        	southWest.lat, southWest.lng, southWest.alt || 0, 
        	animated
        );
    };

    this.setView = function(config) {
    	var location = L.latLng(config["location"]);
    	var distance = config["distance"] || 1781.0;
    	var animated = "animated" in config ? config["animated"] : true;

        return _setView(location, distance, animated);
    };

    this.setViewToBounds = function(config) {    	
    	var bounds = L.latLngBounds(config["bounds"]);
        var animated = "animated" in config ? config["animated"] : true;

        return _setViewToBounds(
        	bounds._northEast, 
        	bounds._southWest, 
        	animated
        );
    };
}

module.exports = EmscriptenCameraApi;