var MapModule = require("./map_module");

function VersionModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _ready = false;

    this.getVersion = function() {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.versionApi.getPlatformVersion();
    };

    this.getVersionHash = function() {
        if (!_ready) {
            return null;
        }
        return _emscriptenApi.versionApi.getPlatformVersionHash();
    };

    this.onInitialized = function() {
        _ready = true;
    };

}
VersionModule.prototype = MapModule;

module.exports = VersionModule;
