import MapModule from "./map_module";

export function FrameRateModule(
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

    this.onInitialized = () => {
        _emscriptenApi.frameRateApi.setTargetVSyncInterval(_targetVSyncInterval);
        _emscriptenApi.frameRateApi.setThrottledTargetFrameInterval(_throttledTargetFrameIntervalMilliseconds);
        _emscriptenApi.frameRateApi.setIdleSecondsBeforeThrottle(_idleSecondsBeforeThrottle);
        _emscriptenApi.frameRateApi.setThrottleWhenIdleEnabled(_throttleWhenIdleEnabled);
        _ready = true;
    };

    this.ready = () => _ready;

    this.setTargetVSyncInterval = (targetVSyncInterval) => {
        _targetVSyncInterval = targetVSyncInterval;
        if (!_ready) {
            return;
        }
        _emscriptenApi.frameRateApi.setTargetVSyncInterval(_targetVSyncInterval);
    };

    this.setThrottledTargetFrameInterval = (throttledTargetFrameIntervalMilliseconds) => {
        _throttledTargetFrameIntervalMilliseconds = throttledTargetFrameIntervalMilliseconds;
        if (!_ready) {
            return;
        }
        _emscriptenApi.frameRateApi.setThrottledTargetFrameInterval(_throttledTargetFrameIntervalMilliseconds);
    };

    this.setIdleSecondsBeforeThrottle = (idleSecondsBeforeThrottle) => {
        _idleSecondsBeforeThrottle = idleSecondsBeforeThrottle;
        if (!_ready) {
            return;
        }
        _emscriptenApi.frameRateApi.setIdleSecondsBeforeThrottle(_idleSecondsBeforeThrottle);
    };

    this.setThrottleWhenIdleEnabled = (throttleWhenIdleEnabled) => {
        _throttleWhenIdleEnabled = throttleWhenIdleEnabled;
        if (!_ready) {
            return;
        }
        _emscriptenApi.frameRateApi.setThrottleWhenIdleEnabled(_throttleWhenIdleEnabled);
    };

    this.cancelThrottle = () => {
        // don't attempt to defer command if called during startup
        if (!_ready) {
            return;
        }
        _emscriptenApi.frameRateApi.cancelThrottle();
    };
}

FrameRateModule.prototype = MapModule;

export default FrameRateModule;
