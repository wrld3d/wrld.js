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
    var _pendingOperations = [];
    var _ready = false;

    var _beginPrecacheOperation = function(operation) {
    var operationId = _emscriptenApi.precacheApi.beginPrecacheOperation(operation);
        _operations.insertObject(operationId, operation);

        return operationId;
    };

    var _beginAllPrecacheOperations = function() {
        _pendingOperations.forEach(function(operation) {
            if (!operation.isCancelled()) {
                _beginPrecacheOperation(operation);
            }
        });

        _pendingOperations = [];
    };

    var _cancelOperations = function(cancelledIds) {
        cancelledIds.forEach(function(operationId) {
        _emscriptenApi.precacheApi.cancelPrecacheOperation(operationId);
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

        if (_ready) {
            var operationId = _beginPrecacheOperation(internalOperation);
            _operations.insertObject(operationId, internalOperation);
        }
        else {
            _pendingOperations.push(internalOperation);
        }

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
