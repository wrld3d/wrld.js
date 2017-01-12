var emscriptenMemory = require("./emscripten_memory");

function EmscriptenRenderingApi(apiPointer, cwrap, runtime) {
    var _apiPointer = apiPointer;
    var _createShaderPairInterop = null; 

    var _createShaderPair = function(vertexCode, fragmentCode, uniforms, samplers) {
        _createShaderPairInterop = _createShaderPairInterop || cwrap("CreateShaderPair", null, ["number", "number", "number", "number", "number", "number", "number", "number"]);

        var mess = function(text) {
            console.log(text);
        }

        var callback = runtime.addFunction(mess);
        
        emscriptenMemory.passStrings(uniforms, function (uniformsList, numUniforms) {
            emscriptenMemory.passStrings(samplers, function (samplerList, numSamplers) {
                emscriptenMemory.passString(vertexCode, function(vertex){
                    emscriptenMemory.passString(fragmentCode, function (fragment) {
                        _createShaderPairInterop(_apiPointer, vertex, fragment, uniformsList, numUniforms, samplerList, numSamplers, callback);
                    });
                });
            });
        });

        runtime.removeFunction(callback);
        
        return _createShaderPairInterop(_apiPointer);
    };

    this.createShaderPair = function(vertexCode, fragmentCode, uniforms, samplers) {
        return _createShaderPair(vertexCode, fragmentCode, uniforms, samplers);
    }
}

module.exports = EmscriptenRenderingApi;