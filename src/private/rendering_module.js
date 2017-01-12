var MapModule = require("./map_module");

var RenderingModule = function(emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    
    this.createShaderPair = function(vertexCode, fragmentCode, uniforms, samplers) {
        _emscriptenApi.renderingApi.createShaderPair(vertexCode, fragmentCode, uniforms, samplers);
    }
};

RenderingModule.prototype = MapModule;
module.exports = RenderingModule;
