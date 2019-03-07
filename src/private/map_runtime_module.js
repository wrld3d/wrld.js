var MapModule = require("./map_module");

function MapRuntimeModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _ready = false;

    this.Pause = function() {
        if(_ready){
            _emscriptenApi.mapRuntimeApi.onPause();
        }
    };

    this.Resume = function() {
        if(_ready){
            _emscriptenApi.mapRuntimeApi.onResume();
        }
    };

    this.onInitialized = function() {
        _ready = true;
    };
}
MapRuntimeModule.prototype = MapModule;

module.exports = MapRuntimeModule;
