
function EmscriptenPrecacheApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;
    var _beginPrecacheOperation = cwrap("beginPrecacheOperation", null, ["number", "number", "number", "number", "number", "number", "number"]);
    var _cancelPrecacheOperation = cwrap("cancelPrecacheOperation", null, ["number", "number"]);
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
        var latlong = operation.getCentre();
        _beginPrecacheOperation(_apiPointer, operationId, latlong.lat, latlong.lng, operation.getRadius(), _completeCallback, _cancelCallback);
    };

    this.cancelPrecacheOperation = function(operationId) {
        _cancelPrecacheOperation(_apiPointer, operationId);
    };
}

module.exports = EmscriptenPrecacheApi;