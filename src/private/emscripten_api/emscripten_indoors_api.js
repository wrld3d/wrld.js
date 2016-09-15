var emscriptenMemory = require("./emscripten_memory");

function EmscriptenIndoorsApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;
    var _exitIndoorMap = cwrap("exitIndoorMap", null, ["number"]);
    var _setIndoorMapEnteredCallback = cwrap("setIndoorMapEnteredCallback", null, ["number", "number"]);
    var _setIndoorMapExitedCallback = cwrap("setIndoorMapExitedCallback", null, ["number", "number"]);
    var _setIndoorMapFloorChangedCallback = cwrap("setIndoorMapFloorChangedCallback", null, ["number", "number"]);

    var _setIndoorMapMarkerAddedCallback = cwrap("setIndoorMapMarkerAddedCallback", null, ["number", "number"]);
    var _setIndoorMapMarkerRemovedCallback = cwrap("setIndoorMapMarkerRemovedCallback", null, ["number", "number"]);

    var _hasActiveIndoorMap = cwrap("hasActiveIndoorMap", "number", ["number"]);
    var _getActiveIndoorMapId = cwrap("getActiveIndoorMapId", "string", ["number"]);
    var _getActiveIndoorMapName = cwrap("getActiveIndoorMapName", "string", ["number"]);
    var _getActiveIndoorMapFloorCount = cwrap("getActiveIndoorMapFloorCount", "number", ["number"]);

    var _getSelectedFloorIndex = cwrap("getSelectedFloorIndex", "number", ["number"]);
    var _setSelectedFloorIndex = cwrap("setSelectedFloorIndex", "number", ["number", "number"]);

    var _getFloorId = cwrap("getFloorId", "string", ["number", "number"]);
    var _getFloorName = cwrap("getFloorName", "string", ["number", "number"]);
    var _getFloorNumber = cwrap("getFloorNumber", "number", ["number", "number"]);
    var _getFloorHeightAboveSeaLevel = cwrap("getFloorHeightAboveSeaLevel", "number", ["number", "number"]);

    var _enterIndoorMap = cwrap("enterIndoorMap", null, ["number", "string"]);

    var _wrapCallback = function(callback) {
        return function(indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) {
            var indoorMapId = Module.Pointer_stringify(indoorMapIdPtr);
            var indoorMapName = Module.Pointer_stringify(indoorMapNamePtr);
            var latLngArray = emscriptenMemory.readDoubles(indoorMapLatLngPtr, 3);
            var markerLatLng = L.latLng(latLngArray);
            callback(indoorMapId, indoorMapName, markerLatLng);
        };
    };

    this.registerIndoorMapEnteredCallback = function (callback) {
        _setIndoorMapEnteredCallback(_apiPointer, runtime.addFunction(callback));
    };

    this.registerIndoorMapExitedCallback = function (callback) {
        _setIndoorMapExitedCallback(_apiPointer, runtime.addFunction(callback));
    };

    this.registerIndoorMapFloorChangedCallback = function(callback) {
        _setIndoorMapFloorChangedCallback(_apiPointer, runtime.addFunction(callback));
    };

    this.registerIndoorMapMarkerAddedCallback = function(callback) {
        var wrappedCallback = _wrapCallback(callback);
        _setIndoorMapMarkerAddedCallback(_apiPointer, runtime.addFunction(wrappedCallback));
    };

    this.registerIndoorMapMarkerRemovedCallback = function(callback) {
        var wrappedCallback = _wrapCallback(callback);
        _setIndoorMapMarkerRemovedCallback(_apiPointer, runtime.addFunction(wrappedCallback));
    };

    this.exitIndoorMap = function() {
        _exitIndoorMap(_apiPointer);
    };

    this.hasActiveIndoorMap = function() {
        return !!_hasActiveIndoorMap(_apiPointer);
    };

    this.getActiveIndoorMapId = function() {
        return _getActiveIndoorMapId(_apiPointer);
    };

    this.getActiveIndoorMapName = function() {
        return _getActiveIndoorMapName(_apiPointer);
    };

    this.getActiveIndoorMapFloorCount = function() {
        return _getActiveIndoorMapFloorCount(_apiPointer);
    };

    this.getSelectedFloorIndex = function() {
        return _getSelectedFloorIndex(_apiPointer);
    };

    this.setSelectedFloorIndex = function(floorIndex) {
        return !!_setSelectedFloorIndex(_apiPointer, floorIndex);
    };

    this.getFloorId = function(floorIndex) {
        return _getFloorId(_apiPointer, floorIndex);
    };

    this.getFloorName = function(floorIndex) {
        return _getFloorName(_apiPointer, floorIndex);
    };

    this.getFloorNumber = function(floorIndex) {
        return _getFloorNumber(_apiPointer, floorIndex);
    };

    this.getFloorHeightAboveSeaLevel = function(floorIndex) {
        return _getFloorHeightAboveSeaLevel(_apiPointer, floorIndex);
    };

    this.enterIndoorMap = function(indoorMapId) {
        return _enterIndoorMap(_apiPointer, indoorMapId);
    };
}

module.exports = EmscriptenIndoorsApi;
