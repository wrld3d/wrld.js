function EmscriptenPropsApi(eegeoApiPointer, cwrap, runtime) {

    var _eegeoApiPointer = eegeoApiPointer;

    var _createProp = null;
    var _destroyProp = null;
    var _propExists = null;
    var _setLocation = null;
    var _setHeightOffset = null;
    var _setGeometryId = null;
    var _setHeadingDegrees = null;

    this.createProp = function(indoorMapId, floorId, name, latitude, longitude, heightOffset, headingDegrees, geometryId) {
    	_createProp = _createProp || cwrap("createProp", "number", ["number", "string", "number", "string", "number", "number", "number", "number", "string"]);
        var propId = _createProp(_eegeoApiPointer, indoorMapId, floorId, name, latitude, longitude, heightOffset, headingDegrees, geometryId);
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

    this.setHeightOffset = function(propId, heightOffset) {
        _setHeightOffset = _setHeightOffset || cwrap("setHeightOffset", null, ["number", "number", "number"]);
        _setHeightOffset(_eegeoApiPointer, propId, heightOffset);
    };

    this.setGeometryId = function(propId, geometryId) {
        _setGeometryId = _setGeometryId || cwrap("setGeometryId", null, ["number", "number", "string"]);
        _setGeometryId(_eegeoApiPointer, propId, geometryId);
    };

    this.setHeadingDegrees = function(propId, headingDegrees) {
        _setHeadingDegrees = _setHeadingDegrees || cwrap("setHeadingDegrees", null, ["number", "number", "number", "number"]);
        _setHeadingDegrees(_eegeoApiPointer, propId, headingDegrees);
    };
}

module.exports = EmscriptenPropsApi;