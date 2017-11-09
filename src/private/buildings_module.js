var MapModule = require("./map_module");

function BuildingsModuleImpl(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _nativeIdToBuildingHighlights = {};
    var _callbackInvokedBeforeAssignement = {};
    var _pendingBuildingHighlights = [];
    var _ready = false;
    var _notifyBuildingInformationReceivedCallback = null;

    var _createPendingBuildingHighlights = function() {
        _pendingBuildingHighlights.forEach(function(buildingHighlight) {
            _createAndAdd(buildingHighlight);
        });
        _pendingBuildingHighlights = [];
    };

    var _createAndAdd = function(buildingHighlight) {
        var nativeId = _emscriptenApi.buildingsApi.createBuildingHighlight(buildingHighlight);
        _nativeIdToBuildingHighlights[nativeId] = buildingHighlight;
        buildingHighlight._setNativeHandle(nativeId);
        
        if(nativeId in _callbackInvokedBeforeAssignement){
            delete _callbackInvokedBeforeAssignement[nativeId];
            _notifyBuildingInformationReceived(nativeId);
        }

        return nativeId;
    };

    this.addBuildingHighlight = function(buildingHighlight) {
        if (_ready) {
            _createAndAdd(buildingHighlight);
        }
        else {
            _pendingBuildingHighlights.push(buildingHighlight);
        }
    };

    this.removeBuildingHighlight = function(buildingHighlight) {

        if (!_ready) {
            var index = _pendingBuildingHighlights.indexOf(buildingHighlight);
            if (index > -1) {
                _pendingBuildingHighlights.splice(index, 1);
            }
            return;
        }

        var nativeId = buildingHighlight.getId();
        if (nativeId === undefined) {
            return;
        }

        _emscriptenApi.buildingsApi.destroyBuildingHighlight(nativeId);
        delete _nativeIdToBuildingHighlights[nativeId];
        buildingHighlight._setNativeHandle(null);
    };

    this.notifyBuildingHighlightChanged = function(buildingHighlight) {
        if (_ready) {
            var nativeId = buildingHighlight.getId();
            if (nativeId === undefined) {
                return;
            }
            _emscriptenApi.buildingsApi.setHighlightColor(nativeId, buildingHighlight.getColor());
        }
    };

    this.findIntersectionWithBuilding = function(ray) {
        if (!_ready) {
            return undefined;
        }
        return _emscriptenApi.buildingsApi.findIntersectionWithBuilding(ray);
    };

    this.findBuildingAtScreenPoint = function(screenPoint) {
        if (!_ready) {
            return undefined;
        }

        var ray = _emscriptenApi.spacesApi.screenPointToRay(screenPoint);
        return this.findIntersectionWithBuilding(ray);
    };

    this.findBuildingAtLatLng = function(latLng) {
        if (!_ready) {
            return undefined;
        }

        var ray = _emscriptenApi.spacesApi.latLongToVerticallyDownRay(latLng);
        return this.findIntersectionWithBuilding(ray);
    };

    this.onInitialized = function() {
        _ready = true;
        _emscriptenApi.buildingsApi.registerBuildingInformationReceivedCallback(_executeBuildingInformationReceivedCallback);
        _createPendingBuildingHighlights();
    };

    this.isReady = function() {
        return _ready;
    };

    this.setBuildingInformationReceivedCallback = function(callback) {
        _notifyBuildingInformationReceivedCallback = callback;
    };

    var _executeBuildingInformationReceivedCallback = function(buildingHighlightId) {
        if (buildingHighlightId in _nativeIdToBuildingHighlights) {
            _notifyBuildingInformationReceived(buildingHighlightId);
        }
        else{
            _callbackInvokedBeforeAssignement[buildingHighlightId] = true;
        }
    };

    var _notifyBuildingInformationReceived = function(buildingHighlightId) {
        var buildingHighlight = _nativeIdToBuildingHighlights[buildingHighlightId];
        var buildingInformation = _emscriptenApi.buildingsApi.tryGetBuildingInformation(buildingHighlightId);
        if (buildingInformation !== null) {
            buildingHighlight._setBuildingInformation(buildingInformation);
        }
        if (_notifyBuildingInformationReceivedCallback !== null) {
            _notifyBuildingInformationReceivedCallback(buildingHighlight);
        }
    };
}

function BuildingsModule(emscriptenApi) {
    var _buildingsModuleImpl = new BuildingsModuleImpl(emscriptenApi);
    var _this = this;

    var _buildingInformationReceivedHandler = function(buildingHighlight) {
        _this.fire("buildinginformationreceived", {buildingHighlight: buildingHighlight});
    };

    this.findBuildingAtScreenPoint = function(screenPoint) {
        return _buildingsModuleImpl.findBuildingAtScreenPoint(screenPoint);
    };

    this.findBuildingAtLatLng = function(latLng) {
        return _buildingsModuleImpl.findBuildingAtLatLng(latLng);
    };

    this.onInitialized = function() {
        _buildingsModuleImpl.setBuildingInformationReceivedCallback(_buildingInformationReceivedHandler);
        _buildingsModuleImpl.onInitialized();
    };

    this._getImpl = function() {
        return _buildingsModuleImpl;
    };
}

var BuildingsModulePrototype = L.extend({}, MapModule, L.Mixin.Events);

BuildingsModule.prototype = BuildingsModulePrototype;

module.exports = BuildingsModule;
