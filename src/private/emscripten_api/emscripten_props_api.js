var elevationMode = require("../elevation_mode.js");

function EmscriptenPropsApi(eegeoApiPointer, cwrap, runtime) {

    var _eegeoApiPointer = eegeoApiPointer;

    var _createProp = null;
    var _destroyProp = null;
    var _propExists = null;
    var _setLocation = null;
    var _setElevation = null;
    var _setElevationMode = null;
    var _setGeometryId = null;
    var _setHeadingDegrees = null;
    var _setAutomaticIndoorMapPopulationEnabled = null;
    var _isAutomaticIndoorMapPopulationEnabled = null;

    this.createProp = function(indoorMapId, floorId, name, latitude, longitude, elevation, elevationModeString, headingDegrees, geometryId) {
        _createProp = _createProp || cwrap("createProp", "number", ["number", "string", "number", "string", "number", "number", "number", "number", "number", "string"]);
        var elevationModeInt = elevationMode.getElevationModeInt(elevationModeString);
        var propId = _createProp(_eegeoApiPointer, indoorMapId, floorId, name, latitude, longitude, elevation, elevationModeInt, headingDegrees, geometryId);
        return propId;
    };

    this.destroyProp = function(propId) {
        _destroyProp = _destroyProp || cwrap("destroyProp", null, ["number", "number"]);
        _destroyProp(_eegeoApiPointer, propId);
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
}

module.exports = EmscriptenPropsApi;