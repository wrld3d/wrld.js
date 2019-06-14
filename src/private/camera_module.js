var MapModule = require("./map_module");

var CameraModule = function(
    emscriptenApi,
    startLatLng,
    initialZoom,
    viewVerticallyLocked
    ) {
    var _emscriptenApi = emscriptenApi;
    var _ready = false;
    var _pendingSetViewData = null;
    var _pendingSetViewToBoundsData = null;
    var _center = startLatLng;
    var _isVerticallyLocked = viewVerticallyLocked;


    var _setView = function(config) {
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
            //Can't convert zoom level to distance before the api is loaded.
          return 0.0;
        }
    };

    var _getPitchDegrees = function() {
        if (_ready) {
            return _emscriptenApi.cameraApi.getPitchDegrees();
        }
        else {
            return 0.0;
        }
    };

    var _getTiltDegrees = function() {
      if (_ready) {
          return 90.0 - _emscriptenApi.cameraApi.getPitchDegrees();
      }
      else {
          return 0.0;
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
            return parseFloat(_pendingSetViewData["headingDegrees"]) || 0.0;
        }
    };

    var _setHeadingDegrees = function(heading) {
        return _setView({"headingDegrees":heading, "animate":true});
    };

    var _setVerticallyLocked = function(isVerticallyLocked) {
        _isVerticallyLocked = isVerticallyLocked;
        if (!_ready) {
            return;
        }
        _emscriptenApi.cameraApi.setVerticallyLocked(_isVerticallyLocked);
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

    var _getZoomLevel = function() {
         if (_ready) {
            return _emscriptenApi.cameraApi.getZoomLevel();
        }
        else {
            return  parseFloat(_pendingSetViewData["zoom"]) || 0.0;
        }
    };


    this.setView = function(config) {
        _setView(config);
    };

    this.setViewToBounds = function(config) {
        _setViewToBounds(config);
    };

    this.onInitialized = function() {
        _ready = true;
        _setVerticallyLocked(_isVerticallyLocked);
        _flushPendingViewOperations();
    };

    this.getCurrentZoomLevel = function() {
        return _getZoomLevel();
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

    this.setVerticallyLocked = function(isVerticallyLocked) {
         _setVerticallyLocked(isVerticallyLocked);
    };
};

CameraModule.prototype = MapModule;
module.exports = CameraModule;