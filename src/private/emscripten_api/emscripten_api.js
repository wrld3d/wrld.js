var EmscriptenMemory = require("./emscripten_memory");
var EmscriptenGeofenceApi = require("./emscripten_geofence_api.js");
var EmscriptenIndoorsApi = require("./emscripten_indoors_api.js");
var EmscriptenPrecacheApi = require("./emscripten_precache_api.js");
var EmscriptenSpacesApi = require("./emscripten_spaces_api.js");
var EmscriptenThemesApi = require("./emscripten_themes_api.js");
var EmscriptenCameraApi = require("./emscripten_camera_api.js");
var EmscriptenExpandFloorsApi = require("./emscripten_expand_floors_api.js");
var EmscriptenIndoorEntityApi = require("./emscripten_indoor_entity_api.js");
var EmscriptenBuildingsApi = require("./emscripten_buildings_api.js");
var EmscriptenRenderingApi = require("./emscripten_rendering_api.js");
var EmscriptenLayerPointMappingApi = require("./emscripten_layer_point_mapping_api.js");
var EmscriptenPropsApi = require("./emscripten_props_api.js");
var EmscriptenIndoorMapEntityInformationApi = require("./emscripten_indoor_map_entity_information_api.js");
var EmscriptenPolylineApi = require("./emscripten_polyline_api.js");
var EmscriptenBlueSphereApi = require("./emscripten_blue_sphere_api.js");
var EmscriptenMapRuntimeApi = require("./emscripten_map_runtime_api.js");
var EmscriptenVersionApi = require("./emscripten_version_api.js");

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
    this.indoorEntityApi = null;
    this.renderingApi = null;
    this.buildingsApi = null;
    this.layerPointMappingApi = null;
    this.propsApi = null;
    this.indoorMapEntityInformationApi = null;
    this.polylineApi = null;
    this.blueSphereApi = null;
    this.mapRuntimeApi = null;
    this.versionApi = null;

    this.onInitialized = function(eegeoApiPointer, emscriptenApiPointer, onUpdateCallback, onDrawCallback, onInitialStreamingCompletedCallback) {
        _eegeoApiPointer = eegeoApiPointer;
        _emscriptenApiPointer = emscriptenApiPointer;

        var cwrap = _emscriptenModule.cwrap;
        var runtime = _emscriptenModule.Runtime;

        var emscriptenMemory = new EmscriptenMemory(_emscriptenModule);

        // legacy - eegeo api usage via eegeo api pointer
        this.geofenceApi = new EmscriptenGeofenceApi(_eegeoApiPointer, cwrap, runtime, _emscriptenModule);
        this.spacesApi = new EmscriptenSpacesApi(_eegeoApiPointer, cwrap, runtime, emscriptenMemory);
        this.themesApi = new EmscriptenThemesApi(_eegeoApiPointer, cwrap, runtime);
        this.expandFloorsApi = new EmscriptenExpandFloorsApi(_eegeoApiPointer, cwrap, runtime);
        this.renderingApi = new EmscriptenRenderingApi(_eegeoApiPointer, cwrap, runtime, emscriptenMemory);
        this.propsApi = new EmscriptenPropsApi(_eegeoApiPointer, cwrap, runtime, emscriptenMemory);

        // emscripten-specific api usage via emscripten api pointer
        // New apis should follow this pattern
        this.layerPointMappingApi = new EmscriptenLayerPointMappingApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.buildingsApi = new EmscriptenBuildingsApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.indoorsApi = new EmscriptenIndoorsApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.cameraApi = new EmscriptenCameraApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.indoorEntityApi = new EmscriptenIndoorEntityApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.precacheApi = new EmscriptenPrecacheApi(_emscriptenApiPointer, cwrap, runtime);
        this.indoorMapEntityInformationApi = new EmscriptenIndoorMapEntityInformationApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.polylineApi = new EmscriptenPolylineApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.blueSphereApi = new EmscriptenBlueSphereApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.mapRuntimeApi = new EmscriptenMapRuntimeApi(_emscriptenApiPointer, cwrap, runtime, emscriptenMemory);
        this.versionApi = new EmscriptenVersionApi(_emscriptenApiPointer, cwrap, emscriptenMemory);

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