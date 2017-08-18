function EmscriptenIndoorsApi(eegeoApiPointer, cwrap, runtime, emscriptenMemory) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _exitIndoorMap = null;
    var _setIndoorMapEnteredCallback = null;
    var _setIndoorMapExitedCallback = null;
    var _setIndoorMapFloorChangedCallback = null;

    var _setIndoorMapMarkerAddedCallback = null;
    var _setIndoorMapMarkerRemovedCallback = null;
    var _setAreaClickedCallback = null;

    var _hasActiveIndoorMap = null;
    var _getActiveIndoorMapId = null;
    var _getActiveIndoorMapName = null;
    var _getActiveIndoorMapSourceVendor = null;
    var _getActiveIndoorMapFloorCount = null; 
    var _getActiveIndoorMapUserData = null;

    var _getSelectedFloorIndex = null; 
    var _setSelectedFloorIndex = null; 

    var _getFloorName = null;
    var _getFloorShortName = null;
    var _getFloorNumber = null;
    var _getFloorHeightAboveSeaLevel = null;

    var _enterIndoorMap = null;

    var _wrapCallback = function(callback) {
        return function(indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) {
            var indoorMapId = _emscriptenMemory.stringifyPointer(indoorMapIdPtr);
            var indoorMapName = _emscriptenMemory.stringifyPointer(indoorMapNamePtr);
            var latLngArray = _emscriptenMemory.readDoubles(indoorMapLatLngPtr, 3);
            var markerLatLng = L.latLng(latLngArray);
            callback(indoorMapId, indoorMapName, markerLatLng);
        };
    };

    this.registerIndoorMapEnteredCallback = function (callback) {
        _setIndoorMapEnteredCallback = _setIndoorMapEnteredCallback || cwrap("setIndoorMapEnteredCallback", null, ["number", "number"]);
        _setIndoorMapEnteredCallback(_eegeoApiPointer, runtime.addFunction(callback));
    };

    this.registerIndoorMapExitedCallback = function (callback) {
        _setIndoorMapExitedCallback = _setIndoorMapExitedCallback || cwrap("setIndoorMapExitedCallback", null, ["number", "number"]);
        _setIndoorMapExitedCallback(_eegeoApiPointer, runtime.addFunction(callback));
    };

    this.registerIndoorMapFloorChangedCallback = function(callback) {
        _setIndoorMapFloorChangedCallback = _setIndoorMapFloorChangedCallback || cwrap("setIndoorMapFloorChangedCallback", null, ["number", "number"]);
        _setIndoorMapFloorChangedCallback(_eegeoApiPointer, runtime.addFunction(callback));
    };

    this.registerIndoorMapMarkerAddedCallback = function(callback) {
        _setIndoorMapMarkerAddedCallback = _setIndoorMapMarkerAddedCallback|| cwrap("setIndoorMapMarkerAddedCallback", null, ["number", "number"]);
        var wrappedCallback = _wrapCallback(callback);
        _setIndoorMapMarkerAddedCallback(_eegeoApiPointer, runtime.addFunction(wrappedCallback));
    };

    this.registerIndoorMapMarkerRemovedCallback = function(callback) {
        _setIndoorMapMarkerRemovedCallback = _setIndoorMapMarkerRemovedCallback || cwrap("setIndoorMapMarkerRemovedCallback", null, ["number", "number"]);
        var wrappedCallback = _wrapCallback(callback);
        _setIndoorMapMarkerRemovedCallback(_eegeoApiPointer, runtime.addFunction(wrappedCallback));
    };

    this.registerAreaClickedCallback = function(callback) {
        _setAreaClickedCallback = _setAreaClickedCallback || cwrap("setAreaPickedCallback", null, ["number", "number"]);
        var wrappedCallback = _wrapCallback(callback);
        _setAreaClickedCallback(_eegeoApiPointer, runtime.addFunction(wrappedCallback));
    };

    this.registerAreaClickedCallback = function(callback) {
        _setAreaClickedCallback = _setAreaClickedCallback || cwrap("setAreaPickedCallback", null, ["number", "number"]);
        var wrappedCallback = _wrapCallback(callback);
        _setAreaClickedCallback(_apiPointer, runtime.addFunction(wrappedCallback));
    };

    this.exitIndoorMap = function() {
        _exitIndoorMap = _exitIndoorMap || cwrap("exitIndoorMap", null, ["number"]);
        _exitIndoorMap(_eegeoApiPointer);
    };

    this.hasActiveIndoorMap = function() {
        _hasActiveIndoorMap = _hasActiveIndoorMap || cwrap("hasActiveIndoorMap", "number", ["number"]);
        return !!_hasActiveIndoorMap(_eegeoApiPointer);
    };

    this.getActiveIndoorMapId = function() {
        _getActiveIndoorMapId = _getActiveIndoorMapId || cwrap("getActiveIndoorMapId", "string", ["number"]);
        return _getActiveIndoorMapId(_eegeoApiPointer);
    };

    this.getActiveIndoorMapName = function() {
        _getActiveIndoorMapName = _getActiveIndoorMapName || cwrap("getActiveIndoorMapName", "string", ["number"]);
        return _getActiveIndoorMapName(_eegeoApiPointer);
    };

    this.getActiveIndoorMapSourceVendor = function() {
        _getActiveIndoorMapSourceVendor = _getActiveIndoorMapSourceVendor || cwrap("getActiveIndoorMapSourceVendor", "string", ["number"]);
        return _getActiveIndoorMapSourceVendor(_eegeoApiPointer);
    };

    this.getActiveIndoorMapFloorCount = function() {
         _getActiveIndoorMapFloorCount = _getActiveIndoorMapFloorCount || cwrap("getActiveIndoorMapFloorCount", "number", ["number"]);
        return _getActiveIndoorMapFloorCount(_eegeoApiPointer);
    };

    this.getActiveIndoorMapUserData = function() {
        _getActiveIndoorMapUserData = _getActiveIndoorMapUserData || cwrap("getActiveIndoorMapUserData", "string", ["number"]);
        return _getActiveIndoorMapUserData(_eegeoApiPointer);
    };
    
    this.getSelectedFloorIndex = function() {
        _getSelectedFloorIndex = _getSelectedFloorIndex || cwrap("getSelectedFloorIndex", "number", ["number"]);
        return _getSelectedFloorIndex(_eegeoApiPointer);
    };

    this.setSelectedFloorIndex = function(floorIndex) {
        _setSelectedFloorIndex = _setSelectedFloorIndex || cwrap("setSelectedFloorIndex", "number", ["number", "number"]);
        return !!_setSelectedFloorIndex(_eegeoApiPointer, floorIndex);
    };
    
    this.getFloorName = function(floorIndex) {
        _getFloorName = _getFloorName || cwrap("getFloorName", "string", ["number", "number"]);
        return _getFloorName(_eegeoApiPointer, floorIndex);
    };

    this.getFloorShortName = function(floorIndex) {
        _getFloorShortName = _getFloorShortName || cwrap("getFloorShortName", "string", ["number", "number"]);
        return _getFloorShortName(_eegeoApiPointer, floorIndex);
    };

    this.getFloorNumber = function(floorIndex) {
        _getFloorNumber = _getFloorNumber || cwrap("getFloorNumber", "number", ["number", "number"]);
        return _getFloorNumber(_eegeoApiPointer, floorIndex);
    };

    this.getFloorHeightAboveSeaLevel = function(floorIndex) {
        _getFloorHeightAboveSeaLevel = _getFloorHeightAboveSeaLevel || cwrap("getFloorHeightAboveSeaLevel", "number", ["number", "number"]);
        return _getFloorHeightAboveSeaLevel(_eegeoApiPointer, floorIndex);
    };

    this.enterIndoorMap = function(indoorMapId) {
        _enterIndoorMap = _enterIndoorMap || cwrap("enterIndoorMap", null, ["number", "string"]);
        return _enterIndoorMap(_eegeoApiPointer, indoorMapId);
    };
}

module.exports = EmscriptenIndoorsApi;
