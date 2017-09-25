var MapModule = require("./map_module");

function BuildingsModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _nativeIdToBuildingHighlights = {};
    var _pendingBuildingHighlights = [];
    var _ready = false;
    var _this = this;

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

    this.onInitialized = function() {
        _ready = true;
        _emscriptenApi.buildingsApi.registerBuildingInformationReceivedCallback(_executeBuildingInformationReceivedCallback);
        _createPendingBuildingHighlights();
    };

    var _executeBuildingInformationReceivedCallback = function(buildingHighlightId) {
        if (buildingHighlightId in _nativeIdToBuildingHighlights) {
            var _buildingHighlight = _nativeIdToBuildingHighlights[buildingHighlightId];
            var buildingInformation = _emscriptenApi.buildingsApi.tryGetBuildingInformation(buildingHighlightId);
            if (buildingInformation !== null) {
                _buildingHighlight._setBuildingInformation(buildingInformation);
            }
            _this.fire("buildinginformationreceived", {buildingHighlight: _buildingHighlight});
        }
    };
}
var BuildingsModulePrototype = L.extend({}, MapModule, L.Mixin.Events);

BuildingsModule.prototype = BuildingsModulePrototype;

module.exports = BuildingsModule;
