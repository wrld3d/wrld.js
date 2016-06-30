var MapModule = require("./map_module");
var ScreenPointMapping = require("./screen_point_mapping");

var ScreenPointMappingModule = function(emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _ready = false;

    var _screenPointMappings = {};

    this.addLayer = function(layer) {
        var id = L.stamp(layer);
        if (id in _screenPointMappings) {
            return;
        }

        var screenPointMapping = new ScreenPointMapping(layer);
        _screenPointMappings[id] = screenPointMapping;

        if (_ready) {
            _emscriptenApi.screenPointMappingApi.createScreenPointMapping(id, screenPointMapping);
        }
    };

    this.removeLayer = function(layer) {
        var id = L.stamp(layer);

        if (id in _screenPointMappings) {
            delete _screenPointMappings[id];

            if (_ready) {
                _emscriptenApi.screenPointMappingApi.removeScreenPointMapping(id);
            }
        }
    };

    this.tryGetScreenPositionOfLayer = function(layer) {
        var id = L.stamp(layer);

        if (id in _screenPointMappings) {
            var screenPointMapping = _screenPointMappings[id];
            return screenPointMapping.getCanvasPos();
        }
        return null;
    };

    this.onDraw = function() {
        if (!_ready) {
            return;
        }

        var api = _emscriptenApi.screenPointMappingApi;
        for (var id in _screenPointMappings) {
            var screenPointMapping = _screenPointMappings[id];
            var screenPos = api.getScreenPosition(id);
            screenPointMapping.setCanvasPos(screenPos);
        }
    };

    this.onInitialised = function() {
        _ready = true;
        _createScreenPointMappings();
    };

    var _createScreenPointMappings = function() {
        var api = _emscriptenApi.screenPointMappingApi;
        for (var id in _screenPointMappings) {
            api.createScreenPointMapping(id, _screenPointMappings[id]);
        }
    };

};
ScreenPointMappingModule.prototype = MapModule;

module.exports = ScreenPointMappingModule;