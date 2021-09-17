export function EmscriptenMapRuntimeApi(eegeoApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _pauseWebgl = cwrap("webglPause", null, ["number"]);
    var _resumeWebgl = cwrap("webglResume", null, ["number"]);
    var _removeWebgl = cwrap("webglRemove", null, ["number"]);

    this.onPause = () => {
        _pauseWebgl(_eegeoApiPointer);
    };

    this.onResume = () => {
        _resumeWebgl(_eegeoApiPointer);
    };

    this.onRemove = () => {
        _removeWebgl(_eegeoApiPointer);
    };

}

export default EmscriptenMapRuntimeApi;
