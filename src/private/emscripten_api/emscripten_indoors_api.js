import L from "leaflet";
import { colorToRgba32 } from "./emscripten_interop_utils.js";

export function EmscriptenIndoorsApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _indoorsApi_RegisterIndoorMapCallbacks = cwrap("indoorsApi_RegisterIndoorMapCallbacks", null, ["number", "number", "number", "number", "number", "number", "number", "number", "number"]);
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

    var _indoorsApi_TryGetReadableNameBufferSize = cwrap("indoorsApi_TryGetReadableNameBufferSize", "number", ["number", "string", "number", "number"]);
    var _indoorsApi_TryGetReadableName = cwrap("indoorsApi_TryGetReadableName", "number", ["number", "string", "number", "number", "number"]);
    var _indoorsApi_TryGetFloorReadableNameBufferSize = cwrap("indoorsApi_TryGetFloorReadableNameBufferSize", "number", ["number", "string", "number", "number", "number"]);
    var _indoorsApi_TryGetFloorReadableName = cwrap("indoorsApi_TryGetFloorReadableName", "number", ["number", "string", "number", "number", "number", "number"]);
    var _indoorsApi_TryGetFloorShortNameBufferSize = cwrap("indoorsApi_TryGetFloorShortNameBufferSize", "number", ["number", "string", "number", "number", "number"]);
    var _indoorsApi_TryGetFloorShortName = cwrap("indoorsApi_TryGetFloorShortName", "number", ["number", "string", "number", "number", "number", "number"]);
    var _indoorsApi_SetBackgroundColor = cwrap("indoorsApi_SetBackgroundColor", null, ["number", "number"]);
    var _indoorsApi_HideLabelsForEntities = cwrap("indoorsApi_HideLabelsForEntities", null, ["number", "number", "number"]);
    var _indoorsApi_ShowLabelsForEntities = cwrap("indoorsApi_ShowLabelsForEntities", null, ["number", "number", "number"]);
    var _indoorsApi_ShowAllLabels = cwrap("indoorsApi_ShowAllLabels", null, ["number"]);

    var _onIndoorMapEntered = null;
    var _onIndoorMapEnterFailed = null;
    var _onIndoorMapExited = null;
    var _onIndoorMapFloorChanged = null;
    var _onIndoorMapEntryMarkerAdded = null;
    var _onIndoorMapEntryMarkerRemoved = null;
    var _onIndoorMapLoaded = null;
    var _onIndoorMapUnloaded = null;

    var _indoorMapEnteredHandler = () => {
        if (_onIndoorMapEntered !== null) {
            _onIndoorMapEntered();
        }
    };

    var _indoorMapEntryFailedHandler = () => {
        if (_onIndoorMapEnterFailed !== null) {
            _onIndoorMapEnterFailed();
        }
    };

    var _indoorMapExitedHandler = () => {
        if (_onIndoorMapExited !== null) {
            _onIndoorMapExited();
        }
    };

    var _indoorMapFloorChangedHandler = () => {
        if (_onIndoorMapFloorChanged !== null) {
            _onIndoorMapFloorChanged();
        }
    };

    var _executeEntryMarkerCallback = (callback, indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) => {
        var indoorMapId = _emscriptenMemory.stringifyPointer(indoorMapIdPtr);
        var indoorMapName = _emscriptenMemory.stringifyPointer(indoorMapNamePtr);
        var latLngArray = _emscriptenMemory.readDoubles(indoorMapLatLngPtr, 3);
        var markerLatLng = L.latLng(latLngArray);
        callback(indoorMapId, indoorMapName, markerLatLng);
    };

    var _indoorMapEntryMarkerAddedHandler = (indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) => {
        if (_onIndoorMapEntryMarkerAdded !== null) {
            _executeEntryMarkerCallback(_onIndoorMapEntryMarkerAdded, indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr);
        }
    };

    var _indoorMapEntryMarkerRemovedHandler = (indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr) => {
        if (_onIndoorMapEntryMarkerRemoved !== null) {
            _executeEntryMarkerCallback(_onIndoorMapEntryMarkerRemoved, indoorMapIdPtr, indoorMapNamePtr, indoorMapLatLngPtr);
        }
    };

    var _indoorMapLoadedHandler = (indoorMapIdPtr) => {
        if (_onIndoorMapLoaded !== null) {
            var indoorMapId = _emscriptenMemory.stringifyPointer(indoorMapIdPtr);
            _onIndoorMapLoaded(indoorMapId);
        }
    };

    var _indoorMapUnloadedHandler = (indoorMapIdPtr) => {
        if (_onIndoorMapUnloaded !== null) {
            var indoorMapId = _emscriptenMemory.stringifyPointer(indoorMapIdPtr);
            _onIndoorMapUnloaded(indoorMapId);
        }
    };

    this.onInitialized = () => {
        _indoorsApi_RegisterIndoorMapCallbacks(
            _emscriptenApiPointer,
            emscriptenModule.addFunction(_indoorMapEnteredHandler, "v"),
            emscriptenModule.addFunction(_indoorMapEntryFailedHandler, "v"),
            emscriptenModule.addFunction(_indoorMapExitedHandler, "v"),
            emscriptenModule.addFunction(_indoorMapFloorChangedHandler, "v"),
            emscriptenModule.addFunction(_indoorMapEntryMarkerAddedHandler, "viii"),
            emscriptenModule.addFunction(_indoorMapEntryMarkerRemovedHandler, "viii"),
            emscriptenModule.addFunction(_indoorMapLoadedHandler, "vi"),
            emscriptenModule.addFunction(_indoorMapUnloadedHandler, "vi")
        );
    };

    this.setNotificationCallbacks = (
        indoorMapEnteredCallback,
        indoorMapEnterFailedCallback,
        indoorMapExitedCallback,
        indoorMapFloorChangedCallback,
        indoorMapEntryMarkerAddedCallback,
        indoorMapEntryMarkerRemovedCallback,
        indoorMapLoadedCallback,
        indoorMapUnloadedCallback
    ) => {
        _onIndoorMapEntered = indoorMapEnteredCallback;
        _onIndoorMapEnterFailed = indoorMapEnterFailedCallback;
        _onIndoorMapExited = indoorMapExitedCallback;
        _onIndoorMapFloorChanged = indoorMapFloorChangedCallback;
        _onIndoorMapEntryMarkerAdded = indoorMapEntryMarkerAddedCallback;
        _onIndoorMapEntryMarkerRemoved = indoorMapEntryMarkerRemovedCallback;
        _onIndoorMapLoaded = indoorMapLoadedCallback;
        _onIndoorMapUnloaded = indoorMapUnloadedCallback;
    };

    this.enterIndoorMap = (indoorMapId) => {
        return _indoorsApi_EnterIndoorMap(_emscriptenApiPointer, indoorMapId);
    };

    this.exitIndoorMap = () => {
        _indoorsApi_ExitIndoorMap(_emscriptenApiPointer);
    };

    this.hasActiveIndoorMap = () => {
        return !!_indoorsApi_HasActiveIndoorMap(_emscriptenApiPointer);
    };

    this.getActiveIndoorMapId = () => {
        return _indoorsApi_GetActiveIndoorMapId(_emscriptenApiPointer);
    };

    this.getActiveIndoorMapName = () => {
        return _indoorsApi_GetActiveIndoorMapName(_emscriptenApiPointer);
    };

    this.getActiveIndoorMapSourceVendor = () => {
        return _indoorsApi_GetActiveIndoorMapSourceVendor(_emscriptenApiPointer);
    };

    this.getActiveIndoorMapFloorCount = () => {
        return _indoorsApi_GetActiveIndoorMapFloorCount(_emscriptenApiPointer);
    };

    this.getActiveIndoorMapUserData = () => {
        return _indoorsApi_GetActiveIndoorMapUserData(_emscriptenApiPointer);
    };

    this.getSelectedFloorIndex = () => {
        return _indoorsApi_GetSelectedFloorIndex(_emscriptenApiPointer);
    };

    this.setSelectedFloorIndex = (floorIndex) => {
        return !!_indoorsApi_SetSelectedFloorIndex(_emscriptenApiPointer, floorIndex);
    };

    this.getFloorName = (floorIndex) => {
        return _indoorsApi_GetFloorName(_emscriptenApiPointer, floorIndex);
    };

    this.getFloorShortName = (floorIndex) => {
        return _indoorsApi_GetFloorShortName(_emscriptenApiPointer, floorIndex);
    };

    this.getFloorNumber = (floorIndex) => {
        return _indoorsApi_GetFloorNumber(_emscriptenApiPointer, floorIndex);
    };

    this.getFloorHeightAboveSeaLevel = (floorIndex) => {
        return _indoorsApi_GetFloorHeightAboveSeaLevel(_emscriptenApiPointer, floorIndex);
    };

    this.tryGetReadableName = (indoorMapId) => {
        var bufferSizeBuf = _emscriptenMemory.createInt32Buffer(1);

        var success = _indoorsApi_TryGetReadableNameBufferSize(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapId.length,
            bufferSizeBuf.ptr
        );

        if (!success) {
            return null;
        }

        var bufferSize = _emscriptenMemory.consumeBufferToArray(bufferSizeBuf)[0];
        var stringBuffer = _emscriptenMemory.createInt8Buffer(bufferSize);

        success = _indoorsApi_TryGetReadableName(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapId.length,
            stringBuffer.ptr,
            bufferSize
        );

        if (!success) {
            return null;
        }

        var indoorMapReadableName = _emscriptenMemory.consumeUtf8BufferToString(stringBuffer);
        return indoorMapReadableName;
    };

    var _tryGetNativeIndoorMapFloorString = (indoorMapId, indoorMapFloorId, nativeGetBufferSizeFunc, nativeGetStringFunc) => {
        var bufferSizeBuf = _emscriptenMemory.createInt32Buffer(1);

        var success = nativeGetBufferSizeFunc(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapId.length,
            indoorMapFloorId,
            bufferSizeBuf.ptr
        );

        if (!success) {
            return null;
        }

        var bufferSize = _emscriptenMemory.consumeBufferToArray(bufferSizeBuf)[0];
        var stringBuffer = _emscriptenMemory.createInt8Buffer(bufferSize);

        success = nativeGetStringFunc(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapId.length,
            indoorMapFloorId,
            stringBuffer.ptr,
            bufferSize
        );

        if (!success) {
            return null;
        }

        var stringValue = _emscriptenMemory.consumeUtf8BufferToString(stringBuffer);
        return stringValue;
    };

    this.tryGetFloorReadableName = (indoorMapId, indoorMapFloorId) => {
        return _tryGetNativeIndoorMapFloorString(
            indoorMapId,
            indoorMapFloorId,
            _indoorsApi_TryGetFloorReadableNameBufferSize,
            _indoorsApi_TryGetFloorReadableName
        );
    };

    this.tryGetFloorShortName = (indoorMapId, indoorMapFloorId) => {
        return _tryGetNativeIndoorMapFloorString(
            indoorMapId,
            indoorMapFloorId,
            _indoorsApi_TryGetFloorShortNameBufferSize,
            _indoorsApi_TryGetFloorShortName
        );
    };

    this.setBackgroundColor = (color) => {
        var colorRGBA32 = colorToRgba32(color);
        _indoorsApi_SetBackgroundColor(_emscriptenApiPointer, colorRGBA32);
    };

    this.hideLabelsForEntities = (entityNames) => {
        _emscriptenMemory.passStrings(entityNames, (resultStrings, stringArraySize) => {
            _indoorsApi_HideLabelsForEntities(_emscriptenApiPointer, resultStrings, stringArraySize);
        });
    };

    this.showLabelsForEntities = (entityNames) => {
        _emscriptenMemory.passStrings(entityNames, (resultStrings, stringArraySize) => {
            _indoorsApi_ShowLabelsForEntities(_emscriptenApiPointer, resultStrings, stringArraySize);
        });
    };

    this.showAllLabels = () => {
        _indoorsApi_ShowAllLabels(_emscriptenApiPointer);
    };
}

export default EmscriptenIndoorsApi;
