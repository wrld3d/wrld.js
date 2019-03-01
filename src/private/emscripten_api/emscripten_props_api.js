var elevationMode = require("../elevation_mode.js");

function EmscriptenPropsApi(eegeoApiPointer, cwrap, runtime, emscriptenMemory) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _createProp = null;
    var _createProps = null;
    var _destroyProp = null;
    var _destroyProps = null;
    var _propExists = null;
    var _setLocation = null;
    var _setElevation = null;
    var _setElevationMode = null;
    var _setGeometryId = null;
    var _setHeadingDegrees = null;
    var _setAutomaticIndoorMapPopulationEnabled = null;
    var _isAutomaticIndoorMapPopulationEnabled = null;
    var _setIndoorMapPopulationServiceUrl = null;

    this.createProp = function(indoorMapId, floorId, name, latitude, longitude, elevation, elevationModeString, headingDegrees, geometryId) {
        _createProp = _createProp || cwrap("createProp", "number", ["number", "string", "number", "string", "number", "number", "number", "number", "number", "string"]);
        var elevationModeInt = elevationMode.getElevationModeInt(elevationModeString);
        var propId = _createProp(_eegeoApiPointer, indoorMapId, floorId, name, latitude, longitude, elevation, elevationModeInt, headingDegrees, geometryId);
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

        _createProps = _createProps || cwrap("createProps", null, ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]);
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
                    _createProps(
                        _eegeoApiPointer,
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
                        out_propIdsBuffer.ptr);
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
        _destroyProp = _destroyProp || cwrap("destroyProp", null, ["number", "number"]);
        _destroyProp(_eegeoApiPointer, propId);
    };

    this.destroyProps = function(propIdArray) {
        _destroyProps = _destroyProps || cwrap("destroyProps", null, ["number", "number", "number"]);

        _emscriptenMemory.passInt32s(propIdArray, function(propIdArrayPtr, propIdArraySize){
            _destroyProps(_eegeoApiPointer, propIdArrayPtr, propIdArraySize);
        });
    };

    this.propExists = function(propId) {
        _propExists = _propExists || cwrap("propExists", "number", ["number", "number"]);
        return _propExists(_eegeoApiPointer, propId);
    };

    this.setLocation = function(propId, latitudeDegrees, longitudeDegrees) {
        _setLocation = _setLocation || cwrap("setLocation", null, ["number", "number", "number", "number"]);
        _setLocation(_eegeoApiPointer, propId, latitudeDegrees, longitudeDegrees);
    };

    this.setElevation = function(propId, elevation) {
        _setElevation = _setElevation || cwrap("setElevation", null, ["number", "number", "number"]);
        _setElevation(_eegeoApiPointer, propId, elevation);
    };

    this.setElevationMode = function(propId, elevationModeString) {
        _setElevationMode = _setElevationMode || cwrap("setElevationMode", null, ["number", "number", "number"]);
        var elevationModeInt = elevationMode.getElevationModeInt(elevationModeString);
        _setElevationMode(_eegeoApiPointer, propId, elevationModeInt);
    };

    this.setGeometryId = function(propId, geometryId) {
        _setGeometryId = _setGeometryId || cwrap("setGeometryId", null, ["number", "number", "string"]);
        _setGeometryId(_eegeoApiPointer, propId, geometryId);
    };

    this.setHeadingDegrees = function(propId, headingDegrees) {
        _setHeadingDegrees = _setHeadingDegrees || cwrap("setHeadingDegrees", null, ["number", "number", "number", "number"]);
        _setHeadingDegrees(_eegeoApiPointer, propId, headingDegrees);
    };

    this.setAutomaticIndoorMapPopulationEnabled = function(enabled) {
        _setAutomaticIndoorMapPopulationEnabled = _setAutomaticIndoorMapPopulationEnabled || cwrap("setAutomaticIndoorMapPopulationEnabled", null, ["number", "number"]);
        _setAutomaticIndoorMapPopulationEnabled(_eegeoApiPointer, enabled);
    };

    this.isAutomaticIndoorMapPopulationEnabled = function() {
        _isAutomaticIndoorMapPopulationEnabled = _isAutomaticIndoorMapPopulationEnabled || cwrap("isAutomaticIndoorMapPopulationEnabled", "number", ["number"]);
        return _isAutomaticIndoorMapPopulationEnabled(_eegeoApiPointer);
    };

    this.setIndoorMapPopulationServiceUrl = function(serviceUrl) {
        _setIndoorMapPopulationServiceUrl = _setIndoorMapPopulationServiceUrl || cwrap("setIndoorMapPopulationServiceUrl", null, ["number", "string"]);
        _setIndoorMapPopulationServiceUrl(_eegeoApiPointer, serviceUrl);
    };
}

module.exports = EmscriptenPropsApi;