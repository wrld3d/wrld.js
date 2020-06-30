var elevationMode = require("../elevation_mode.js");
var indoorMapEntitySetProp = require("../../public/entity_set_prop.js");

function EmscriptenPropsApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _propsApi_createProp = null;
    var _propsApi_createProps = null;
    var _propsApi_destroyProp = null;
    var _propsApi_destroyProps = null;
    var _propsApi_propExists = null;
    var _propsApi_setLocation = null;
    var _propsApi_setElevation = null;
    var _propsApi_setElevationMode = null;
    var _propsApi_setGeometryId = null;
    var _propsApi_setHeadingDegrees = null;
    var _propsApi_setAutomaticIndoorMapPopulationEnabled = null;
    var _propsApi_isAutomaticIndoorMapPopulationEnabled = null;
    var _propsApi_getIndoorMapPropCount = null;
    var _propsApi_tryGetIndoorMapPropDataBufferSizes = null;
    var _propsApi_tryGetIndoorMapPropData = null;
    var _propsApi_setIndoorMapPopulationServiceUrl = null;
    var _propsApi_setIndoorMapEntitySetPropsLoadedCallback = null;
    var _propsApi_setIndoorMapPopulationRequestCompletedCallback = null;

    var _indoorMapEntitySetPropsLoadedCallback = null;

    this.onInitialized = function() {
        this.registerIndoorMapEntitySetPropsLoadedHandler(indoorMapEntitySetPropsLoadedHandler);
    };

    this.createProp = function(indoorMapId, floorId, name, latitude, longitude, elevation, elevationModeString, headingDegrees, geometryId) {
        _propsApi_createProp = _propsApi_createProp || cwrap("propsApi_createProp", "number", ["number", "string", "number", "string", "number", "number", "number", "number", "number", "string"]);
        var elevationModeInt = elevationMode.getElevationModeInt(elevationModeString);
        var propId = _propsApi_createProp(_emscriptenApiPointer, indoorMapId, floorId, name, latitude, longitude, elevation, elevationModeInt, headingDegrees, geometryId);
        return propId;
    };

    this.createProps = function(indoorMapIdArray, floorIdArray, nameArray, latitudeArray, longitudeArray, elevationArray, elevationModeArray, headingDegreesArray, geometryIdArray) {
        var propCount = indoorMapIdArray.length;

        if (floorIdArray.length !== propCount ||
            nameArray.length !== propCount ||
            latitudeArray.length !== propCount ||
            longitudeArray.length !== propCount ||
            elevationArray.length !== propCount ||
            elevationModeArray.length !== propCount ||
            headingDegreesArray.length !== propCount ||
            geometryIdArray.length !== propCount)
        {
            throw new Error("Unequal array element counts in call to createProps.");
        }

        _propsApi_createProps = _propsApi_createProps || cwrap("propsApi_createProps", null, ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]);
        var out_propIdsBuffer = _emscriptenMemory.createInt32Buffer(propCount);

        var elevationModeIntArray = [];
        elevationModeArray.forEach(function(elevationModeString){ elevationModeIntArray.push(elevationMode.getElevationModeInt(elevationModeString)); });

        var floorIdBuffer = _emscriptenMemory.createBufferFromArray(floorIdArray, _emscriptenMemory.createInt32Buffer);
        var latitudeBuffer = _emscriptenMemory.createBufferFromArray(latitudeArray, _emscriptenMemory.createDoubleBuffer);
        var longitudeBuffer = _emscriptenMemory.createBufferFromArray(longitudeArray, _emscriptenMemory.createDoubleBuffer);
        var elevationBuffer = _emscriptenMemory.createBufferFromArray(elevationArray, _emscriptenMemory.createDoubleBuffer);
        var elevationModeBuffer = _emscriptenMemory.createBufferFromArray(elevationModeIntArray, _emscriptenMemory.createInt32Buffer);
        var headingDegreesBuffer = _emscriptenMemory.createBufferFromArray(headingDegreesArray, _emscriptenMemory.createDoubleBuffer);

        _emscriptenMemory.passStrings(indoorMapIdArray, function(indoorMapIdArrayPtr, indoorMapIdArraySize) {
            _emscriptenMemory.passStrings(nameArray, function(nameArrayPtr, nameArraySize) {
                _emscriptenMemory.passStrings(geometryIdArray, function(geometryIdArrayPtr, geometryIdArraySize) {
                    _propsApi_createProps(
                        _emscriptenApiPointer,
                        propCount,
                        indoorMapIdArrayPtr,
                        floorIdBuffer.ptr,
                        nameArrayPtr,
                        latitudeBuffer.ptr,
                        longitudeBuffer.ptr,
                        elevationBuffer.ptr,
                        elevationModeBuffer.ptr,
                        headingDegreesBuffer.ptr,
                        geometryIdArrayPtr,
                        out_propIdsBuffer.ptr
                    );
                });
            });
        });

        _emscriptenMemory.freeBuffer(headingDegreesBuffer);
        _emscriptenMemory.freeBuffer(elevationModeBuffer);
        _emscriptenMemory.freeBuffer(elevationBuffer);
        _emscriptenMemory.freeBuffer(latitudeBuffer);
        _emscriptenMemory.freeBuffer(longitudeBuffer);
        _emscriptenMemory.freeBuffer(floorIdBuffer);

        return _emscriptenMemory.consumeBufferToArray(out_propIdsBuffer);
    };

    this.destroyProp = function(propId) {
        _propsApi_destroyProp = _propsApi_destroyProp || cwrap("propsApi_destroyProp", null, ["number", "number"]);
        _propsApi_destroyProp(_emscriptenApiPointer, propId);
    };

    this.destroyProps = function(propIdArray) {
        _propsApi_destroyProps = _propsApi_destroyProps || cwrap("propsApi_destroyProps", null, ["number", "number", "number"]);

        _emscriptenMemory.passInt32s(propIdArray, function(propIdArrayPtr, propIdArraySize){
            _propsApi_destroyProps(_emscriptenApiPointer, propIdArrayPtr, propIdArraySize);
        });
    };

    this.propExists = function(propId) {
        _propsApi_propExists = _propsApi_propExists || cwrap("propsApi_propExists", "number", ["number", "number"]);
        return _propsApi_propExists(_emscriptenApiPointer, propId);
    };

    this.setLocation = function(propId, latitudeDegrees, longitudeDegrees) {
        _propsApi_setLocation = _propsApi_setLocation || cwrap("propsApi_setLocation", null, ["number", "number", "number", "number"]);
        _propsApi_setLocation(_emscriptenApiPointer, propId, latitudeDegrees, longitudeDegrees);
    };

    this.setElevation = function(propId, elevation) {
        _propsApi_setElevation = _propsApi_setElevation || cwrap("propsApi_setElevation", null, ["number", "number", "number"]);
        _propsApi_setElevation(_emscriptenApiPointer, propId, elevation);
    };

    this.setElevationMode = function(propId, elevationModeString) {
        _propsApi_setElevationMode = _propsApi_setElevationMode || cwrap("propsApi_setElevationMode", null, ["number", "number", "number"]);
        var elevationModeInt = elevationMode.getElevationModeInt(elevationModeString);
        _propsApi_setElevationMode(_emscriptenApiPointer, propId, elevationModeInt);
    };

    this.setGeometryId = function(propId, geometryId) {
        _propsApi_setGeometryId = _propsApi_setGeometryId || cwrap("propsApi_setGeometryId", null, ["number", "number", "string"]);
        _propsApi_setGeometryId(_emscriptenApiPointer, propId, geometryId);
    };

    this.setHeadingDegrees = function(propId, headingDegrees) {
        _propsApi_setHeadingDegrees = _propsApi_setHeadingDegrees || cwrap("propsApi_setHeadingDegrees", null, ["number", "number", "number", "number"]);
        _propsApi_setHeadingDegrees(_emscriptenApiPointer, propId, headingDegrees);
    };

    this.setAutomaticIndoorMapPopulationEnabled = function(enabled) {
        _propsApi_setAutomaticIndoorMapPopulationEnabled = _propsApi_setAutomaticIndoorMapPopulationEnabled || cwrap("propsApi_setAutomaticIndoorMapPopulationEnabled", null, ["number", "number"]);
        _propsApi_setAutomaticIndoorMapPopulationEnabled(_emscriptenApiPointer, enabled);
    };

    this.isAutomaticIndoorMapPopulationEnabled = function() {
        _propsApi_isAutomaticIndoorMapPopulationEnabled = _propsApi_isAutomaticIndoorMapPopulationEnabled || cwrap("propsApi_isAutomaticIndoorMapPopulationEnabled", "number", ["number"]);
        return _propsApi_isAutomaticIndoorMapPopulationEnabled(_emscriptenApiPointer);
    };

    this.tryGetIndoorMapEntitySetProps = function(indoorMapId, floorId) {
        _propsApi_getIndoorMapPropCount = _propsApi_getIndoorMapPropCount || cwrap("propsApi_getIndoorMapPropCount", "number", ["number", "string", "number"]);
        var propCount = _propsApi_getIndoorMapPropCount(_emscriptenApiPointer, indoorMapId, floorId);

        var indoorMapPerPropNameSizesBuf = _emscriptenMemory.createInt32Buffer(propCount);
        var indoorMapPerPropModelSizesBuf = _emscriptenMemory.createInt32Buffer(propCount);
        var indoorMapPropBufferSizesBuf = _emscriptenMemory.createInt32Buffer(2);

        _propsApi_tryGetIndoorMapPropDataBufferSizes = _propsApi_tryGetIndoorMapPropDataBufferSizes || cwrap("propsApi_tryGetIndoorMapPropDataBufferSizes", "number", ["number", "string", "number", "number", "number", "number", "number"]);

        var success = _propsApi_tryGetIndoorMapPropDataBufferSizes(
                        _emscriptenApiPointer,
                        indoorMapId, 
                        floorId,
                        propCount,
                        indoorMapPerPropNameSizesBuf.ptr,
                        indoorMapPerPropModelSizesBuf.ptr,
                        indoorMapPropBufferSizesBuf.ptr);

        if (!success) {
            return null;
        }

        var indoorMapPerPropNameSizes = _emscriptenMemory.consumeBufferToArray(indoorMapPerPropNameSizesBuf);
        var indoorMapPerPropModelSizes = _emscriptenMemory.consumeBufferToArray(indoorMapPerPropModelSizesBuf);
        var indoorMapPropBufferSizes = _emscriptenMemory.consumeBufferToArray(indoorMapPropBufferSizesBuf);

        var indoorMapPropNameTotalSize = indoorMapPropBufferSizes[0];
        var indoorMapPropModelTotalSize = indoorMapPropBufferSizes[1];

        var indoorMapPropStringNamesBuf = _emscriptenMemory.createInt8Buffer(indoorMapPropNameTotalSize);
        var indoorMapPropStringModelsBuf = _emscriptenMemory.createInt8Buffer(indoorMapPropModelTotalSize);
        var indoorMapPropLatLngBuf = _emscriptenMemory.createDoubleBuffer(propCount * 2);
        var indoorMapPropHeightBuf = _emscriptenMemory.createDoubleBuffer(propCount);
        var indoorMapPropOrientationBuf = _emscriptenMemory.createDoubleBuffer(propCount);

        _propsApi_tryGetIndoorMapPropData = _propsApi_tryGetIndoorMapPropData || cwrap("propsApi_tryGetIndoorMapPropData", "number", ["number", "string", "number", "number", "number", "number", "number", "number", "number"]);

        success = _propsApi_tryGetIndoorMapPropData(
            _emscriptenApiPointer,
            indoorMapId, 
            floorId,
            propCount,
            indoorMapPropStringNamesBuf.ptr,
            indoorMapPropStringModelsBuf.ptr,
            indoorMapPropLatLngBuf.ptr,
            indoorMapPropHeightBuf.ptr,
            indoorMapPropOrientationBuf.ptr
        );

        if (!success) {
            return null;
        }

        var indoorMapPropStringNames = _emscriptenMemory.consumeUtf8BufferToString(indoorMapPropStringNamesBuf);
        var indoorMapPropStringModels = _emscriptenMemory.consumeUtf8BufferToString(indoorMapPropStringModelsBuf);
        var indoorMapPropLatLngs = _emscriptenMemory.consumeBufferToArray(indoorMapPropLatLngBuf);
        var indoorMapPropHeights = _emscriptenMemory.consumeBufferToArray(indoorMapPropHeightBuf);
        var indoorMapPropOrientation = _emscriptenMemory.consumeBufferToArray(indoorMapPropOrientationBuf);

        var indoorMapEntityPropList = [];

        var nameBufferHead = 0;
        var modelBufferHead = 0;
        for (var i = 0; i < propCount; i++) {
            var numCharsInName = indoorMapPerPropNameSizes[i];
            var nameBufferEnd = nameBufferHead + numCharsInName;
            var name = indoorMapPropStringNames.slice(nameBufferHead, nameBufferEnd);
            nameBufferHead = nameBufferEnd;

            var numCharsInModel = indoorMapPerPropModelSizes[i];
            var modelBufferEnd = modelBufferHead + numCharsInModel;
            var model = indoorMapPropStringModels.slice(modelBufferHead, modelBufferEnd);
            modelBufferHead = modelBufferEnd;

            var posLat = indoorMapPropLatLngs[2*i];
            var posLng = indoorMapPropLatLngs[2*i + 1];
            var position = L.latLng(posLat, posLng);

            var height = indoorMapPropHeights[i];
            var orientation = indoorMapPropOrientation[i];

            var prop = new indoorMapEntitySetProp.IndoorMapEntitySetProp(indoorMapId, floorId, name, model, position, height, elevationMode.ElevationModeType.HEIGHT_ABOVE_GROUND, orientation);
            indoorMapEntityPropList.push(prop);
        }

        return indoorMapEntityPropList;
    };

    this.setIndoorMapPopulationServiceUrl = function(serviceUrl) {
        _propsApi_setIndoorMapPopulationServiceUrl = _propsApi_setIndoorMapPopulationServiceUrl || cwrap("propsApi_setIndoorMapPopulationServiceUrl", null, ["number", "string"]);
        _propsApi_setIndoorMapPopulationServiceUrl(_emscriptenApiPointer, serviceUrl);
    };

    var indoorMapEntitySetPropsLoadedHandler = function(indoorMapIdPtr, floorId) {
        if (_indoorMapEntitySetPropsLoadedCallback !== null) {
            var indoorMapId = _emscriptenMemory.stringifyPointer(indoorMapIdPtr);
            _indoorMapEntitySetPropsLoadedCallback(indoorMapId, floorId);
        }
    };

    this.setIndoorMapEntitySetPropsLoadedCallback = function(callback) {
        _indoorMapEntitySetPropsLoadedCallback = callback;
    };

    this.registerIndoorMapEntitySetPropsLoadedHandler = function(callback) {
        _propsApi_setIndoorMapEntitySetPropsLoadedCallback = _propsApi_setIndoorMapEntitySetPropsLoadedCallback || cwrap("propsApi_setIndoorMapEntitySetPropsLoadedCallback", null, ["number", "number"]);
        _propsApi_setIndoorMapEntitySetPropsLoadedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback));
    };

    this.setIndoorMapPopulationRequestCompletedCallback = function(callback) {
        _propsApi_setIndoorMapPopulationRequestCompletedCallback = _propsApi_setIndoorMapPopulationRequestCompletedCallback || cwrap("propsApi_setIndoorMapPopulationRequestCompletedCallback", null, ["number", "number", "number"]);
        _propsApi_setIndoorMapPopulationRequestCompletedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback));
    };
}

module.exports = EmscriptenPropsApi;