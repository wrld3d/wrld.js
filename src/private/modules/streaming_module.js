
import MapModule from "./map_module";
import L from "leaflet";


export function StreamingModuleImpl(emscriptenApi) {
    var _ready = false;
    var _emscriptenApi = emscriptenApi;
    var _notifyStreamingCompletedCallback = null;
    var _notifyBasicStreamingCompletedCallback = null;
    var _notifyStreamingStartedCallback = null;

    this.onInitialized = () => {
        _ready = true;
        _emscriptenApi.streamingApi.registerStreamingCompletedCallback(_executeStreamingCompletedCallback);
        _emscriptenApi.streamingApi.registerBasicStreamingCompletedCallback(_executeBasicStreamingCompletedCallback);
        _emscriptenApi.streamingApi.registerStreamingStartedCallback(_executeStreamingStartedCallback);
    };

    this.isReady = () => _ready;

    this.setStreamingCompletedCallback = (callback) => {
        _notifyStreamingCompletedCallback = callback;
    };

    this.setBasicStreamingCompletedCallback = (callback) => {
        _notifyBasicStreamingCompletedCallback = callback;
    };

    this.setStreamingStartedCallback = (callback) => {
        _notifyStreamingStartedCallback = callback;
    };

    this.isStreamingCompleted = () => {
        return _emscriptenApi.streamingApi.isStreamingCompleted();
    };

    this.isBasicStreamingCompleted = () => {
        return _emscriptenApi.streamingApi.isBasicStreamingCompleted();
    };

    var _executeStreamingCompletedCallback = () => {
       _notifyStreamingCompletedCallback();
    };

    var _executeBasicStreamingCompletedCallback = () => {
        _notifyBasicStreamingCompletedCallback();
     };

    var _executeStreamingStartedCallback = () => {
        _notifyStreamingStartedCallback();
     };
  }

export function StreamingModule(emscriptenApi) {
    var _StreamingModuleImpl = new StreamingModuleImpl(emscriptenApi);
    var _this = this;

    var _streamingCompletedHandler = () => {
        _this.fire("streamingcompleted", {});
    };

    var _basicStreamingCompletedHandler = () => {
        _this.fire("basicstreamingcompleted", {});
    };

    var _streamingStartedHandler = () => {
        _this.fire("streamingstarted", {});
    };

    this.onInitialized = () => {
        _StreamingModuleImpl.setStreamingCompletedCallback(_streamingCompletedHandler);
        _StreamingModuleImpl.setBasicStreamingCompletedCallback(_basicStreamingCompletedHandler);
        _StreamingModuleImpl.setStreamingStartedCallback(_streamingStartedHandler);
        _StreamingModuleImpl.onInitialized();
    };

    this.isStreamingComplete = () => {
        return _StreamingModuleImpl.isStreamingCompleted()? true : false;
    };

    this.isBasicStreamingComplete = () => {
        return _StreamingModuleImpl.isBasicStreamingCompleted() ? true : false;
    };

    this._getImpl = () => _StreamingModuleImpl;
}

var StreamingModulePrototype = L.extend({}, MapModule, L.Mixin.Events);

StreamingModule.prototype = StreamingModulePrototype;

export default StreamingModule;
