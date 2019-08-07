var MapModule = require("./map_module");


function FrameRateModule(
    emscriptenApi,
    targetVSyncInterval,
    throttledTargetFrameIntervalMilliseconds,
    idleSecondsBeforeThrottle,
    throttleWhenIdleEnabled
    ) {

    var _emscriptenApi = emscriptenApi;
    var _targetVSyncInterval = targetVSyncInterval;
    var _throttledTargetFrameIntervalMilliseconds = throttledTargetFrameIntervalMilliseconds;
    var _idleSecondsBeforeThrottle = idleSecondsBeforeThrottle;
    var _throttleWhenIdleEnabled = throttleWhenIdleEnabled;
    var _ready = false;

    this.onInitialized = function() {
        _emscriptenApi.frameRateApi.setTargetVSyncInterval(_targetVSyncInterval);
        _emscriptenApi.frameRateApi.setThrottledTargetFrameInterval(_throttledTargetFrameIntervalMilliseconds);
        _emscriptenApi.frameRateApi.setIdleSecondsBeforeThrottle(_idleSecondsBeforeThrottle);
        _emscriptenApi.frameRateApi.setThrottleWhenIdleEnabled(_throttleWhenIdleEnabled);
        _ready = true;
    };

    this.ready = function() {
        return _ready;
    };

    this.setTargetVSyncInterval = function(targetVSyncInterval) {
        _targetVSyncInterval = targetVSyncInterval;
        if (!_ready) {
            return;
        }
        _emscriptenApi.frameRateApi.setTargetVSyncInterval(_targetVSyncInterval);
    };

    this.setThrottledTargetFrameInterval = function(throttledTargetFrameIntervalMilliseconds) {
        _throttledTargetFrameIntervalMilliseconds = throttledTargetFrameIntervalMilliseconds;
        if (!_ready) {
            return;
        }
        _emscriptenApi.frameRateApi.setThrottledTargetFrameInterval(_throttledTargetFrameIntervalMilliseconds);
    };

    this.setIdleSecondsBeforeThrottle = function(idleSecondsBeforeThrottle) {
        _idleSecondsBeforeThrottle = idleSecondsBeforeThrottle;
        if (!_ready) {
            return;
        }
        _emscriptenApi.frameRateApi.setIdleSecondsBeforeThrottle(_idleSecondsBeforeThrottle);
    };

    this.setThrottleWhenIdleEnabled = function(throttleWhenIdleEnabled) {
        _throttleWhenIdleEnabled = throttleWhenIdleEnabled;
        if (!_ready) {
            return;
        }
        _emscriptenApi.frameRateApi.setThrottleWhenIdleEnabled(_throttleWhenIdleEnabled);
    };

    this.cancelThrottle = function() {
        // don't attempt to defer command if called during startup
        if (!_ready) {
            return;
        }
        _emscriptenApi.frameRateApi.cancelThrottle();
    };
}
FrameRateModule.prototype = MapModule;

module.exports = FrameRateModule;
