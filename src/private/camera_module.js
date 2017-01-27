var MapModule = require("./map_module");

var CameraModule = function(emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _ready = false;
    var _pendingSetViewData = null;
    var _pendingSetViewToBoundsData = null;
    var _shouldFlushPendingViewOperations = false;

    var _altitudes = [
        // Judging by Leaflet, approx = 2.74287e7 * Math.exp(-0.622331 * zoomLevel)
        27428700,
        14720762,
        8000000,
        4512909,
        2087317,
        1248854,
        660556,
        351205,
        185652,
        83092,
        41899,
        21377,
        11294,
        5818,
        3106,
        1890,
        1300,
        821,
        500,
        300,
        108,
        58,
        31,
        17,
        9,
        5
    ];

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

    var _getPitchDegrees = function() {
        if (_ready) {
            return _emscriptenApi.cameraApi.getPitchDegrees();
        }
        else {
            return 0;
        }
    };

    var _getHeadingDegrees = function() {
        if (_ready) {
            return _emscriptenApi.cameraApi.getHeadingDegrees();
        }
        else {
            return _pendingSetViewData["headingDegrees"] || 0;
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

    this.getCenter = function() {
        return L.latLng(_getCenter());
    };

    this.getDistanceToInterest = function() {
        return _getDistanceToInterest();
    };

    this.getPitchDegrees = function() {
        return _getPitchDegrees();
    };

    this.getHeadingDegrees = function() {
        return _getHeadingDegrees();
    };
};

CameraModule.prototype = MapModule;
module.exports = CameraModule;