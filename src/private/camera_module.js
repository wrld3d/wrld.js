var MapModule = require("./map_module");

var CameraModule = function(emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _ready = false;
    var _pendingSetViewData = null;
    var _pendingSetViewToBoundsData = null;

    var _zoomLevelToDistance = function(zoomLevel) {
        var altitudes = [
            5000000,
            2100000,
            1100000,
            520000,
            260000,
            130000,
            75000,
            60000,
            40000,
            25000,
            15000,  // lcm
            7500,   // detail roads, lod2 buildings
            2500,   // lod1 buildings
            750     // lod0 buildings
        ];
        if (zoomLevel >= altitudes.length) {
            return altitudes[altitudes.length - 1];
        }
        return altitudes[zoomLevel];
    };

    var _setView = function(config) {
        if ("zoom" in config) {
            config.distance = _zoomLevelToDistance(config.zoom);
        }
        if (_ready) {
            _emscriptenApi.cameraApi.setView(config);
        }
        else {
            _pendingSetViewData = config;
        }
    };

    var _setViewToBounds = function(config) {
        if (_ready) {
            _emscriptenApi.cameraApi.setViewToBounds(config);
        }
        else {
            _pendingSetViewToBoundsData = config;
        }
    };

    var _flushPendingViewOperations = function() {
        if (!_ready) {
            return;
        }

        if(_pendingSetViewData !== null) {
            _setView(_pendingSetViewData);
            _pendingSetViewData = null;
        }

        if(_pendingSetViewToBoundsData !== null) {
            _setViewToBounds(_pendingSetViewToBoundsData);
            _pendingSetViewToBoundsData = null;
        }
    };

    this.setView = function(config) {
        _setView(config);
    };

    this.setViewToBounds = function(config) {
        _setViewToBounds(config);
    };

    this.zoomLevelToDistance = function(zoomLevel) {
        return _zoomLevelToDistance(zoomLevel);
    };

    this.onInitialStreamingCompleted = function() {
        _ready = true;
        _flushPendingViewOperations();
    };
};

CameraModule.prototype = MapModule;
module.exports = CameraModule;