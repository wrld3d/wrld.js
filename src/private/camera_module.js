var MapModule = require("./map_module");
var space = require("../public/space");

var CameraModule = function(emscriptenApi, startLatLng, initialZoom) {
    var _emscriptenApi = emscriptenApi;
    var _ready = false;
    var _pendingSetViewData = null;
    var _pendingSetViewToBoundsData = null;
    var _center = startLatLng;
    var _initialZoom = initialZoom;


    var _setView = function(config) {
        if ("zoom" in config) {
            config.distance = space.zoomToDistance(config.zoom);
        }

        if (_ready) {
            _emscriptenApi.cameraApi.setView(config);
        }
        else {
            if(_pendingSetViewData === null) {
              _pendingSetViewData = {};
            }
            else {
              _pendingSetViewData = Object.assign(_pendingSetViewData, config);
            }
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
            _center = cameraApi.getInterestLatLong();
        }
        else {
            _center = _pendingSetViewData["location"] || _center;
        }
        return _center;
    };

    var _getDistanceToInterest = function() {
        if (_ready) {
            return _emscriptenApi.cameraApi.getDistanceToInterest();
        }
        else {
          if ("zoom" in _pendingSetViewData) {
            return space.zoomToDistance(_pendingSetViewData["zoom"]) || -1;
          }
          else {
            return space.zoomToDistance(_initialZoom) || -1;
          }
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
    
    var _getTiltDegrees = function() {
      if (_ready) {
          return 90 - _emscriptenApi.cameraApi.getPitchDegrees();
      }
      else {
          return 0;
      }
    };
    
    var _setTiltDegrees = function(pitch) {
        _setView({"tiltDegrees":pitch, animate: true});
    };

    var _getHeadingDegrees = function() {
        if (_ready) {
            return _emscriptenApi.cameraApi.getHeadingDegrees();
        }
        else {
            return _pendingSetViewData["headingDegrees"] || 0;
        }
    };
    
    var _setHeadingDegrees = function(heading) {
        return _setView({"headingDegrees":heading, "animate":true});
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
    
    this.getTiltDegrees = function() {
      return _getTiltDegrees();
    };
    
    this.setTiltDegrees = function(pitch) {
      return _setTiltDegrees(pitch);
    };

    this.getHeadingDegrees = function() {
        return _getHeadingDegrees();
    };
    
    this.setHeadingDegrees = function(heading) {
      return _setHeadingDegrees(heading);
    };
};

CameraModule.prototype = MapModule;
module.exports = CameraModule;