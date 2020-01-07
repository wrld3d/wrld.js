
function EmscriptenBlueSphereApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {
    var _emscriptenApiPointer = emscriptenApiPointer;

    var _blueSphereApi_setEnabled = cwrap("blueSphereApi_setEnabled", null, ["number", "number"]);
    var _blueSphereApi_setCoordinate = cwrap("blueSphereApi_setCoordinate", null, ["number", "number", "number"]);
    var _blueSphereApi_setElevation = cwrap("blueSphereApi_setElevation", null, ["number", "number"]);
    var _blueSphereApi_setIndoorMap = cwrap("blueSphereApi_setIndoorMap", null, ["number", "string", "number", "number"]);
    var _blueSphereApi_setHeadingDegrees = cwrap("blueSphereApi_setHeadingDegrees", null, ["number", "number"]);
    var _blueSphereApi_showOrientation = cwrap("blueSphereApi_showOrientation", null, ["number", "number"]);

    this.updateNativeState = function (blueSphereModule) {
        var location = blueSphereModule.getLocation();
        var indoorMapId = blueSphereModule.getIndoorMapId();

        if (!location) {
            _blueSphereApi_setEnabled(
                _emscriptenApiPointer,
                false
            );
            return;
        }

        _blueSphereApi_setEnabled(
            _emscriptenApiPointer,
            blueSphereModule.isEnabled()
        );

        _blueSphereApi_setCoordinate(
            _emscriptenApiPointer,
            location.lat,
            location.lng
        );

        _blueSphereApi_setElevation(
            _emscriptenApiPointer,
            blueSphereModule.getElevation()
        );

        _blueSphereApi_setIndoorMap(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapId.length,
            blueSphereModule.getIndoorMapFloorId()
        );

        _blueSphereApi_setHeadingDegrees(
            _emscriptenApiPointer,
            blueSphereModule.getHeadingDegrees()
        );

        _blueSphereApi_showOrientation(
            _emscriptenApiPointer,
            blueSphereModule.isOrientationVisible()
        );

    };
}

module.exports = EmscriptenBlueSphereApi;
