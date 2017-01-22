var emscriptenMemory = require("./emscripten_memory");
var space = require("../../public/space");

function EmscriptenRenderingApi(apiPointer, cwrap, runtime) {
    var _apiPointer = apiPointer;

    var _getRenderOrientation = null;
    var _getRenderPosition = null;
    var _getCameraProjection = null;
    var _getCameraOrientation = null;
    var _getLightingData = null;


    this.getRenderPosition = function(latLng) {
        _getRenderPosition = _getRenderPosition || cwrap("getRenderPosition", null, ["number", "number", "number", "number", "number"]);
        var renderPosition = [0, 0, 0];
        emscriptenMemory.passDoubles(renderPosition, function(resultArray, arraySize) {
            _getRenderPosition(_apiPointer, latLng.lat, latLng.lng, latLng.alt || 0.0, resultArray);
            renderPosition = emscriptenMemory.readDoubles(resultArray, 3);
        });
        return new space.Vector3(renderPosition);
    };

    this.getRenderOrientation = function(latLng) {
        _getRenderOrientation = _getRenderOrientation || cwrap("getRenderOrientation", null, ["number", "number", "number", "number"]);
        var orientation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        emscriptenMemory.passDoubles(orientation, function(resultArray, arraySize) {
            _getRenderOrientation(_apiPointer, latLng.lat, latLng.lng, resultArray);
            orientation = emscriptenMemory.readDoubles(resultArray, 16);
        });
        return orientation;
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

module.exports = EmscriptenRenderingApi;