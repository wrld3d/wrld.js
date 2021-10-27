import L from "leaflet";
import MapModule from "./map_module";

export function IndoorMapEntityInformationModuleImpl(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _nativeIdToIndoorMapEntityInformation = {};
    var _callbackInvokedBeforeAssignement = {};
    var _pendingIndoorEntityInformation = [];
    var _ready = false;
    var _notifyIndoorMapEntityInformationChangedCallback = null;

    var _createPendingIndoorMapEntityInformations = () => {
        _pendingIndoorEntityInformation.forEach(function (indoorMapEntityInformation) {
            _createAndAdd(indoorMapEntityInformation);
        });

        _pendingIndoorEntityInformation = [];
    };

    var _createAndAdd = (indoorMapEntityInformation) => {
        var nativeId = _emscriptenApi.indoorMapEntityInformationApi.createIndoorMapEntityInformation(indoorMapEntityInformation);
        _nativeIdToIndoorMapEntityInformation[nativeId] = indoorMapEntityInformation;
        indoorMapEntityInformation._setNativeHandle(nativeId);

        if (nativeId in _callbackInvokedBeforeAssignement) {
            delete _callbackInvokedBeforeAssignement[nativeId];
            _notifyIndoorMapEntityInformationChanged(nativeId);
        }

        return nativeId;
    };

    this.addIndoorMapEntityInformation = (indoorMapEntityInformation) => {
        if (_ready) {
            _createAndAdd(indoorMapEntityInformation);
        }
        else {
            _pendingIndoorEntityInformation.push(indoorMapEntityInformation);
        }
    };
    
    this.removeIndoorMapEntityInformation = (indoorMapEntityInformation) => {

        if (!_ready) {
            var index = _pendingIndoorEntityInformation.indexOf(indoorMapEntityInformation);
            if (index > -1) {
                _pendingIndoorEntityInformation.splice(index, 1);
            }
            return;
        }

        var nativeId = indoorMapEntityInformation.getNativeId();
        if (nativeId === undefined) {
            return;
        }

        _emscriptenApi.indoorMapEntityInformationApi.destroyIndoorMapEntityInformation(nativeId);
        delete _nativeIdToIndoorMapEntityInformation[nativeId];
        indoorMapEntityInformation._setNativeHandle(null);
    };

    this.onInitialized = () => {
        _ready = true;
        _emscriptenApi.indoorMapEntityInformationApi.registerIndoorMapEntityInformationChangedCallback(_executeIndoorMapEntityInformationChangedCallback);
        _createPendingIndoorMapEntityInformations();
    };

    this.setIndoorMapEntityInformationChangedCallback = (callback) => {
        _notifyIndoorMapEntityInformationChangedCallback = callback;
    };

    var _executeIndoorMapEntityInformationChangedCallback = (indoorMapEntityInformationId) => {
        if (indoorMapEntityInformationId in _nativeIdToIndoorMapEntityInformation) {
            _notifyIndoorMapEntityInformationChanged(indoorMapEntityInformationId);
        }
        else {
            _callbackInvokedBeforeAssignement[indoorMapEntityInformationId] = true;
        }
    };

    var _notifyIndoorMapEntityInformationChanged = (indoorMapEntityInformationId) => {
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

    var _IndoorMapEntityInformationChangedHandler = (indoorMapEntityInformation) => {
        this.fire("indoormapentityinformationchanged", { indoorMapEntityInformation: indoorMapEntityInformation });
    };

    this.onInitialized = () => {
        _indoorMapEntityInformationModuleImpl.setIndoorMapEntityInformationChangedCallback(_IndoorMapEntityInformationChangedHandler);
        _indoorMapEntityInformationModuleImpl.onInitialized();
    };

    this._getImpl = () => _indoorMapEntityInformationModuleImpl;
}

var IndoorMapEntityInformationModulePrototype = L.extend({}, MapModule, L.Mixin.Events);

IndoorMapEntityInformationModule.prototype = IndoorMapEntityInformationModulePrototype;

export default IndoorMapEntityInformationModule;
