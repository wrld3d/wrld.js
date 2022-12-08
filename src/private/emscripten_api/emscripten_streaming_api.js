export function EmscriptenStreamingApi(emscriptenApiPointer, cwrap, emscriptenModule) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    
    var _streamingApi_SetStreamingCompletedCallback = cwrap("streamingApi_SetStreamingCompletedCallback", "number", ["number", "number"]);

    this.registerStreamingCompletedCallback = (callback) => {
        _streamingApi_SetStreamingCompletedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback, "v"));
    };
}

export default EmscriptenStreamingApi;
