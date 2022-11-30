export function EmscriptenStreamingApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    
    var _streamingApi_SetStreamingCompletedCallback = cwrap("streamingApi_SetStreamingCompletedCallback", "number", ["number", "number"]);

    this.registerStreamingCompletedCallback = (callback) => {
        console.log("EmscriptenStreamingApi.registerStreamingCompletedCallback")
        _streamingApi_SetStreamingCompletedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback, "v"));
    };
}

export default EmscriptenStreamingApi;
