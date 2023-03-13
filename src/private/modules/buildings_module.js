import L from "leaflet";
import MapModule from "./map_module";

export function BuildingsModuleImpl(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _nativeIdToBuildingHighlights = {};
    var _callbackInvokedBeforeAssignement = {};
    var _pendingBuildingHighlights = [];
    var _ready = false;
    var _notifyBuildingInformationReceivedCallback = null;

    var _createPendingBuildingHighlights = () => {
        _pendingBuildingHighlights.forEach((buildingHighlight) => {
                _createAndAdd(buildingHighlight);
            });
        _pendingBuildingHighlights = [];
    };

    var _createAndAdd = (buildingHighlight) => {
        var nativeId = _emscriptenApi.buildingsApi.createBuildingHighlight(buildingHighlight);
        _nativeIdToBuildingHighlights[nativeId] = buildingHighlight;
        buildingHighlight._setNativeHandle(nativeId);

        if (nativeId in _callbackInvokedBeforeAssignement) {
            delete _callbackInvokedBeforeAssignement[nativeId];
            _notifyBuildingInformationReceived(nativeId);
        }

        return nativeId;
    };

    this.addBuildingHighlight = (buildingHighlight) => {
        if (_ready) {
            _createAndAdd(buildingHighlight);
        }
        else {
            _pendingBuildingHighlights.push(buildingHighlight);
        }
    };

    this.removeBuildingHighlight = (buildingHighlight) => {

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

    this.notifyBuildingHighlightChanged = (buildingHighlight) => {
        if (_ready) {
            var nativeId = buildingHighlight.getId();
            if (nativeId === undefined) {
                return;
            }
            _emscriptenApi.buildingsApi.setHighlightColor(nativeId, buildingHighlight.getColor());
            _emscriptenApi.buildingsApi.setHighlightHeightRanges(nativeId, buildingHighlight.getHeightRanges());
        }
    };

    this.findIntersectionWithBuilding = (ray) => {
        if (!_ready) {
            return undefined;
        }
        return _emscriptenApi.buildingsApi.findIntersectionWithBuilding(ray);
    };

    this.findBuildingAtScreenPoint = (screenPoint) => {
        if (!_ready) {
            return undefined;
        }

        var ray = _emscriptenApi.spacesApi.screenPointToRay(screenPoint);
        return this.findIntersectionWithBuilding(ray);
    };

    this.findBuildingAtLatLng = (latLng) => {
        if (!_ready) {
            return undefined;
        }

        var ray = _emscriptenApi.spacesApi.latLongToVerticallyDownRay(latLng);
        return this.findIntersectionWithBuilding(ray);
    };

    this.onInitialized = () => {
        _ready = true;
        _emscriptenApi.buildingsApi.registerBuildingInformationReceivedCallback(_executeBuildingInformationReceivedCallback);
        _createPendingBuildingHighlights();
    };

    this.isReady = () => _ready;

    this.setBuildingInformationReceivedCallback = (callback) => {
        _notifyBuildingInformationReceivedCallback = callback;
    };

    var _executeBuildingInformationReceivedCallback = (buildingHighlightId) => {
        if (buildingHighlightId in _nativeIdToBuildingHighlights) {
            _notifyBuildingInformationReceived(buildingHighlightId);
        }
        else {
            _callbackInvokedBeforeAssignement[buildingHighlightId] = true;
        }
    };

    var _notifyBuildingInformationReceived = (buildingHighlightId) => {
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

    var _buildingInformationReceivedHandler = (buildingHighlight) => {
        _this.fire("buildinginformationreceived", { buildingHighlight: buildingHighlight });
    };

    this.findBuildingAtScreenPoint = (screenPoint) => _buildingsModuleImpl.findBuildingAtScreenPoint(screenPoint);

    this.findBuildingAtLatLng = (latLng) => _buildingsModuleImpl.findBuildingAtLatLng(latLng);

    this.onInitialized = () => {
        _buildingsModuleImpl.setBuildingInformationReceivedCallback(_buildingInformationReceivedHandler);
        _buildingsModuleImpl.onInitialized();
    };

    this._getImpl = () => _buildingsModuleImpl;
}

var BuildingsModulePrototype = L.extend({}, MapModule, L.Mixin.Events);

BuildingsModule.prototype = BuildingsModulePrototype;

export default BuildingsModule;
