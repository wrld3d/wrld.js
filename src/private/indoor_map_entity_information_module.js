var MapModule = require("./map_module");

function IndoorMapEntityInformationModuleImpl(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _nativeIdToIndoorMapEntityInformation = {};
    var _callbackInvokedBeforeAssignement = {};
    var _pendingIndoorEntityInformation = [];
    var _ready = false;
    var _notifyIndoorMapEntityInformationChangedCallback = null;

    var _createPendingIndoorMapEntityInformations = function() {
        _pendingIndoorEntityInformation.forEach(function(indoorMapEntityInformation) {
            _createAndAdd(indoorMapEntityInformation);
        });

        _pendingIndoorEntityInformation = [];
    };

    var _createAndAdd = function(indoorMapEntityInformation) {
        var nativeId = _emscriptenApi.indoorMapEntityInformationApi.createIndoorMapEntityInformation(indoorMapEntityInformation);
        _nativeIdToIndoorMapEntityInformation[nativeId] = indoorMapEntityInformation;
        indoorMapEntityInformation._setNativeHandle(nativeId);

        if(nativeId in _callbackInvokedBeforeAssignement){
            delete _callbackInvokedBeforeAssignement[nativeId];
            _notifyIndoorMapEntityInformationChanged(nativeId);
        }
        
        return nativeId;
    };

    this.addIndoorMapEntityInformation = function(indoorMapEntityInformation) {
        if (_ready) {
            _createAndAdd(indoorMapEntityInformation);
        }
        else {
            _pendingIndoorEntityInformation.push(indoorMapEntityInformation);
        }
    };
    
    this.removeIndoorMapEntityInformation = function(indoorMapEntityInformation) {

        if (!_ready) {
            var index = _pendingIndoorEntityInformation.indexOf(indoorMapEntityInformation);
            if (index > -1) {
                _pendingIndoorEntityInformation.splice(index, 1);
            }
            return;
        }

        var nativeId = indoorMapEntityInformation.getId();
        if (nativeId === undefined) {
            return;
        }

        _emscriptenApi.indoorMapEntityInformationApi.destroyIndoorMapEntityInformation(nativeId);
        delete _nativeIdToIndoorMapEntityInformation[nativeId];
        indoorMapEntityInformation._setNativeHandle(null);
    };

    this.onInitialized = function() {
        _ready = true;
        _emscriptenApi.indoorMapEntityInformationApi.registerIndoorMapEntityInformationChangedCallback(_executeIndoorMapEntityInformationChangedCallback);
        _createPendingIndoorMapEntityInformations();
    };

    this.setIndoorMapEntityInformationChangedCallback = function(callback) {
        _notifyIndoorMapEntityInformationChangedCallback = callback;
    };

    var _executeIndoorMapEntityInformationChangedCallback = function(indoorMapEntityInformationId) {
        if (indoorMapEntityInformationId in _nativeIdToIndoorMapEntityInformation) {
            _notifyIndoorMapEntityInformationChanged(indoorMapEntityInformationId);
        }
        else{
            _callbackInvokedBeforeAssignement[indoorMapEntityInformationId] = true;
        }
    };

    var _notifyIndoorMapEntityInformationChanged = function(indoorMapEntityInformationId) {
        var indoorMapEntityInformation = _nativeIdToIndoorMapEntityInformation[indoorMapEntityInformationId];
        var data = _emscriptenApi.indoorMapEntityInformationApi.tryGetIndoorMapEntityInformation(indoorMapEntityInformationId);
        if (data !== null) {
            indoorMapEntityInformation._setData(data);
        }
        if (_notifyIndoorMapEntityInformationChangedCallback !== null) {
            _notifyIndoorMapEntityInformationChangedCallback(indoorMapEntityInformation);
        }
    };
}

function IndoorMapEntityInformationModule(emscriptenApi) {
    var _indoorMapEntityInformationModuleImpl = new IndoorMapEntityInformationModuleImpl(emscriptenApi);
    var _this = this;

    var _IndoorMapEntityInformationChangedHandler = function(indoorMapEntityInformation) {
        _this.fire("indoormapentityinformationchanged", {indoorMapEntityInformation: indoorMapEntityInformation});
    };

    this.onInitialized = function() {
        _indoorMapEntityInformationModuleImpl.setIndoorMapEntityInformationChangedCallback(_IndoorMapEntityInformationChangedHandler);
        _indoorMapEntityInformationModuleImpl.onInitialized();
    };

    this._getImpl = function() {
        return _indoorMapEntityInformationModuleImpl;
    };
}

var IndoorMapEntityInformationModulePrototype = L.extend({}, MapModule, L.Mixin.Events);

IndoorMapEntityInformationModule.prototype = IndoorMapEntityInformationModulePrototype;

module.exports = IndoorMapEntityInformationModule;
