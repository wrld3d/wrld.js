export function EmscriptenStreamingApi(emscriptenApiPointer, cwrap, emscriptenModule) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    
    var _streamingApi_SetStreamingCompletedCallback = cwrap("streamingApi_SetStreamingCompletedCallback", "number", ["number", "number"]);
    var _streamingApi_SetStreamingStartedCallback = cwrap("streamingApi_SetStreamingStartedCallback", "number", ["number", "number"]);

    this.registerStreamingCompletedCallback = (callback) => {
        _streamingApi_SetStreamingCompletedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback, "v"));
    };

    this.registerStreamingStartedCallback = (callback) => {
        _streamingApi_SetStreamingStartedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback, "v"));
    };
}
export default EmscriptenStreamingApi;
