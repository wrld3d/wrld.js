var elevationMode = require("../elevation_mode.js");

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
    var _propsApi_setIndoorMapPopulationServiceUrl = null;

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

    this.setIndoorMapPopulationServiceUrl = function(serviceUrl) {
        _propsApi_setIndoorMapPopulationServiceUrl = _propsApi_setIndoorMapPopulationServiceUrl || cwrap("propsApi_setIndoorMapPopulationServiceUrl", null, ["number", "string"]);
        _propsApi_setIndoorMapPopulationServiceUrl(_emscriptenApiPointer, serviceUrl);
    };
    };
}

module.exports = EmscriptenPropsApi;