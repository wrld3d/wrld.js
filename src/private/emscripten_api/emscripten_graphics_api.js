var emscriptenMemory = require("./emscripten_memory");
var space = require("../../public/space");

function EmscriptenGraphicsApi(apiPointer, cwrap, runtime) {
    var _apiPointer = apiPointer;
    
    var _setPreDrawFunc = null;
    var _preDrawFunc = null;

    var _setPostDrawFunc = null;
    var _postDrawFunc = null;

    var _getCameraParameters = null;
    var _getRenderPosition = null;
    var _getCameraProjection = null;
    var _getCameraOrientation = null;
    var _getBaseOrientation = null;
    var _getLightingData = null;

    this.setPreDrawFunc = function(preDrawFunc) {
        _setPreDrawFunc = _setPreDrawFunc || cwrap("setPreDrawFunc", null, ["number"]);
        if (_preDrawFunc !== null) {
            runtime.removeFunction(_preDrawFunc);
        }
        _preDrawFunc = runtime.addFunction(preDrawFunc);
        _setPreDrawFunc(_preDrawFunc);
    };

    this.setPostDrawFunc = function(postDrawFunc) {
        _setPostDrawFunc = _setPostDrawFunc || cwrap("setPostDrawFunc", null, ["number"]);
        if (_postDrawFunc !== null) {
            runtime.removeFunction(_postDrawFunc);
        }
        _postDrawFunc = runtime.addFunction(postDrawFunc);
        _setPostDrawFunc(_postDrawFunc);
    };

    this.getCameraParameters = function() {
        _getCameraParameters = _getCameraParameters || cwrap("getCameraParameters", null, ["number", "number"]);
        var camProperties = [0, 0, 0, 0];
        emscriptenMemory.passDoubles(camProperties, function(resultArray, arraySize) {
            _getCameraParameters(_apiPointer, resultArray);
            camProperties = emscriptenMemory.readDoubles(resultArray, 4);
        });
        let [fov, aspect, near, far] = camProperties;
        return {
            fov: fov,
            aspect: aspect,
            near: near,
            far: far
        }
    };

    this.getRenderPosition = function(latLng) {
        _getRenderPosition = _getRenderPosition || cwrap("getRenderPosition", null, ["number", "number", "number", "number", "number"]);
        var renderPosition = [0, 0, 0];
        emscriptenMemory.passDoubles(renderPosition, function(resultArray, arraySize) {
            _getRenderPosition(_apiPointer, latLng.lat, latLng.lng, latLng.alt || 0.0, resultArray);
            renderPosition = emscriptenMemory.readDoubles(resultArray, 3);
        });
        return new space.Vector3(renderPosition);
    };

    this.getCameraProjection = function() {
        _getCameraProjection = _getCameraProjection || cwrap("getCameraProjection", null, ["number", "number"]);
        var parameters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        emscriptenMemory.passDoubles(parameters, function(resultArray, arraySize) {
            _getCameraProjection(_apiPointer, resultArray);
            parameters = emscriptenMemory.readDoubles(resultArray, 16);
        });
        return parameters;
    };

    this.getCameraOrientation = function() {
        _getCameraOrientation = _getCameraOrientation || cwrap("getCameraOrientation", null, ["number", "number"]);
        var orientation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        emscriptenMemory.passDoubles(orientation, function(resultArray, arraySize) {
            _getCameraOrientation(_apiPointer, resultArray);
            orientation = emscriptenMemory.readDoubles(resultArray, 16);
        });
        return orientation;
    };

    this.getBaseOrientation = function(latLng) {
        _getBaseOrientation = _getBaseOrientation || cwrap("getBaseOrientation", null, ["number", "number", "number", "number"]);
        var orientation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        emscriptenMemory.passDoubles(orientation, function(resultArray, arraySize) {
            _getBaseOrientation(_apiPointer, latLng.lat, latLng.lng, resultArray);
            orientation = emscriptenMemory.readDoubles(resultArray, 16);
        });
        return orientation;
    };

    this.getLightingData = function() {
        _getLightingData = _getLightingData || cwrap("getLightingData", null, ["number", "number"]);
        var lightingData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        emscriptenMemory.passDoubles(lightingData, function (resultArray, arraySize) {
            _getLightingData(_apiPointer, resultArray);
            lightingData = emscriptenMemory.readDoubles(resultArray, 21);
        });

        var lighting = {
            key: {
                direction: new space.Vector3(lightingData[0], lightingData[1], lightingData[2]),
                color: new space.Vector3(lightingData[9], lightingData[10], lightingData[11])
            },
            back: {
                direction: new space.Vector3(lightingData[3], lightingData[4], lightingData[5]),
                color: new space.Vector3(lightingData[12], lightingData[13], lightingData[14])
            },
            fill: {
                direction: new space.Vector3(lightingData[6], lightingData[7], lightingData[8]),
                color: new space.Vector3(lightingData[15], lightingData[16], lightingData[17])
            },
            ambient: {
                color: new space.Vector3(lightingData[18], lightingData[19], lightingData[20])
            }
        }
        return lighting;
    }
}

module.exports = EmscriptenGraphicsApi;