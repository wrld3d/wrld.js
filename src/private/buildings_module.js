var MapModule = require("./map_module");

function BuildingsModule(emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _ready = false;
    
    this.getBuildingFootprintAtLocation = function(latitude, longitude, altitude, callback) {
        if(_ready) {
            _emscriptenApi.buildingsApi.getBuildingFootprintAtLocation(latitude, longitude, altitude, callback);
        }
    };

    this.onInitialized = function() {
        _ready = true;
        _emscriptenApi.buildingsApi.setEventCallback();
    };
}

BuildingsModule.prototype = MapModule;
module.exports = BuildingsModule;