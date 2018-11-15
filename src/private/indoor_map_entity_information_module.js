var MapModule = require("./map_module");

function IndoorMapEntityInformationModuleImpl(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _nativeIdToIndoorMapEntityInformation = {};
    var _pendingIndoorEntityInformation = [];
    var _ready = false;

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
    

    this.onInitialized = function() {
        _ready = true;
        _createPendingIndoorMapEntityInformations();
    };

}

function IndoorMapEntityInformationModule(emscriptenApi) {
    var _indoorMapEntityInformationModuleImpl = new IndoorMapEntityInformationModuleImpl(emscriptenApi);

    this.onInitialized = function() {
        _indoorMapEntityInformationModuleImpl.onInitialized();
    };

    this._getImpl = function() {
        return _indoorMapEntityInformationModuleImpl;
    };
}

var IndoorMapEntityInformationModulePrototype = L.extend({}, MapModule, L.Mixin.Events);

IndoorMapEntityInformationModule.prototype = IndoorMapEntityInformationModulePrototype;

module.exports = IndoorMapEntityInformationModule;
