function EmscriptenMapRuntimeApi(eegeoApiPointer, cwrap, runtime, emscriptenModule) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _pauseWebgl = cwrap("webglPause", null, ["number"]);
    var _resumeWebgl = cwrap("webglResume", null, ["number"]);

    this.onPause = function() {
        _pauseWebgl(_eegeoApiPointer);
    };

    this.onResume = function() {
        _resumeWebgl(_eegeoApiPointer);
    };

}

module.exports = EmscriptenMapRuntimeApi;