var MapModule = require("./map_module");

function BlueSphereModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _ready = false;
    var _location = null;
    var _isEnabled = false;
    var _indoorMapId = "";
    var _indoorMapFloorId = 0;
    var _headingDegrees = 0.0;
    var _elevation = 0.0;
    var _stateChanged = false;
    var _showOrientation = true;

    this.isEnabled = function() {
        return _isEnabled;
    };

    this.setEnabled = function(isEnabled) {
        _isEnabled = isEnabled ? true : false;
    };

    this.getLocation = function() {
        return _location;
    };

    this.setLocation = function (location) {
        _location = L.latLng(location);
        _stateChanged = true;
    };

    this.getIndoorMapId = function () {
        return _indoorMapId;
    };

    this.getIndoorMapFloorId = function () {
        return _indoorMapFloorId;
    };

    this.setIndoorMap = function (indoorMapId, indoorMapFloorId) {
        _indoorMapId = indoorMapId;
        _indoorMapFloorId = indoorMapFloorId;
    };

    this.isOrientationVisible = function () {
        return _showOrientation;
    };

    this.getHeadingDegrees = function () {
        return _headingDegrees;
    };

    this.setHeadingDegrees = function (headingDegrees) {
        _headingDegrees = headingDegrees;
        _stateChanged = true;
    };

    this.getElevation = function () {
        return _elevation;
    };

    this.setElevation = function (elevation) {
        _elevation = elevation;
        _stateChanged = true;
    };

    this.showOrientation = function (isVisible) {
        _showOrientation = isVisible;
        _stateChanged = true;
    };

    this.onInitialized = function() {
        _ready = true;
        _emscriptenApi.blueSphereApi.updateNativeState(this);
    };

    this.onUpdate = function() {
        if (_ready && _stateChanged) {
            _emscriptenApi.blueSphereApi.updateNativeState(this);
            _stateChanged = false;
        }
    };

}
BlueSphereModule.prototype = MapModule;

module.exports = BlueSphereModule;
