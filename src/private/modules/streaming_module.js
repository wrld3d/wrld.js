import { EmscriptenApi } from "../emscripten_api/emscripten_api";
import MapModule from "./map_module";
import L from "leaflet"


export function StreamingModuleImpl(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _notifyStreamingCompletedCallback = null;

    this.onInitialized = () => {
        _ready = true;
        console.log("_emscriptenApi.streamingApi")
        _emscriptenApi.streamingApi.registerStreamingCompletedCallback(_executeStreamingCompleteCallback);
    };

    this.isReady = () => _ready;

    this.setStreamingCompletedCallback = (callback) => {
        _notifyStreamingCompletedCallback = callback;
    };

    var _executeStreamingCompleteCallback = () => {
      console.log("_executeStreamingCompleteCallback FIRE")
       _notifyStreamingCompletedCallback();
    };
  }

function StreamingModule(emscriptenApi) {
    var _StreamingModuleImpl = new StreamingModuleImpl(emscriptenApi);
    var _this = this;

    var _streamingCompletedHandler = () => {
        console.log("streamingcompleted FIRE")
        this.fire("streamingcompleted", {})
    };

    this.onInitialized = () => {
        console.log("StreamingModule onInitialized")
        _StreamingModuleImpl.setStreamingCompletedCallback(_streamingCompletedHandler);
        _StreamingModuleImpl.onInitialized();
    };

    this._getImpl = () => _StreamingModuleImpl;
}

var StreamingModulePrototype = L.extend({}, MapModule, L.Mixin.Events);

StreamingModule.prototype = StreamingModulePrototype;

export default StreamingModule;