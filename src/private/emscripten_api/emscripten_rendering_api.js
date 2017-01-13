var emscriptenMemory = require("./emscripten_memory");

function EmscriptenRenderingApi(apiPointer, cwrap, runtime) {
    var _apiPointer = apiPointer;
    var _createShaderPairInterop = null; 
    var _applyShadersToBuildingsInterop = null;
    var _applyShadersToTerrainInterop = null;
    var _applyShadersToTransportInterop = null;

    var _createShaderPair = function(vertexCode, fragmentCode, uniforms, samplers) {
        _createShaderPairInterop = _createShaderPairInterop || cwrap("CreateShaderPair", "number", ["number", "number", "number", "number", "number", "number", "number", "number"]);

        function mess(text) {
            var str = emscriptenMemory.readString(text);

            if (str.length > 0)
              document.getElementById("shader-status").innerHTML = str;
        }

        if (uniforms)
            uniforms = uniforms.split(" ");
        else
            uniforms = [];

        if (samplers)
            samplers = samplers.split(" ");
        else
            samplers = [];

        var callback = runtime.addFunction(mess);

        var compileStatus = null;
        
        emscriptenMemory.passStrings(uniforms, function (uniformsList, numUniforms) {
            emscriptenMemory.passStrings(samplers, function (samplerList, numSamplers) {
                emscriptenMemory.passString(vertexCode, function(vertex){
                    emscriptenMemory.passString(fragmentCode, function (fragment) {
                        var handle = _createShaderPairInterop(_apiPointer, vertex, fragment, uniformsList, numUniforms, samplerList, numSamplers, callback);
                        if (handle < 0)
                            compileStatus = false;
                        else
                            compileStatus = true;
                    });
                });
            });
        });

        var shaderStatus = document.getElementById("shader-status");

        if (compileStatus)
        {
          shaderStatus.className  = "bg-success";
          shaderStatus.innerHTML = "Compile Success!"
        }
        else
          shaderStatus.className  = "bg-danger";

        runtime.removeFunction(callback);
        
        //return _createShaderPairInterop(_apiPointer);
    };

    this.createShaderPair = function(vertexCode, fragmentCode, uniforms, samplers) {
        return _createShaderPair(vertexCode, fragmentCode, uniforms, samplers);
    }

    var _applyShadersToBuildings = function() {
      _applyShadersToBuildingsInterop = _applyShadersToBuildingsInterop  || cwrap("ApplyShadersToBuildings", null, ["number"]);
      _applyShadersToBuildingsInterop(_apiPointer);
    }

    this.applyShadersToBuildings = function () {
      return _applyShadersToBuildings();
    }

    var _applyShadersToTerrain = function() {
      _applyShadersToTerrainInterop = _applyShadersToTerrainInterop  || cwrap("ApplyShadersToTerrain", null, ["number"]);
      _applyShadersToTerrainInterop(_apiPointer);
    }

    this.applyShadersToTerrain = function () {
      return _applyShadersToTerrain();
    }

     var _applyShadersToTransport = function() {
      _applyShadersToTransportInterop = _applyShadersToTransportInterop  || cwrap("ApplyShadersToTransport", null, ["number"]);
      _applyShadersToTransportInterop(_apiPointer);
    }

    this.applyShadersToTransport = function () {
      return _applyShadersToTransport();
    }
}

module.exports = EmscriptenRenderingApi;