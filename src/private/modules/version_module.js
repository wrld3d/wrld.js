import MapModule from "./map_module";

export function VersionModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _ready = false;

    this.getVersion = () => {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.versionApi.getPlatformVersion();
    };

    this.getVersionHash = () => {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.versionApi.getPlatformVersionHash();
    };

    this.onInitialized = () => {
        _ready = true;
    };

}

VersionModule.prototype = MapModule;

export default VersionModule;
