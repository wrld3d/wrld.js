var MapModule = require("./map_module");

function IndoorMapEntityOutlineInformationModuleImpl(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _nativeIdToIndoorMapEntityOutlineInformation = {};
    var _callbackInvokedBeforeAssignement = {};
    var _pendingIndoorMapEntityOutlineInformation = [];
    var _ready = false;
    var _notifyIndoorMapEntityOutlineInformationLoadedCallback = null;

    var _createPendingIndoorMapEntityOutlineInformations = function() {
        _pendingIndoorMapEntityOutlineInformation.forEach(function(indoorMapEntityOutlineInformation) {
            _createAndAdd(indoorMapEntityOutlineInformation);
        });

        _pendingIndoorMapEntityOutlineInformation = [];
    };

    var _createAndAdd = function(indoorMapEntityOutlineInformation) {
        var nativeId = _emscriptenApi.indoorMapEntityOutlineInformationApi.createIndoorMapEntityOutlineInformation(indoorMapEntityOutlineInformation);
        _nativeIdToIndoorMapEntityOutlineInformation[nativeId] = indoorMapEntityOutlineInformation;
        indoorMapEntityOutlineInformation._setNativeHandle(nativeId);

        if(nativeId in _callbackInvokedBeforeAssignement){
            delete _callbackInvokedBeforeAssignement[nativeId];
            _fetchIndoorMapEntityOutlineInformation(nativeId);
        }

        return nativeId;
    };

    this.addIndoorMapEntityOutlineInformation = function(indoorMapEntityOutlineInformation) {
        if (_ready) {
            _createAndAdd(indoorMapEntityOutlineInformation);
        }
        else {
            _pendingIndoorMapEntityOutlineInformation.push(indoorMapEntityOutlineInformation);
        }
    };
    
    this.removeIndoorMapEntityOutlineInformation = function(indoorMapEntityOutlineInformation) {

        if (!_ready) {
            var index = _pendingIndoorMapEntityOutlineInformation.indexOf(indoorMapEntityOutlineInformation);
            if (index > -1) {
                _pendingIndoorMapEntityOutlineInformation.splice(index, 1);
            }
            return;
        }

        var nativeId = indoorMapEntityOutlineInformation.getId();
        if (nativeId === undefined) {
            return;
        }

        _emscriptenApi.indoorMapEntityOutlineInformationApi.destroyIndoorMapEntityOutlineInformation(nativeId);
        delete _nativeIdToIndoorMapEntityOutlineInformation[nativeId];
        indoorMapEntityOutlineInformation._setNativeHandle(null);
    };

    this.onInitialized = function() {
        _ready = true;
        _emscriptenApi.indoorMapEntityOutlineInformationApi.registerIndoorMapEntityOutlineInformationLoadedCallback(_executeIndoorMapEntityOutlineInformationLoadedCallback);
        _createPendingIndoorMapEntityOutlineInformations();
    };

    this.setIndoorMapEntityOutlineInformationLoadedCallback = function(callback) {
        _notifyIndoorMapEntityOutlineInformationLoadedCallback = callback;
    };

    var _executeIndoorMapEntityOutlineInformationLoadedCallback = function(indoorMapEntityOutlineInformationId) {
        if (indoorMapEntityOutlineInformationId in _nativeIdToIndoorMapEntityOutlineInformation) {
            _fetchIndoorMapEntityOutlineInformation(indoorMapEntityOutlineInformationId);
        }
        else{
            _callbackInvokedBeforeAssignement[indoorMapEntityOutlineInformationId] = true;
        }
    };

    var _fetchIndoorMapEntityOutlineInformation = function(indoorMapEntityOutlineInformationId) {
        var indoorMapEntityOutlineInformation = _nativeIdToIndoorMapEntityOutlineInformation[indoorMapEntityOutlineInformationId];
        if (_emscriptenApi.indoorMapEntityOutlineInformationApi.getIndoorMapEntityOutlineInformationLoaded(indoorMapEntityOutlineInformationId)) {
            var data = _emscriptenApi.indoorMapEntityOutlineInformationApi.tryGetIndoorMapEntityOutlineInformation(indoorMapEntityOutlineInformationId);
            if (data !== null) {
                indoorMapEntityOutlineInformation._setData(data);
                if (_notifyIndoorMapEntityOutlineInformationLoadedCallback !== null) {
                    _notifyIndoorMapEntityOutlineInformationLoadedCallback(indoorMapEntityOutlineInformation);
                }
            }
        }
    };
}

function IndoorMapEntityOutlineInformationModule(emscriptenApi) {
    var _indoorMapEntityOutlineInformationModuleImpl = new IndoorMapEntityOutlineInformationModuleImpl(emscriptenApi);
    var _this = this;

    var _IndoorMapEntityOutlineInformationLoadedHandler = function(indoorMapEntityOutlineInformation) {
        _this.fire("indoormapentityoutlineinformationloaded", {indoorMapEntityOutlineInformation: indoorMapEntityOutlineInformation});
    };

    this.onInitialized = function() {
        _indoorMapEntityOutlineInformationModuleImpl.setIndoorMapEntityOutlineInformationLoadedCallback(_IndoorMapEntityOutlineInformationLoadedHandler);
        _indoorMapEntityOutlineInformationModuleImpl.onInitialized();
    };

    this._getImpl = function() {
        return _indoorMapEntityOutlineInformationModuleImpl;
    };
}

var IndoorMapEntityOutlineInformationModulePrototype = L.extend({}, MapModule, L.Mixin.Events);

IndoorMapEntityOutlineInformationModule.prototype = IndoorMapEntityOutlineInformationModulePrototype;

module.exports = IndoorMapEntityOutlineInformationModule;
