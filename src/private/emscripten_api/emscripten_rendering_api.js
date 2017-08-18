var space = require("../../public/space");

function EmscriptenRenderingApi(eegeoApiPointer, cwrap, runtime, emscriptenMemory) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _getNorthFacingOrientationMatrix = null;
    var _getCameraRelativePosition = null;
    var _getCameraProjectionMatrix = null;
    var _getCameraOrientationMatrix = null;
    var _getLightingData = null;


    this.getCameraRelativePosition = function(latLng) {
        _getCameraRelativePosition = _getCameraRelativePosition || cwrap("getCameraRelativePosition", null, ["number", "number", "number", "number", "number", "number"]);
        var renderPosition = new Array(3);
        _emscriptenMemory.passDoubles(renderPosition, function(resultArray, arraySize) {
            _getCameraRelativePosition(_eegeoApiPointer, latLng.lat, latLng.lng, latLng.alt || 0.0, arraySize, resultArray);
            renderPosition = _emscriptenMemory.readDoubles(resultArray, arraySize);
        });
        return new space.Vector3(renderPosition);
    };

    this.getNorthFacingOrientationMatrix = function(latLng) {
        _getNorthFacingOrientationMatrix = _getNorthFacingOrientationMatrix || cwrap("getNorthFacingOrientationMatrix", null, ["number", "number", "number", "number", "number"]);
        var orientation = new Array(16);
        _emscriptenMemory.passDoubles(orientation, function(resultArray, arraySize) {
            _getNorthFacingOrientationMatrix(_eegeoApiPointer, latLng.lat, latLng.lng, arraySize, resultArray);
            orientation = _emscriptenMemory.readDoubles(resultArray, arraySize);
        });
        return orientation;
    };

    this.getCameraProjectionMatrix = function() {
        _getCameraProjectionMatrix = _getCameraProjectionMatrix || cwrap("getCameraProjectionMatrix", null, ["number", "number", "number"]);
        var projection = new Array(16);
        _emscriptenMemory.passDoubles(projection, function(resultArray, arraySize) {
            _getCameraProjectionMatrix(_eegeoApiPointer, arraySize, resultArray);
            projection = _emscriptenMemory.readDoubles(resultArray, arraySize);
        });
        return projection;
    };

    this.getCameraOrientationMatrix = function() {
        _getCameraOrientationMatrix = _getCameraOrientationMatrix || cwrap("getCameraOrientationMatrix", null, ["number", "number", "number"]);
        var orientation = new Array(16);
        _emscriptenMemory.passDoubles(orientation, function(resultArray, arraySize) {
            _getCameraOrientationMatrix(_eegeoApiPointer, arraySize, resultArray);
            orientation = _emscriptenMemory.readDoubles(resultArray, arraySize);
        });
        return orientation;
    };

    this.getLightingData = function() {
        _getLightingData = _getLightingData || cwrap("getLightingData", null, ["number", "number", "number"]);
        var lightingData = new Array(21);
        _emscriptenMemory.passDoubles(lightingData, function (resultArray, arraySize) {
            _getLightingData(_eegeoApiPointer, arraySize, resultArray);
            lightingData = _emscriptenMemory.readDoubles(resultArray, arraySize);
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
        };
        return lighting;
    };
}

module.exports = EmscriptenRenderingApi;