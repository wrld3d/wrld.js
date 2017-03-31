var MapModule = require("./map_module");
var space = require("../public/space");

var CameraModule = function(emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _ready = false;
    var _pendingSetViewData = null;
    var _pendingSetViewToBoundsData = null;
    var _shouldFlushPendingViewOperations = false;


    var _setView = function(config) {
        if ("zoom" in config) {
            config.distance = space.zoomToDistance(config.zoom);
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

    var _getNearestZoomLevelAbove = function() {
        if (_ready) {
            var cameraApi = _emscriptenApi.cameraApi;
            var distanceToInterest = cameraApi.getDistanceToInterest();
            return space.nearestZoomAbove(distanceToInterest);
        }
        else {
            return _pendingSetViewData["zoom"] || -1;
        }
    };

    var _getNearestZoomLevelBelow = function() {
        if (_ready) {
            var cameraApi = _emscriptenApi.cameraApi;
            var distanceToInterest = cameraApi.getDistanceToInterest();
            return space.nearestZoomBelow(distanceToInterest);
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
            return space.zoomToDistance(_pendingSetViewData["zoom"]) || -1;
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
        return space.zoomToDistance(zoomLevel);
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