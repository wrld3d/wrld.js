function EmscriptenIndoorsApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _indoorsApi_RegisterIndoorMapCallbacks = cwrap("indoorsApi_RegisterIndoorMapCallbacks", null, ["number", "number", "number", "number", "number"]);
    var _indoorsApi_EnterIndoorMap = cwrap("indoorsApi_EnterIndoorMap", null, ["number", "string"]);
    var _indoorsApi_ExitIndoorMap = cwrap("indoorsApi_ExitIndoorMap", null, ["number"]);
    var _indoorsApi_HasActiveIndoorMap = cwrap("indoorsApi_HasActiveIndoorMap", "number", ["number"]);
    var _indoorsApi_GetActiveIndoorMapId = cwrap("indoorsApi_GetActiveIndoorMapId", "string", ["number"]);
    var _indoorsApi_GetActiveIndoorMapName = cwrap("indoorsApi_GetActiveIndoorMapName", "string", ["number"]);
    var _indoorsApi_GetActiveIndoorMapSourceVendor = cwrap("indoorsApi_GetActiveIndoorMapSourceVendor", "string", ["number"]);
    var _indoorsApi_GetActiveIndoorMapFloorCount = cwrap("indoorsApi_GetActiveIndoorMapFloorCount", "number", ["number"]);
    var _indoorsApi_GetActiveIndoorMapUserData = cwrap("indoorsApi_GetActiveIndoorMapUserData", "string", ["number"]);
    var _indoorsApi_GetSelectedFloorIndex = cwrap("indoorsApi_GetSelectedFloorIndex", "number", ["number"]);
    var _indoorsApi_SetSelectedFloorIndex = cwrap("indoorsApi_SetSelectedFloorIndex", "number", ["number", "number"]);
    var _indoorsApi_GetFloorName = cwrap("indoorsApi_GetFloorName", "string", ["number", "number"]);
    var _indoorsApi_GetFloorShortName = cwrap("indoorsApi_GetFloorShortName", "string", ["number", "number"]);
    var _indoorsApi_GetFloorNumber = cwrap("indoorsApi_GetFloorNumber", "number", ["number", "number"]);
    var _indoorsApi_GetFloorHeightAboveSeaLevel = cwrap("indoorsApi_GetFloorHeightAboveSeaLevel", "number", ["number", "number"]);


    var _onIndoorMapEntered = null;
    var _onIndoorMapEnterFailed = null;
    var _onIndoorMapExited = null;
    var _onIndoorMapFloorChanged = null;
    var _onIndoorMapEntryMarkerAdded = null;
    var _onIndoorMapEntryMarkerRemoved = null;

    var _indoorMapEnteredHandler = function() {
        if (_onIndoorMapEntered !== null) {
            _onIndoorMapEntered();
        }
    };

    var _indoorMapEntryFailedHandler = function() {
        if (_onIndoorMapEnterFailed !== null) {
            _onIndoorMapEnterFailed();
        }
    };

    var _indoorMapExitedHandler = function() {
        if (_onIndoorMapExited !== null) {
            _onIndoorMapExited();
        }
    };

    var _indoorMapFloorChangedHandler = function() {
        if (_onIndoorMapFloorChanged !== null) {
            _onIndoorMapFloorChanged();
        }
    };

    var _executeEntryMarkerCallback = function(callback, indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) {
        var indoorMapId = _emscriptenMemory.stringifyPointer(indoorMapIdPtr);
        var indoorMapName = _emscriptenMemory.stringifyPointer(indoorMapNamePtr);
        var latLngArray = _emscriptenMemory.readDoubles(indoorMapLatLngPtr, 3);
        var markerLatLng = L.latLng(latLngArray);
        callback(indoorMapId, indoorMapName, markerLatLng);
    };

    var _indoorMapEntryMarkerAddedHandler = function(indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) {
        if (_onIndoorMapEntryMarkerAdded !== null) {
            _executeEntryMarkerCallback(_onIndoorMapEntryMarkerAdded, indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr);
        }
    };

    var _indoorMapEntryMarkerRemovedHandler = function(indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) {
        if (_onIndoorMapEntryMarkerRemoved !== null) {
            _executeEntryMarkerCallback(_onIndoorMapEntryMarkerRemoved, indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr);
        }
    };

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
    };

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

    this.enterIndoorMap = function(indoorMapId) {
        return _indoorsApi_EnterIndoorMap(_emscriptenApiPointer, indoorMapId);
    };

    this.exitIndoorMap = function() {
        _indoorsApi_ExitIndoorMap(_emscriptenApiPointer);
    };

    this.hasActiveIndoorMap = function() {
        return !!_indoorsApi_HasActiveIndoorMap(_emscriptenApiPointer);
    };

    this.getActiveIndoorMapId = function() {
        return _indoorsApi_GetActiveIndoorMapId(_emscriptenApiPointer);
    };

    this.getActiveIndoorMapName = function() {
        return _indoorsApi_GetActiveIndoorMapName(_emscriptenApiPointer);
    };

    this.getActiveIndoorMapSourceVendor = function() {
        return _indoorsApi_GetActiveIndoorMapSourceVendor(_emscriptenApiPointer);
    };

    this.getActiveIndoorMapFloorCount = function() {
        return _indoorsApi_GetActiveIndoorMapFloorCount(_emscriptenApiPointer);
    };

    this.getActiveIndoorMapUserData = function() {
        return _indoorsApi_GetActiveIndoorMapUserData(_emscriptenApiPointer);
    };

    this.getSelectedFloorIndex = function() {
        return _indoorsApi_GetSelectedFloorIndex(_emscriptenApiPointer);
    };

    this.setSelectedFloorIndex = function(floorIndex) {
        return !!_indoorsApi_SetSelectedFloorIndex(_emscriptenApiPointer, floorIndex);
    };

    this.getFloorName = function(floorIndex) {
        return _indoorsApi_GetFloorName(_emscriptenApiPointer, floorIndex);
    };

    this.getFloorShortName = function(floorIndex) {
        return _indoorsApi_GetFloorShortName(_emscriptenApiPointer, floorIndex);
    };

    this.getFloorNumber = function(floorIndex) {
        return _indoorsApi_GetFloorNumber(_emscriptenApiPointer, floorIndex);
    };

    this.getFloorHeightAboveSeaLevel = function(floorIndex) {
        return _indoorsApi_GetFloorHeightAboveSeaLevel(_emscriptenApiPointer, floorIndex);
    };
}

module.exports = EmscriptenIndoorsApi;
