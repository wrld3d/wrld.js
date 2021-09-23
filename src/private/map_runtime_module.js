import MapModule from "./map_module";

export function MapRuntimeModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _ready = false;

    this.Pause = () => {
        if (_ready) {
            _emscriptenApi.mapRuntimeApi.onPause();
        }
    };

    this.Resume = () => {
        if (_ready) {
            _emscriptenApi.mapRuntimeApi.onResume();
        }
    };

    this.Remove = () => {
        if (_ready) {
            _emscriptenApi.mapRuntimeApi.onRemove();
        }
    };

    this.onInitialized = () => {
        _ready = true;
    };
}

MapRuntimeModule.prototype = MapModule;

export default MapRuntimeModule;
