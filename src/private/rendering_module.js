var MapModule = require("./map_module");


function RenderingModule(emscriptenApi, clearColor) {

    var _emscriptenApi = emscriptenApi;
    var _isMapCollapsed = false;
    var _clearColor = clearColor;
    var _ready = false;

    this.onInitialized = function() {
        _emscriptenApi.renderingApi.setClearColor(_clearColor);
        _emscriptenApi.renderingApi.setMapCollapsed(_isMapCollapsed);
        _ready = true;
    };

    this.ready = function() {
        return _ready;
    };

    this.setMapCollapsed = function(isMapCollapsed) {
        _isMapCollapsed = isMapCollapsed;
        if (!_ready) {
            return;
        }
        _emscriptenApi.renderingApi.setMapCollapsed(_isMapCollapsed);
    };

    this.isMapCollapsed = function(isMapCollapsed) {
        return _isMapCollapsed;
    },

    this.setClearColor = function(clearColor) {
        _clearColor = clearColor;
        if (!_ready) {
            return;
        }
        _emscriptenApi.renderingApi.setClearColor(_clearColor);
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
