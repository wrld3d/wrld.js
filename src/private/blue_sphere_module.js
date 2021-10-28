import L from "leaflet";
import MapModule from "./map_module";

export function BlueSphereModule(emscriptenApi) {

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

    this.isEnabled = () => _isEnabled;

    this.setEnabled = (isEnabled) => {
        _isEnabled = isEnabled ? true : false;
    };

    this.getLocation = () => _location;

    this.setLocation = (location) => {
        _location = L.latLng(location);
        _stateChanged = true;
    };

    this.getIndoorMapId = () => _indoorMapId;

    this.getIndoorMapFloorId = () => _indoorMapFloorId;

    this.setIndoorMap = (indoorMapId, indoorMapFloorId) => {
        _indoorMapId = indoorMapId;
        _indoorMapFloorId = indoorMapFloorId;
    };

    this.setOutdoor = () => {
        this.setIndoorMap("", 0);
    };

    this.isOrientationVisible = () => _showOrientation;

    this.getHeadingDegrees = () => _headingDegrees;

    this.setHeadingDegrees = (headingDegrees) => {
        _headingDegrees = headingDegrees;
        _stateChanged = true;
    };

    this.getElevation = () => _elevation;

    this.setElevation = (elevation) => {
        _elevation = elevation;
        _stateChanged = true;
    };

    this.showOrientation = (isVisible) => {
        _showOrientation = isVisible;
        _stateChanged = true;
    };

    this.onInitialized = () => {
        _ready = true;
        _emscriptenApi.blueSphereApi.updateNativeState(this);
    };

    this.onUpdate = () => {
        if (_ready && _stateChanged) {
            _emscriptenApi.blueSphereApi.updateNativeState(this);
            _stateChanged = false;
        }
    };

}

BlueSphereModule.prototype = MapModule;

export default BlueSphereModule;
