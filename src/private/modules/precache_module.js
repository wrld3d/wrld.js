import L from "leaflet";
import MapModule from "./map_module";
import IdToObjectMap from "../id_to_object_map";
import PreCacheOperationResult from "../../public/precaching/precache_operation_result";

function PrecacheOperation (operation) {
    var _operation = operation;

    this.cancel = function() {
        _operation.cancel();
    };
}


function InternalPrecacheOperation (centre, radius, completionCallback) {
    var _centre = L.latLng(centre);
    var _radius = radius;
    var _completionCallback = completionCallback;
    var _cancelled = false;

    var _executeCompletionCallback = (success) => {
        _completionCallback(new PreCacheOperationResult(success));
    };

    this.getCentre = () => _centre;

    this.getRadius = () => _radius;

    this.cancel = () => {
        _cancelled = true;
    };

    this.isCancelled = () => _cancelled;

    this.notifyComplete = () => {
        _executeCompletionCallback(true);
    };

    this.notifyCancelled = () => {
        _executeCompletionCallback(false);
    };
}

function PrecacheModule (emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _operations = new IdToObjectMap();
    var _pendingOperations = [];
    var _ready = false;

    var _beginPrecacheOperation = (operation) => {
        var operationId = _emscriptenApi.precacheApi.beginPrecacheOperation(operation);
        _operations.insertObject(operationId, operation);

        return operationId;
    };

    var _beginAllPrecacheOperations = () => {
        _pendingOperations.forEach((operation) => {
                if (operation.isCancelled()) {
                    operation.notifyCancelled();
                }
                else {
                    _beginPrecacheOperation(operation);
                }
            });

        _pendingOperations = [];
    };

    var _cancelOperations = (cancelledIds) => {
        cancelledIds.forEach((operationId) => {
                _emscriptenApi.precacheApi.cancelPrecacheOperation(operationId);
            });
    };

    var _onPrecacheOperationCompleted = (operationId) => {
        var operation = _operations.removeObjectById(operationId);
        operation.notifyComplete();
    };

    var _onPrecacheOperationCancelled = (operationId) => {
        var operation = _operations.removeObjectById(operationId);
        operation.notifyCancelled();
    };

    // :TODO: Fix DRY fail causing this to exist in both EegeoPrecacheApi::MaxPrecacheRadius and here.
    var _getMaximumPrecacheRadius = () => 16000.0;

    var _validatePrecacheParameters = (center, radius) => {
        if (radius > _getMaximumPrecacheRadius() || radius <= 0.0) {
            return new Error("radius outside of valid (0.0, " + _getMaximumPrecacheRadius() + "] range.");
        }

        return null;
    };

    this.getMaximumPrecacheRadius = () => _getMaximumPrecacheRadius();

    this.precache = (center, radius, callbackFunction) => {
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

    this.onInitialized = () => {
        _ready = true;
        _emscriptenApi.precacheApi.registerCallbacks(_onPrecacheOperationCompleted, _onPrecacheOperationCancelled);
        _beginAllPrecacheOperations();
    };

    this.onUpdate = (dt) => {
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
}

PrecacheModule.prototype = MapModule;

export default PrecacheModule;
