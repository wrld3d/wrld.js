function EmscriptenIndoorsApi(emscriptenApiPointer, eegeoApiPointer, cwrap, runtime, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _eegeoApiPointer = eegeoApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _indoorsApi_RegisterIndoorMapCallbacks = cwrap("indoorsApi_RegisterIndoorMapCallbacks", null, ["number", "number", "number", "number", "number"]);
    var _indoorsApi_ExitIndoorMap = cwrap("indoorsApi_ExitIndoorMap", null, ["number"]);

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

    var _onIndoorMapEntered = null;
    var _onIndoorMapEnterFailed = null;
    var _onIndoorMapExited = null;
    var _onIndoorMapFloorChanged = null;
    var _onIndoorMapEntryMarkerAdded = null;
    var _onIndoorMapEntryMarkerRemoved = null;
    
    var _indoorMapEnteredHandler = function() {
        if (_onIndoorMapEntered != null) {
            _onIndoorMapEntered();
        }
    }

    var _indoorMapEntryFailedHandler = function() {
        if (_onIndoorMapEnterFailed != null) {
            _onIndoorMapEnterFailed();
        }
    }

    var _indoorMapExitedHandler = function() {
        if (_onIndoorMapExited != null) {
            _onIndoorMapExited();
        }
    }

    var _indoorMapFloorChangedHandler = function() {
        if (_onIndoorMapFloorChanged != null) {
            _onIndoorMapFloorChanged();
        }
    }

    var _executeEntryMarkerCallback = function(callback, indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) {
        var indoorMapId = _emscriptenMemory.stringifyPointer(indoorMapIdPtr);
        var indoorMapName = _emscriptenMemory.stringifyPointer(indoorMapNamePtr);
        var latLngArray = _emscriptenMemory.readDoubles(indoorMapLatLngPtr, 3);
        var markerLatLng = L.latLng(latLngArray);
        callback(indoorMapId, indoorMapName, markerLatLng);
    };
    
    var _indoorMapEntryMarkerAddedHandler = function(indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) {
        if (_onIndoorMapEntryMarkerAdded != null) {
            _executeEntryMarkerCallback(_onIndoorMapEntryMarkerAdded, indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr);
        }
    }

    var _indoorMapEntryMarkerRemovedHandler = function(indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) {
        if (_onIndoorMapEntryMarkerRemoved != null) {
            _executeEntryMarkerCallback(_onIndoorMapEntryMarkerRemoved, indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr);
        }
    }

    this.onInitialized = function() {
        _indoorsApi_RegisterIndoorMapCallbacks(
            _emscriptenApiPointer,
            runtime.addFunction(_indoorMapEnteredHandler),
            runtime.addFunction(_indoorMapEntryFailedHandler),
            runtime.addFunction(_indoorMapExitedHandler),
            runtime.addFunction(_indoorMapFloorChangedHandler),
            runtime.addFunction(_indoorMapEntryMarkerAddedHandler),
            runtime.addFunction(_indoorMapEntryMarkerRemovedHandler)
            );
    }
    
    this.setNotificationCallbacks = function (
        indoorMapEnteredCallback,
        indoorMapEnterFailedCallback,
        indoorMapExitedCallback,
        indoorMapFloorChangedCallback,
        indoorMapEntryMarkerAddedCallback,
        indoorMapEntryMarkerRemovedCallback
        ) {
            _onIndoorMapEntered = indoorMapEnteredCallback;
            _onIndoorMapEnterFailed = indoorMapEnterFailedCallback;
            _onIndoorMapExited = indoorMapExitedCallback;
            _onIndoorMapFloorChanged = indoorMapFloorChangedCallback;
            _onIndoorMapEntryMarkerAdded = indoorMapEntryMarkerAddedCallback;
            _onIndoorMapEntryMarkerRemoved = indoorMapEntryMarkerRemovedCallback;
    };

    this.exitIndoorMap = function() {
        _indoorsApi_ExitIndoorMap(_emscriptenApiPointer);
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
