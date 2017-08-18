
function EmscriptenPrecacheApi(eegeoApiPointer, cwrap, runtime) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _beginPrecacheOperation = null;
    var _cancelPrecacheOperation = null;
    var _cancelCallback = null;
    var _completeCallback = null;

    this.registerCallbacks = function(completeCallback, cancelCallback) {
        if (_completeCallback !== null) {
            runtime.removeFunction(_completeCallback);
        }
        _completeCallback = runtime.addFunction(completeCallback);
        if (_cancelCallback !== null) {
            runtime.removeFunction(_cancelCallback);
        }
        _cancelCallback = runtime.addFunction(cancelCallback);
    };

    this.beginPrecacheOperation = function(operationId, operation) {      
        _beginPrecacheOperation = _beginPrecacheOperation || cwrap("beginPrecacheOperation", null, ["number", "number", "number", "number", "number", "number", "number"]);
      
        var latlong = operation.getCentre();
        _beginPrecacheOperation(_eegeoApiPointer, operationId, latlong.lat, latlong.lng, operation.getRadius(), _completeCallback, _cancelCallback);
    };

    this.cancelPrecacheOperation = function(operationId) {
        _cancelPrecacheOperation = _cancelPrecacheOperation || cwrap("cancelPrecacheOperation", null, ["number", "number"]);
        _cancelPrecacheOperation(_eegeoApiPointer, operationId);
    };
}

module.exports = EmscriptenPrecacheApi;