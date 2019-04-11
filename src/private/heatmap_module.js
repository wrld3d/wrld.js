var MapModule = require("./map_module");

function HeatmapModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _heatmapIdToHeatmap = {};
    var _pendingHeatmaps = [];
    var _ready = false;


    var _createPendingHeatmaps = function() {
        _pendingHeatmaps.forEach(function(heatmap) {
            _createAndAdd(heatmap);
        });
        _pendingHeatmaps = [];
    };

    var _createAndAdd = function(heatmap) {
        var heatmapId = _emscriptenApi.heatmapApi.createHeatmap(heatmap);
        _heatmapIdToHeatmap[heatmapId] = heatmap;
        return heatmapId;
    };

    this.addHeatmap = function(heatmap) {
        if (_ready) {
            _createAndAdd(heatmap);
        }
        else {
            _pendingHeatmaps.push(heatmap);
        }
    };

    this.removeHeatmap = function(heatmap) {

        if (!_ready) {
            var index = _pendingHeatmaps.indexOf(heatmap);
            if (index > -1) {
                _pendingHeatmaps.splice(index, 1);
            }
            return;
        }

        var heatmapId = Object.keys(_heatmapIdToHeatmap).find(function(key) {
                return _heatmapIdToHeatmap[key] === heatmap;
            }
        );

        if (heatmapId === undefined) {
            return;
        }

        _emscriptenApi.heatmapApi.destroyHeatmap(heatmapId);
        delete _heatmapIdToHeatmap[heatmapId];
    };

    this.onUpdate = function() {
        if (_ready) {
            Object.keys(_heatmapIdToHeatmap).forEach(function(heatmapId) {
                var heatmap = _heatmapIdToHeatmap[heatmapId];
                _emscriptenApi.heatmapApi.updateNativeState(heatmapId, heatmap);
            });
        }
    };

    this.onInitialized = function() {
        _ready = true;
        _createPendingHeatmaps();
    };
}
HeatmapModule.prototype = MapModule;

module.exports = HeatmapModule;
