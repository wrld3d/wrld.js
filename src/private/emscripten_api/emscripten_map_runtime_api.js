function EmscriptenMapRuntimeApi(eegeoApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _pauseWebgl = cwrap("webglPause", null, ["number"]);
    var _resumeWebgl = cwrap("webglResume", null, ["number"]);
    var _removeWebgl = cwrap("webglRemove", null, ["number"]);

    this.onPause = function() {
        _pauseWebgl(_eegeoApiPointer);
    };

    this.onResume = function() {
        _resumeWebgl(_eegeoApiPointer);
    };

    this.onRemove = function() {
        _removeWebgl(_eegeoApiPointer);
    };

}

module.exports = EmscriptenMapRuntimeApi;