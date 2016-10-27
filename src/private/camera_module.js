var MapModule = require("./map_module");

var CameraModule = function(emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _ready = false;
    var _pendingSetViewData = null;
    var _pendingSetViewToBoundsData = null;
    var _shouldFlushPendingViewOperations = false;

    var _lodSwitchAltitudes = [
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
        750,    // lod0 buildings
        0
    ];

    var _altitudes = new Array(_lodSwitchAltitudes.length - 1);
    for(var i = 0; i < _lodSwitchAltitudes.length - 1; ++ i) {
        var top     = _lodSwitchAltitudes[i + 1];
        var bottom  = _lodSwitchAltitudes[i + 0];
        _altitudes[i] = bottom + ((top - bottom) * 0.5);
    }

    var _zoomLevelToDistance = function(zoomLevel) {
        if(zoomLevel < 0) {
            return _altitudes[0];
        }

        if (zoomLevel >= _altitudes.length) {
            return _altitudes[_altitudes.length - 1];
        }
        return _altitudes[zoomLevel];
    };

    var _setView = function(config) {
        if ("zoom" in config) {
            config.distance = _zoomLevelToDistance(config.zoom);
        }

        if (_ready) {
            _emscriptenApi.cameraApi.setView(config);
        }
        else {
            if (_pendingSetViewData !== null) {
               _shouldFlushPendingViewOperations = true;
            }
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

    var _getCurrentZoomLevel = function(comparisonFunc) {
        var cameraApi = _emscriptenApi.cameraApi;
        var distanceToInterest = cameraApi.getDistanceToInterest();
        return _altitudes.findIndex(function(currentAltitude) {
            return comparisonFunc(distanceToInterest, currentAltitude);
        });
    };

    var _getNearestZoomLevelAbove = function() {
        if (_ready) {
            var index = _getCurrentZoomLevel(function(a, b) { return a > b; });
            return index > -1 ? Math.min(index - 1, _altitudes.length -1) : _altitudes.length - 1;
        }
        else {
            return _pendingSetViewData["zoom"] || -1;
        }
    };

    var _getNearestZoomLevelBelow = function() {
        if (_ready) {
            var index = _getCurrentZoomLevel(function(a, b) { return a >= b; });
            return index > -1 ? Math.max(0, Math.min(index, _altitudes.length -1)) : _altitudes.length;
        }
        else {
            return _pendingSetViewData["zoom"] || -1;
        }
    };

    var _getCenter = function() {
        if (_ready) {
            var cameraApi = _emscriptenApi.cameraApi;
            return cameraApi.getInterestLatLong();
        }
        else {
            return _pendingSetViewData["location"] || [-1, -1];
        }
    };

    var _getDistanceToInterest = function() {
        if (_ready) {
            return _emscriptenApi.cameraApi.getDistanceToInterest();
        }
        else {
            return _zoomLevelToDistance(_pendingSetViewData["zoom"]) || -1;
        }
    };

    var _flushPendingViewOperations = function() {
        if (!_ready) {
            return;
        }

        if(_pendingSetViewData !== null) {
            if (_shouldFlushPendingViewOperations) {
                _setView(_pendingSetViewData);
            }
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

    this.getCurrentZoomLevel = function() {
        return Math.max(0, _getNearestZoomLevelAbove());
    };

    this.getNearestZoomLevelAbove = function() {
        return _getNearestZoomLevelAbove();
    };

    this.getNearestZoomLevelBelow = function() {
        return _getNearestZoomLevelBelow();
    };

    this.getMaxZoomLevel = function() {
        return _altitudes.length - 1;
    };

    this.getCenter = function() {
        return L.latLng(_getCenter());
    };

    this.getDistanceToInterest = function() {
        return _getDistanceToInterest();
    };
};

CameraModule.prototype = MapModule;
module.exports = CameraModule;