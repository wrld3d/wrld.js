var EmscriptenMemory = require("./emscripten_memory");
var EmscriptenGeofenceApi = require("./emscripten_geofence_api.js");
var EmscriptenIndoorsApi = require("./emscripten_indoors_api.js");
var EmscriptenPrecacheApi = require("./emscripten_precache_api.js");
var EmscriptenSpacesApi = require("./emscripten_spaces_api.js");
var EmscriptenThemesApi = require("./emscripten_themes_api.js");
var EmscriptenCameraApi = require("./emscripten_camera_api.js");
var EmscriptenExpandFloorsApi = require("./emscripten_expand_floors_api.js");
var EmscriptenHighlightApi = require("./emscripten_highlight_api.js");
var EmscriptenBuildingsApi = require("./emscripten_buildings_api.js");
var EmscriptenRenderingApi = require("./emscripten_rendering_api.js");
var EmscriptenLayerPointMappingApi = require("./emscripten_layer_point_mapping_api.js");

function EmscriptenApi(emscriptenModule) {

    var _emscriptenModule = emscriptenModule;
    var _ready = false;
    var _eegeoApiPointer = null;
    var _emscriptenApiPointer = null;

    this.geofenceApi = null;
    this.indoorsApi = null;
    this.precacheApi = null;
    this.spacesApi = null;
    this.themesApi = null;
    this.cameraApi = null;
    this.expandFloorsApi = null;
    this.highlightApi = null;
    this.renderingApi = null;
    this.buildingsApi = null;
    this.layerPointMappingApi = null;

    this.onInitialized = function(eegeoApiPointer, emscriptenApiPointer, onUpdateCallback, onDrawCallback, onInitialStreamingCompletedCallback) {
        _eegeoApiPointer = eegeoApiPointer;
        _emscriptenApiPointer = emscriptenApiPointer;

        var cwrap = _emscriptenModule.cwrap;
        var runtime = _emscriptenModule.Runtime;

        var emscriptenMemory = new EmscriptenMemory(_emscriptenModule);

        // standard eegeo api usage via eegeo api pointer
        this.geofenceApi = new EmscriptenGeofenceApi(_eegeoApiPointer, cwrap, runtime, _emscriptenModule);
        this.precacheApi = new EmscriptenPrecacheApi(_eegeoApiPointer, cwrap, runtime);
        this.spacesApi = new EmscriptenSpacesApi(_eegeoApiPointer, cwrap, runtime, emscriptenMemory);
        this.themesApi = new EmscriptenThemesApi(_eegeoApiPointer, cwrap, runtime);        
        this.expandFloorsApi = new EmscriptenExpandFloorsApi(_eegeoApiPointer, cwrap, runtime);
        this.highlightApi = new EmscriptenHighlightApi(_eegeoApiPointer, cwrap, runtime, emscriptenMemory);
        this.renderingApi = new EmscriptenRenderingApi(_eegeoApiPointer, cwrap, runtime, emscriptenMemory);

        // emscripten-specific api usage via emscripten api pointer
        this.layerPointMappingApi = new EmscriptenLayerPointMappingApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.buildingsApi = new EmscriptenBuildingsApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.indoorsApi = new EmscriptenIndoorsApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.cameraApi = new EmscriptenCameraApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);

        var _setTopLevelCallbacks = _emscriptenModule.cwrap("setTopLevelCallbacks", null, ["number", "number", "number", "number"]);
        _setTopLevelCallbacks(
            _eegeoApiPointer,
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