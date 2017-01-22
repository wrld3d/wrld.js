var MapModule = require("./map_module");


function RenderingModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _ready = false;

    this.onInitialized = function() {
        _ready = true;
    };

    this.ready = function() {
        return _ready;
    };

    this.getRenderPosition = function(latLng) {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getRenderPosition(latLng);
    };

    this.getRenderOrientation = function(latLng) {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getRenderOrientation(latLng);
    };

    this.getCameraProjection = function() {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getCameraProjection();
    };

    this.getCameraOrientation = function() {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getCameraOrientation();
    };

    this.getLightingData = function() {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getLightingData();
    };

}
RenderingModule.prototype = MapModule;

module.exports = RenderingModule;
