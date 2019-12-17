function EmscriptenFrameRateApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;

    var _frameRateApi_SetTargetVSyncInterval = cwrap("frameRateApi_SetTargetVSyncInterval", null, ["number", "number"]);
    var _frameRateApi_SetThrottledTargetFrameInterval = cwrap("frameRateApi_SetThrottledTargetFrameInterval", null, ["number", "number"]);
    var _frameRateApi_SetIdleSecondsBeforeThrottle = cwrap("frameRateApi_SetIdleSecondsBeforeThrottle", null, ["number", "number"]);
    var _frameRateApi_SetThrottleWhenIdleEnabled = cwrap("frameRateApi_SetThrottleWhenIdleEnabled", null, ["number", "number"]);
    var _frameRateApi_CancelThrottle = cwrap("frameRateApi_CancelThrottle", null, ["number"]);

    this.setTargetVSyncInterval = function(targetVSyncInterval) {
        _frameRateApi_SetTargetVSyncInterval(_emscriptenApiPointer, targetVSyncInterval);
    };

    this.setThrottledTargetFrameInterval = function(throttledTargetFrameIntervalMS) {
        _frameRateApi_SetThrottledTargetFrameInterval(_emscriptenApiPointer, throttledTargetFrameIntervalMS);
    };

    this.setIdleSecondsBeforeThrottle = function(idleSecondsBeforeThrottle) {
        _frameRateApi_SetIdleSecondsBeforeThrottle(_emscriptenApiPointer, idleSecondsBeforeThrottle);
    };

    this.setThrottleWhenIdleEnabled = function(enabled) {
        _frameRateApi_SetThrottleWhenIdleEnabled(_emscriptenApiPointer, enabled ? 1 : 0);
    };

    this.cancelThrottle = function() {
        _frameRateApi_CancelThrottle(_emscriptenApiPointer);
    };

}

module.exports = EmscriptenFrameRateApi;