var emscriptenMemory = require("./emscripten_memory");

function EmscriptenIndoorsApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;
    var _exitIndoorMap = null;
    var _setIndoorMapEnteredCallback = null;
    var _setIndoorMapExitedCallback = null;
    var _setIndoorMapFloorChangedCallback = null;

    var _setIndoorMapMarkerAddedCallback = null;
    var _setIndoorMapMarkerRemovedCallback = null;

    var _hasActiveIndoorMap = null;
    var _getActiveIndoorMapId = null;
    var _getActiveIndoorMapName = null;
    var _getActiveIndoorMapSourceVendor = null;
    var _getActiveIndoorMapFloorCount = null; 
    var _getActiveIndoorMapUserData = null;

    var _getSelectedFloorIndex = null; 
    var _setSelectedFloorIndex = null; 

    var _getFloorId = null;
    var _getFloorName = null;
    var _getFloorNumber = null;
    var _getFloorHeightAboveSeaLevel = null;

    var _enterIndoorMap = null;

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
        _setIndoorMapEnteredCallback = _setIndoorMapEnteredCallback || cwrap("setIndoorMapEnteredCallback", null, ["number", "number"]);
        _setIndoorMapEnteredCallback(_apiPointer, runtime.addFunction(callback));
    };

    this.registerIndoorMapExitedCallback = function (callback) {
        _setIndoorMapExitedCallback = _setIndoorMapExitedCallback || cwrap("setIndoorMapExitedCallback", null, ["number", "number"]);
        _setIndoorMapExitedCallback(_apiPointer, runtime.addFunction(callback));
    };

    this.registerIndoorMapFloorChangedCallback = function(callback) {
        _setIndoorMapFloorChangedCallback = _setIndoorMapFloorChangedCallback || cwrap("setIndoorMapFloorChangedCallback", null, ["number", "number"]);
        _setIndoorMapFloorChangedCallback(_apiPointer, runtime.addFunction(callback));
    };

    this.registerIndoorMapMarkerAddedCallback = function(callback) {
        _setIndoorMapMarkerAddedCallback = _setIndoorMapMarkerAddedCallback|| cwrap("setIndoorMapMarkerAddedCallback", null, ["number", "number"]);
        var wrappedCallback = _wrapCallback(callback);
        _setIndoorMapMarkerAddedCallback(_apiPointer, runtime.addFunction(wrappedCallback));
    };

    this.registerIndoorMapMarkerRemovedCallback = function(callback) {
        _setIndoorMapMarkerRemovedCallback = _setIndoorMapMarkerRemovedCallback || cwrap("setIndoorMapMarkerRemovedCallback", null, ["number", "number"]);
        var wrappedCallback = _wrapCallback(callback);
        _setIndoorMapMarkerRemovedCallback(_apiPointer, runtime.addFunction(wrappedCallback));
    };

    this.exitIndoorMap = function() {
        _exitIndoorMap = _exitIndoorMap || cwrap("exitIndoorMap", null, ["number"]);
        _exitIndoorMap(_apiPointer);
    };

    this.hasActiveIndoorMap = function() {
        _hasActiveIndoorMap = _hasActiveIndoorMap || cwrap("hasActiveIndoorMap", "number", ["number"]);
        return !!_hasActiveIndoorMap(_apiPointer);
    };

    this.getActiveIndoorMapId = function() {
        _getActiveIndoorMapId = _getActiveIndoorMapId || cwrap("getActiveIndoorMapId", "string", ["number"]);
        return _getActiveIndoorMapId(_apiPointer);
    };

    this.getActiveIndoorMapName = function() {
        _getActiveIndoorMapName = _getActiveIndoorMapName || cwrap("getActiveIndoorMapName", "string", ["number"]);
        return _getActiveIndoorMapName(_apiPointer);
    };

    this.getActiveIndoorMapSourceVendor = function() {
        _getActiveIndoorMapSourceVendor = _getActiveIndoorMapSourceVendor || cwrap("getActiveIndoorMapSourceVendor", "string", ["number"]);
        return _getActiveIndoorMapSourceVendor(_apiPointer);
    };

    this.getActiveIndoorMapFloorCount = function() {
         _getActiveIndoorMapFloorCount = _getActiveIndoorMapFloorCount || cwrap("getActiveIndoorMapFloorCount", "number", ["number"]);
        return _getActiveIndoorMapFloorCount(_apiPointer);
    };

    this.getActiveIndoorMapUserData = function() {
        _getActiveIndoorMapUserData = _getActiveIndoorMapUserData || cwrap("getActiveIndoorMapUserData", "string", ["number"]);
        return _getActiveIndoorMapUserData(_apiPointer);
    };
    
    this.getSelectedFloorIndex = function() {
        _getSelectedFloorIndex = _getSelectedFloorIndex || cwrap("getSelectedFloorIndex", "number", ["number"]);
        return _getSelectedFloorIndex(_apiPointer);
    };

    this.setSelectedFloorIndex = function(floorIndex) {
        _setSelectedFloorIndex = _setSelectedFloorIndex || cwrap("setSelectedFloorIndex", "number", ["number", "number"]);
        return !!_setSelectedFloorIndex(_apiPointer, floorIndex);
    };

    this.getFloorId = function(floorIndex) {
        _getFloorId = _getFloorId || cwrap("getFloorId", "string", ["number", "number"]);
        return _getFloorId(_apiPointer, floorIndex);
    };

    this.getFloorName = function(floorIndex) {
        _getFloorName = _getFloorName || cwrap("getFloorName", "string", ["number", "number"]);
        return _getFloorName(_apiPointer, floorIndex);
    };

    this.getFloorNumber = function(floorIndex) {
        _getFloorNumber = _getFloorNumber || cwrap("getFloorNumber", "number", ["number", "number"]);
        return _getFloorNumber(_apiPointer, floorIndex);
    };

    this.getFloorHeightAboveSeaLevel = function(floorIndex) {
        _getFloorHeightAboveSeaLevel = _getFloorHeightAboveSeaLevel || cwrap("getFloorHeightAboveSeaLevel", "number", ["number", "number"]);
        return _getFloorHeightAboveSeaLevel(_apiPointer, floorIndex);
    };

    this.enterIndoorMap = function(indoorMapId) {
        _enterIndoorMap = _enterIndoorMap || cwrap("enterIndoorMap", null, ["number", "string"]);
        return _enterIndoorMap(_apiPointer, indoorMapId);
    };
}

module.exports = EmscriptenIndoorsApi;
