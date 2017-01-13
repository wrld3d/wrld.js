var MapModule = require("./map_module");

var RenderingModule = function(emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    
    this.createShaderPair = function(vertexCode, fragmentCode, uniforms, samplers) {
        _emscriptenApi.renderingApi.createShaderPair(vertexCode, fragmentCode, uniforms, samplers);
    }

    this.applyShadersToBuildings = function() {
        _emscriptenApi.renderingApi.applyShadersToBuildings();
    }

    this.applyShadersToTerrain = function() {
        _emscriptenApi.renderingApi.applyShadersToTerrain();
    }

    this.applyShadersToTransport = function() {
        _emscriptenApi.renderingApi.applyShadersToTransport();
    }
};

RenderingModule.prototype = MapModule;
module.exports = RenderingModule;
