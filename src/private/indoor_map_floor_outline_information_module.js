var MapModule = require("./map_module");

function IndoorMapFloorOutlineInformationModuleImpl(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _nativeIdToIndoorMapFloorOutlineInformation = {};
    var _callbackInvokedBeforeAssignement = {};
    var _pendingIndoorMapFloorOutlineInformation = [];
    var _ready = false;
    var _notifyIndoorMapFloorOutlineInformationLoadedCallback = null;

    var _createPendingIndoorMapFloorOutlineInformations = function() {
        _pendingIndoorMapFloorOutlineInformation.forEach(function(indoorMapFloorOutlineInformation) {
            _createAndAdd(indoorMapFloorOutlineInformation);
        });

        _pendingIndoorMapFloorOutlineInformation = [];
    };

    var _createAndAdd = function(indoorMapFloorOutlineInformation) {
        var nativeId = _emscriptenApi.indoorMapFloorOutlineInformationApi.createIndoorMapFloorOutlineInformation(indoorMapFloorOutlineInformation);
        _nativeIdToIndoorMapFloorOutlineInformation[nativeId] = indoorMapFloorOutlineInformation;
        indoorMapFloorOutlineInformation._setNativeHandle(nativeId);

        if(nativeId in _callbackInvokedBeforeAssignement){
            delete _callbackInvokedBeforeAssignement[nativeId];
            _fetchIndoorMapFloorOutlineInformation(nativeId);
        }

        return nativeId;
    };

    this.addIndoorMapFloorOutlineInformation = function(indoorMapFloorOutlineInformation) {
        if (_ready) {
            _createAndAdd(indoorMapFloorOutlineInformation);
        }
        else {
            _pendingIndoorMapFloorOutlineInformation.push(indoorMapFloorOutlineInformation);
        }
    };
    
    this.removeIndoorMapFloorOutlineInformation = function(indoorMapFloorOutlineInformation) {

        if (!_ready) {
            var index = _pendingIndoorMapFloorOutlineInformation.indexOf(indoorMapFloorOutlineInformation);
            if (index > -1) {
                _pendingIndoorMapFloorOutlineInformation.splice(index, 1);
            }
            return;
        }

        var nativeId = indoorMapFloorOutlineInformation.getId();
        if (nativeId === undefined) {
            return;
        }

        _emscriptenApi.indoorMapFloorOutlineInformationApi.destroyIndoorMapFloorOutlineInformation(nativeId);
        delete _nativeIdToIndoorMapFloorOutlineInformation[nativeId];
        indoorMapFloorOutlineInformation._setNativeHandle(null);
    };

    this.onInitialized = function() {
        _ready = true;
        _emscriptenApi.indoorMapFloorOutlineInformationApi.registerIndoorMapFloorOutlineInformationLoadedCallback(_executeIndoorMapFloorOutlineInformationLoadedCallback);
        _createPendingIndoorMapFloorOutlineInformations();
    };

    this.setIndoorMapFloorOutlineInformationLoadedCallback = function(callback) {
        _notifyIndoorMapFloorOutlineInformationLoadedCallback = callback;
    };

    var _executeIndoorMapFloorOutlineInformationLoadedCallback = function(indoorMapFloorOutlineInformationId) {
        if (indoorMapFloorOutlineInformationId in _nativeIdToIndoorMapFloorOutlineInformation) {
            _fetchIndoorMapFloorOutlineInformation(indoorMapFloorOutlineInformationId);
        }
        else{
            _callbackInvokedBeforeAssignement[indoorMapFloorOutlineInformationId] = true;
        }
    };

    var _fetchIndoorMapFloorOutlineInformation = function(indoorMapFloorOutlineInformationId) {
        var indoorMapFloorOutlineInformation = _nativeIdToIndoorMapFloorOutlineInformation[indoorMapFloorOutlineInformationId];
        if (_emscriptenApi.indoorMapFloorOutlineInformationApi.getIndoorMapFloorOutlineInformationLoaded(indoorMapFloorOutlineInformationId)) {
            var data = _emscriptenApi.indoorMapFloorOutlineInformationApi.tryGetIndoorMapFloorOutlineInformation(indoorMapFloorOutlineInformationId);
            if (data !== null) {
                indoorMapFloorOutlineInformation._setData(data);
                if (_notifyIndoorMapFloorOutlineInformationLoadedCallback !== null) {
                    _notifyIndoorMapFloorOutlineInformationLoadedCallback(indoorMapFloorOutlineInformation);
                }
            }
        }
    };
}

function IndoorMapFloorOutlineInformationModule(emscriptenApi) {
    var _indoorMapFloorOutlineInformationModuleImpl = new IndoorMapFloorOutlineInformationModuleImpl(emscriptenApi);
    var _this = this;

    var _IndoorMapFloorOutlineInformationLoadedHandler = function(indoorMapFloorOutlineInformation) {
        _this.fire("indoormapflooroutlineinformationloaded", {indoorMapFloorOutlineInformation: indoorMapFloorOutlineInformation});
    };

    this.onInitialized = function() {
        _indoorMapFloorOutlineInformationModuleImpl.setIndoorMapFloorOutlineInformationLoadedCallback(_IndoorMapFloorOutlineInformationLoadedHandler);
        _indoorMapFloorOutlineInformationModuleImpl.onInitialized();
    };

    this._getImpl = function() {
        return _indoorMapFloorOutlineInformationModuleImpl;
    };
}

var IndoorMapFloorOutlineInformationModulePrototype = L.extend({}, MapModule, L.Mixin.Events);

IndoorMapFloorOutlineInformationModule.prototype = IndoorMapFloorOutlineInformationModulePrototype;

module.exports = IndoorMapFloorOutlineInformationModule;
