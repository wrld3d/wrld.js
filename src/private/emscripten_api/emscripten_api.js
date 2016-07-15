var EmscriptenAnnotationsApi = require("./emscripten_screen_point_mapping_api.js");
var EmscriptenGeofenceApi = require("./emscripten_geofence_api.js");
var EmscriptenIndoorsApi = require("./emscripten_indoors_api.js");
var EmscriptenPrecacheApi = require("./emscripten_precache_api.js");
var EmscriptenSpacesApi = require("./emscripten_spaces_api.js");
var EmscriptenThemesApi = require("./emscripten_themes_api.js");
var EmscriptenCameraApi = require("./emscripten_camera_api.js");
var EmscriptenExpandFloorsApi = require("./emscripten_expand_floors_api.js");


function EmscriptenApi(emscriptenModule) {

    var _emscriptenModule = emscriptenModule;
    var _ready = false;
    var _apiPointer = null;

    this.screenPointMappingApi = null;
    this.geofenceApi = null;
    this.indoorsApi = null;
    this.precacheApi = null;
    this.spacesApi = null;
    this.themesApi = null;
    this.cameraApi = null;
    this.expandFloorsApi = null;

    this.onInitialized = function(apiPointer, onUpdateCallback, onDrawCallback, onInitialStreamingCompletedCallback) {
        _apiPointer = apiPointer;
        var cwrap = _emscriptenModule.cwrap;

        this.screenPointMappingApi = new EmscriptenAnnotationsApi(_apiPointer, cwrap);
        this.geofenceApi = new EmscriptenGeofenceApi(_apiPointer, cwrap);
        this.indoorsApi = new EmscriptenIndoorsApi(_apiPointer, cwrap);
        this.precacheApi = new EmscriptenPrecacheApi(_apiPointer, cwrap);
        this.spacesApi = new EmscriptenSpacesApi(_apiPointer, cwrap);
        this.themesApi = new EmscriptenThemesApi(_apiPointer, cwrap);
        this.cameraApi = new EmscriptenCameraApi(_apiPointer, cwrap);
        this.expandFloorsApi = new EmscriptenExpandFloorsApi(_apiPointer, cwrap);

        var _setTopLevelCallbacks = _emscriptenModule.cwrap("setTopLevelCallbacks", null, ["number", "number", "number", "number"]);
        _setTopLevelCallbacks(_apiPointer, Runtime.addFunction(onUpdateCallback), Runtime.addFunction(onDrawCallback), Runtime.addFunction(onInitialStreamingCompletedCallback));
        _ready = true;
    };

    this.ready = function() {
        return _ready;
    };
}

module.exports = EmscriptenApi;