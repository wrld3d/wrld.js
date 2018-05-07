var MapModule = require("./map_module");
var IdToObjectMap = require("./id_to_object_map");
var PrecacheOperationResult = require("../public/precaching/precache_operation_result");

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
        _completionCallback(new PrecacheOperationResult(success));
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

    var _validatePrecacheParameters = function(center, radius) {
        var MaxPrecacheRadius = 16000.0;

        if (radius > MaxPrecacheRadius || radius <= 0.0) {
            return new Error("radius outside of valid [0.0, " + MaxPrecacheRadius + "] range.");
        }
        if (center.lat < -90.0 || center.lat > 90.0) {
            return new Error("latitide outside of valid [-90.0, 90.0] range.");
        }
        if (center.lng < -180.0 || center.lng > 180.0) {
            return new Error("longitude outside of valid [-180.0, 180.0] range.");
        }

        return null;
    };

    this.precache = function(center, radius, callbackFunction) {
        var parameterValidationError = _validatePrecacheParameters(center, radius);

        if (parameterValidationError !== null) {
            throw parameterValidationError;
        }

        var internalOperation = new InternalPrecacheOperation(center, radius, callbackFunction);

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

    this.onInitialized = function () {
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
