export function EmscriptenStreamingApi(emscriptenApiPointer, cwrap, emscriptenModule) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    
    var _streamingApi_SetStreamingCompletedCallback = cwrap("streamingApi_SetStreamingCompletedCallback", null, ["number", "number"]);
    var _streamingApi_SetBasicStreamingCompletedCallback = cwrap("streamingApi_SetBasicStreamingCompletedCallback", null, ["number", "number"]);
    var _streamingApi_SetStreamingStartedCallback = cwrap("streamingApi_SetStreamingStartedCallback", null, ["number", "number"]);

    var _streamingApi_IsStreamingCompleted = cwrap("streamingApi_IsStreamingCompleted", "number", [ "number"]);
    var _streamingApi_IsBasicStreamingCompleted = cwrap("streamingApi_IsBasicStreamingCompleted", "number", [ "number"]);

    this.registerStreamingCompletedCallback = (callback) => {
        _streamingApi_SetStreamingCompletedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback, "v"));
    };

    this.registerBasicStreamingCompletedCallback = (callback) => {
        _streamingApi_SetBasicStreamingCompletedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback, "v"));
    };

    this.registerStreamingStartedCallback = (callback) => {
        _streamingApi_SetStreamingStartedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback, "v"));
    };

    this.isStreamingCompleted = (callback) => {
        return _streamingApi_IsStreamingCompleted(_emscriptenApiPointer);
    };

    this.isBasicStreamingCompleted = (callback) => {
        return _streamingApi_IsBasicStreamingCompleted(_emscriptenApiPointer);
    };
}
export default EmscriptenStreamingApi;
