export function EmscriptenPrecacheApi(emscriptenApiPointer, cwrap, emscriptenModule) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _beginPrecacheOperation = null;
    var _cancelPrecacheOperation = null;
    var _setPrecacheCallbacks = null;
    var _cancelCallback = null;
    var _completeCallback = null;

    this.registerCallbacks = (completeCallback, cancelCallback) => {
        if (_completeCallback !== null) {
            emscriptenModule.removeFunction(_completeCallback);
        }
        _completeCallback = emscriptenModule.addFunction(completeCallback, "vi");
        if (_cancelCallback !== null) {
            emscriptenModule.removeFunction(_cancelCallback);
        }
        _cancelCallback = emscriptenModule.addFunction(cancelCallback, "vi");

        _setPrecacheCallbacks = _setPrecacheCallbacks || cwrap("precacheApi_setPrecacheCallbacks", null, ["number", "number", "number"]);
        _setPrecacheCallbacks(_emscriptenApiPointer, _completeCallback, _cancelCallback);
    };

    this.beginPrecacheOperation = (operation) => {
        _beginPrecacheOperation = _beginPrecacheOperation || cwrap("precacheApi_beginPrecacheOperation", "number", ["number", "number", "number", "number"]);

        var latlong = operation.getCentre();
        return _beginPrecacheOperation(_emscriptenApiPointer, latlong.lat, latlong.lng, operation.getRadius());
    };

    this.cancelPrecacheOperation = (operationId) => {
        _cancelPrecacheOperation = _cancelPrecacheOperation || cwrap("precacheApi_cancelPrecacheOperation", null, ["number", "number"]);
        _cancelPrecacheOperation(_emscriptenApiPointer, operationId);
    };
}

export default EmscriptenPrecacheApi;
