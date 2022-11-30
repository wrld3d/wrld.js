import EmscriptenMemory from "./emscripten_memory";
import EmscriptenGeofenceApi from "./emscripten_geofence_api.js";
import EmscriptenIndoorsApi from "./emscripten_indoors_api.js";
import EmscriptenPrecacheApi from "./emscripten_precache_api.js";
import EmscriptenSpacesApi from "./emscripten_spaces_api.js";
import EmscriptenThemesApi from "./emscripten_themes_api.js";
import EmscriptenCameraApi from "./emscripten_camera_api.js";
import EmscriptenExpandFloorsApi from "./emscripten_expand_floors_api.js";
import EmscriptenIndoorEntityApi from "./emscripten_indoor_entity_api.js";
import EmscriptenBuildingsApi from "./emscripten_buildings_api.js";
import EmscriptenRenderingApi from "./emscripten_rendering_api.js";
import EmscriptenLayerPointMappingApi from "./emscripten_layer_point_mapping_api.js";
import EmscriptenPropsApi from "./emscripten_props_api.js";
import EmscriptenIndoorMapEntityInformationApi from "./emscripten_indoor_map_entity_information_api.js";
import EmscriptenIndoorMapFloorOutlineInformationApi from "./emscripten_indoor_map_floor_outline_information_api.js";
import EmscriptenPolylineApi from "./emscripten_polyline_api.js";
import EmscriptenBlueSphereApi from "./emscripten_blue_sphere_api.js";
import EmscriptenMapRuntimeApi from "./emscripten_map_runtime_api.js";
import EmscriptenVersionApi from "./emscripten_version_api.js";
import EmscriptenHeatmapApi from "./emscripten_heatmap_api.js";
import EmscriptenFrameRateApi from "./emscripten_frame_rate_api.js";
import EmscriptenLabelApi from "./emscripten_label_api";
import EmscriptenStreamingApi from "./emscripten_streaming_api";

export function EmscriptenApi(emscriptenModule) {

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
    this.labelApi = null;
    this.streamingApi = null;

    this.onInitialized = (eegeoApiPointer, emscriptenApiPointer, onUpdateCallback, onDrawCallback, onInitialStreamingCompletedCallback) => {
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
        this.labelApi = new EmscriptenLabelApi(_emscriptenApiPointer, cwrap);
        this.streamingApi = new EmscriptenStreamingApi(_emscriptenApiPointer, cwrap, _emscriptenModule, emscriptenMemory);

        var _setTopLevelCallbacks = _emscriptenModule.cwrap("setTopLevelCallbacks", null, ["number", "number", "number", "number"]);
        _setTopLevelCallbacks(
            _eegeoApiPointer,
            _emscriptenModule.addFunction(onUpdateCallback, "vf"),
            _emscriptenModule.addFunction(onDrawCallback, "vf"),
            _emscriptenModule.addFunction(onInitialStreamingCompletedCallback, "v")
        );
        _ready = true;
    };

    this.ready = () => _ready;
}

export default EmscriptenApi;
