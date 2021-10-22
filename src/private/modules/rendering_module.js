import MapModule from "./map_module";

export function RenderingModule(emscriptenApi, clearColor) {

    var _emscriptenApi = emscriptenApi;
    var _isMapCollapsed = false;
    var _clearColor = clearColor;
    var _ready = false;

    this.onInitialized = () => {
        _emscriptenApi.renderingApi.setClearColor(_clearColor);
        _emscriptenApi.renderingApi.setMapCollapsed(_isMapCollapsed);
        _ready = true;
    };

    this.ready = () => _ready;

    this.setMapCollapsed = (isMapCollapsed) => {
        _isMapCollapsed = isMapCollapsed;
        if (!_ready) {
            return;
        }
        _emscriptenApi.renderingApi.setMapCollapsed(_isMapCollapsed);
    };

    this.isMapCollapsed = () => _isMapCollapsed,

    this.setClearColor = (clearColor) => {
        _clearColor = clearColor;
        if (!_ready) {
            return;
        }
        _emscriptenApi.renderingApi.setClearColor(_clearColor);
    };

    this.getCameraRelativePosition = (latLng) => {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getCameraRelativePosition(latLng);
    };

    this.getNorthFacingOrientationMatrix = (latLng) => {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getNorthFacingOrientationMatrix(latLng);
    };

    this.getCameraProjectionMatrix = () => {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getCameraProjectionMatrix();
    };

    this.getCameraOrientationMatrix = () => {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getCameraOrientationMatrix();
    };

    this.getLightingData = () => {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getLightingData();
    };
}

RenderingModule.prototype = MapModule;

export default RenderingModule;
