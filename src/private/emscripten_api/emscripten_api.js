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
var EmscriptenIndoorMapFloorOutlineInformationApi = require("./emscripten_indoor_map_floor_outline_information_api.js");
var EmscriptenPolylineApi = require("./emscripten_polyline_api.js");
var EmscriptenBlueSphereApi = require("./emscripten_blue_sphere_api.js");
var EmscriptenMapRuntimeApi = require("./emscripten_map_runtime_api.js");
var EmscriptenVersionApi = require("./emscripten_version_api.js");
var EmscriptenHeatmapApi = require("./emscripten_heatmap_api.js");
var EmscriptenFrameRateApi = require("./emscripten_frame_rate_api.js");

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
    this.indoorMapFloorOutlineInformationApi = null;
    this.polylineApi = null;
    this.blueSphereApi = null;
    this.mapRuntimeApi = null;
    this.versionApi = null;
    this.heatmapApi = null;
    this.frameRateApi = null;

    this.onInitialized = function(eegeoApiPointer, emscriptenApiPointer, onUpdateCallback, onDrawCallback, onInitialStreamingCompletedCallback) {
        _eegeoApiPointer = eegeoApiPointer;
        _emscriptenApiPointer = emscriptenApiPointer;

        var cwrap = _emscriptenModule.cwrap;

        var emscriptenMemory = new EmscriptenMemory(_emscriptenModule);

        // legacy - eegeo api usage via eegeo api pointer
        this.geofenceApi = new EmscriptenGeofenceApi(_eegeoApiPointer, cwrap, _emscriptenModule);
        this.spacesApi = new EmscriptenSpacesApi(_eegeoApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.themesApi = new EmscriptenThemesApi(_eegeoApiPointer, cwrap, _emscriptenModule);
        this.expandFloorsApi = new EmscriptenExpandFloorsApi(_eegeoApiPointer, cwrap, _emscriptenModule);

        // emscripten-specific api usage via emscripten api pointer
        // New apis should follow this pattern
        this.layerPointMappingApi = new EmscriptenLayerPointMappingApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.buildingsApi = new EmscriptenBuildingsApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.indoorsApi = new EmscriptenIndoorsApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.cameraApi = new EmscriptenCameraApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.indoorEntityApi = new EmscriptenIndoorEntityApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.precacheApi = new EmscriptenPrecacheApi(_emscriptenApiPointer, cwrap, _emscriptenModule);
        this.indoorMapEntityInformationApi = new EmscriptenIndoorMapEntityInformationApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.indoorMapFloorOutlineInformationApi = new EmscriptenIndoorMapFloorOutlineInformationApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.polylineApi = new EmscriptenPolylineApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.blueSphereApi = new EmscriptenBlueSphereApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.mapRuntimeApi = new EmscriptenMapRuntimeApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.versionApi = new EmscriptenVersionApi(_emscriptenApiPointer, cwrap, emscriptenMemory);
        this.heatmapApi = new EmscriptenHeatmapApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.renderingApi = new EmscriptenRenderingApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.frameRateApi = new EmscriptenFrameRateApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);
        this.propsApi = new EmscriptenPropsApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);

        var _setTopLevelCallbacks = _emscriptenModule.cwrap("setTopLevelCallbacks", null, ["number", "number", "number", "number"]);
        _setTopLevelCallbacks(
            _eegeoApiPointer,
            _emscriptenModule.addFunction(onUpdateCallback),
            _emscriptenModule.addFunction(onDrawCallback),
            _emscriptenModule.addFunction(onInitialStreamingCompletedCallback)
        );
        _ready = true;
    };

    this.ready = function() {
        return _ready;
    };
}

module.exports = EmscriptenApi;