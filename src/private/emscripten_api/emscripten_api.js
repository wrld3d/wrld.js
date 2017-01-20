var EmscriptenAnnotationsApi = require("./emscripten_screen_point_mapping_api.js");
var EmscriptenGeofenceApi = require("./emscripten_geofence_api.js");
var EmscriptenIndoorsApi = require("./emscripten_indoors_api.js");
var EmscriptenPrecacheApi = require("./emscripten_precache_api.js");
var EmscriptenSpacesApi = require("./emscripten_spaces_api.js");
var EmscriptenThemesApi = require("./emscripten_themes_api.js");
var EmscriptenCameraApi = require("./emscripten_camera_api.js");
var EmscriptenExpandFloorsApi = require("./emscripten_expand_floors_api.js");
var EmscriptenHighlightApi = require("./emscripten_highlight_api.js");
var EmscriptenGraphicsApi = require("./emscripten_graphics_api.js");


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
    this.highlightApi = null;
    this.graphicsApi = null;

    this.onInitialized = function(apiPointer, onUpdateCallback, onDrawCallback, onInitialStreamingCompletedCallback) {
        _apiPointer = apiPointer;
        var cwrap = _emscriptenModule.cwrap;
        var runtime = _emscriptenModule.Runtime;

        this.screenPointMappingApi = new EmscriptenAnnotationsApi(_apiPointer, cwrap, runtime);
        this.geofenceApi = new EmscriptenGeofenceApi(_apiPointer, cwrap, runtime);
        this.indoorsApi = new EmscriptenIndoorsApi(_apiPointer, cwrap, runtime);
        this.precacheApi = new EmscriptenPrecacheApi(_apiPointer, cwrap, runtime);
        this.spacesApi = new EmscriptenSpacesApi(_apiPointer, cwrap, runtime);
        this.themesApi = new EmscriptenThemesApi(_apiPointer, cwrap, runtime);
        this.cameraApi = new EmscriptenCameraApi(_apiPointer, cwrap, runtime);
        this.expandFloorsApi = new EmscriptenExpandFloorsApi(_apiPointer, cwrap, runtime);
        this.highlightApi = new EmscriptenHighlightApi(_apiPointer, cwrap, runtime);
        this.graphicsApi = new EmscriptenGraphicsApi(_apiPointer, cwrap, runtime);

        var _setTopLevelCallbacks = _emscriptenModule.cwrap("setTopLevelCallbacks", null, ["number", "number", "number", "number"]);
        _setTopLevelCallbacks(
            _apiPointer, 
            runtime.addFunction(onUpdateCallback), 
            runtime.addFunction(onDrawCallback), 
            runtime.addFunction(onInitialStreamingCompletedCallback)
        );
        _ready = true;
    };

    this.ready = function() {
        return _ready;
    };
}

module.exports = EmscriptenApi;