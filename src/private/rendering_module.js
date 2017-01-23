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

    this.getCameraRelativePosition = function(latLng) {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getCameraRelativePosition(latLng);
    };

    this.getNorthFacingOrientationMatrix = function(latLng) {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getNorthFacingOrientationMatrix(latLng);
    };

    this.getCameraProjectionMatrix = function() {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getCameraProjectionMatrix();
    };

    this.getCameraOrientationMatrix = function() {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.renderingApi.getCameraOrientationMatrix();
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
