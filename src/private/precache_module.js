var MapModule = require("./map_module");
var IdToObjectMap = require("./id_to_object_map");

var PrecacheOperation = function(operation) {
    var _operation = operation;

    this.cancel = function() {
        _operation.cancel();
    };
};


var InternalPrecacheOperation = function(centre, radius, completionCallback) {
    var _centre = L.latLng(centre);
    var _radius = radius;
    var _completionCallback = completionCallback;
    var _cancelled = false;

    this.getCentre = function() {
        return _centre;
    };

    this.getRadius = function() {
        return _radius;
    };

    this.executeCompletionCallback = function(success) {
        _completionCallback(success);
    };

    this.cancel = function() {
        _cancelled = true;
    };

    this.isCancelled = function() {
        return _cancelled;
    };
};

var PrecacheModule = function(emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _operations = new IdToObjectMap();
    var _ready = false;

    var _beginPrecacheOperation = function(operationId, operation) {
        if (_ready) {
            _emscriptenApi.precacheApi.beginPrecacheOperation(operationId, operation);
        }
    };

    var _beginAllPrecacheOperations = function() {
        _operations.forEachItem(function(operationId, operation) {
            if (!operation.isCancelled()) {
                _beginPrecacheOperation(operationId, operation);
            }
        });
    };

    var _cancelOperations = function(cancelledIds) {
        cancelledIds.forEach(function(operationId) {
            var operation = _operations.removeObjectById(operationId);
            operation.executeCompletionCallback(false);
        });
    };

    var _onPrecacheOperationCompleted = function(operationId) {
        var operation = _operations.removeObjectById(operationId);
        operation.executeCompletionCallback(true);
    };

    var _onPrecacheOperationCancelled = function(operationId) {
        var operation = _operations.removeObjectById(operationId);
        operation.executeCompletionCallback(false);
    };

    this.precache = function(centre, radius, completionCallback) {
        var internalOperation = new InternalPrecacheOperation(centre, radius, completionCallback);
        var operationId = _operations.insertObject(internalOperation);

        _beginPrecacheOperation(operationId, internalOperation);

        var precacheOperation = new PrecacheOperation(internalOperation);
        return precacheOperation;
    };

    this.onInitialStreamingCompleted = function() {
        _ready = true;
        _emscriptenApi.precacheApi.registerCallbacks(_onPrecacheOperationCompleted, _onPrecacheOperationCancelled);
        _beginAllPrecacheOperations();
    };

    this.onUpdate = function(dt) {
        if (!_ready) {
            return;
        }

        var cancelledOperations = [];
        _operations.forEachItem(function (operationId, operation) {
            if (operation.isCancelled()) {
                cancelledOperations.push(operationId);
            }
        });
        _cancelOperations(cancelledOperations);
    };

};
PrecacheModule.prototype = MapModule;

module.exports = PrecacheModule;