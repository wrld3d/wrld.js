var HTMLMapContainer = require("./html_map_container");
var ThemesModule = require("./themes_module");
var IndoorsModule = require("./indoors_module");
var PrecacheModule = require("./precache_module");
var CameraModule = require("./camera_module");
var PolygonModule = require("./polygon_module");
var RoutingModule = require("./routing_module");
var RenderingModule = require("./rendering_module");
var BuildingsModule = require("./buildings_module");

var LayerPointMappingModule = require("./layer_point_mapping_module");

var IndoorEntranceMarkerUpdater = require("./indoor_entrance_marker_updater");

var EegeoLeafletMap = require("../public/eegeo_leaflet_map");
var MapMoveEvents = require("./events/map_move_events");

var removeFileExtension = function(fileName, extensionToRemove) {
    var extensionPosition = fileName.lastIndexOf(".");
    var extension = fileName.slice(extensionPosition);
    if (extension === extensionToRemove) {
        return fileName.slice(0, extensionPosition);
    }
    return fileName;
};

var EegeoMapController = function(mapId, emscriptenApi, domElement, apiKey, browserWindow, browserDocument, module, options) {

    var _defaultOptions = {
        canvasId: "canvas",
        width: undefined,
        height: undefined,
        indoorsEnabled: false,
        displayEntranceMarkers: true,
        coverageTreeManifest: "",
        environmentThemesManifest: "",
        headingDegrees: 0,

        // Override Leaflet defaults
        center: L.latLng([37.7858, -122.401]),
        zoom: 16,
        doubleClickZoom: true,
        zoomControl: false,
        zoomAnimation: false,
        minZoom: 0,
        maxZoom: 20,
        zoomSnap: 0
    };

    options = L.extend(_defaultOptions, options);

    var _mapId = mapId;
    var _emscriptenApi = emscriptenApi;
    var _browserWindow = browserWindow;
    var _browserDocument = browserDocument;
    
    var _themesModule = new ThemesModule(emscriptenApi);
    var _precacheModule = new PrecacheModule(emscriptenApi);
    var _cameraModule = new CameraModule(emscriptenApi, options.center, options.zoom);
    var _indoorsModule = new IndoorsModule(emscriptenApi, this, _mapId, options.indoorId, options.floorIndex, options.center, options.headingDegrees, options.zoom);
    var _polygonModule = new PolygonModule(emscriptenApi);
    var _layerPointMappingModule = new LayerPointMappingModule(emscriptenApi);
    var _routingModule = new RoutingModule(apiKey, _indoorsModule);
    var _renderingModule = new RenderingModule(emscriptenApi);
    var _buildingsModule = new BuildingsModule(emscriptenApi);

    var _canvasId = _mapId ? options["canvasId"] + _mapId : options["canvasId"];
    var _canvasWidth = options["width"] || domElement.clientWidth;
    var _canvasHeight = options["height"] || domElement.clientHeight;
    var _containerId = "wrld-map-container" + _mapId;

    var _mapContainer = new HTMLMapContainer(_browserDocument, _browserWindow, domElement, _canvasId, _canvasWidth, _canvasHeight, _containerId, _mapId);

    var _canvas = _mapContainer.canvas;

    var _Module = module; 
    _Module["canvas"] = _canvas;

    var center = L.latLng(options.center);
    var zoom = options.zoom;
    var headingDegrees = options.headingDegrees;

    var indoorsEnabledArg = (options.indoorsEnabled) ? "1" : "0";
    var coverageTreeManifest = removeFileExtension(options.coverageTreeManifest, ".gz");
    var environmentThemesManifest = removeFileExtension(options.environmentThemesManifest, ".gz");
    var doubleClickZoom = (options.doubleClickZoom) ? "1" : "0";

    _Module["arguments"] = [
        _canvasId,
        _mapId.toString(),
        _canvasWidth.toString(),
        _canvasHeight.toString(),
        apiKey,
        center.lat.toString(),
        center.lng.toString(),
        zoom.toString(),
        headingDegrees.toString(),
        indoorsEnabledArg,
        coverageTreeManifest,
        environmentThemesManifest,
        doubleClickZoom,
        _containerId
    ];

    this.leafletMap = new EegeoLeafletMap(
        _browserWindow,
        _mapContainer.overlay,
        options,
        _cameraModule,        
        _precacheModule,
        _themesModule,
        _indoorsModule,
        _polygonModule,
        _layerPointMappingModule,
        _routingModule,
        _renderingModule,
        _buildingsModule);

    this.leafletMap._initEvents(false, _canvas);

    var _mapMoveEvents = new MapMoveEvents(this.leafletMap);

    var _modules = [        
        _layerPointMappingModule,
        _themesModule,
        _indoorsModule,
        _precacheModule,
        _cameraModule,
        _polygonModule,
        _renderingModule,
        _buildingsModule
    ];

    this._indoorEntranceMarkerUpdater = null;

    if (options.displayEntranceMarkers) {
        this._indoorEntranceMarkerUpdater = new IndoorEntranceMarkerUpdater(this.leafletMap, _indoorsModule);
    }

    var _resizeCanvas = null;
    
    var _updateCanvasSize = function() {
        var newWidth = _mapContainer.width();
        var newHeight = _mapContainer.height();
        
        if (newWidth !== _canvasWidth || newHeight !== _canvasHeight) {
            _resizeCanvas(newWidth, newHeight);
            _canvasWidth = newWidth;
            _canvasHeight = newHeight;
        }
    };

    this.onInitialized = function(eegeoApiPointer, emscriptenApiPointer) {
        _mapContainer.onInitialized();
        _resizeCanvas = _Module.cwrap("resizeCanvas", null, ["number", "number"]);
        _emscriptenApi.onInitialized(eegeoApiPointer, emscriptenApiPointer, _onUpdate, _onDraw, _onInitialStreamingCompleted);

        _mapMoveEvents.setEventCallbacks(_emscriptenApi.cameraApi);

        _modules.forEach(function(module) {
            module.onInitialized();
        });
        this.leafletMap.onInitialized(_emscriptenApi);
    };

    this.onError = function(errorMessage) {
        _mapContainer.onError(errorMessage);
    };

    this._setIndoorTransitionCompleteEventListener = function(callback) {
        this.leafletMap.once("moveend", callback);
    };

    var _this = this;

    var _onUpdate = function(deltaSeconds) {
        _updateCanvasSize();

        _modules.forEach(function(module) {
            module.onUpdate(deltaSeconds);
        });

        _this.leafletMap._onUpdate();
    };

    var _onDraw = function(deltaSeconds) {
        _modules.forEach(function(module) {
            module.onDraw(deltaSeconds);
        });

        _this.leafletMap._onDraw();
    };

    var _onInitialStreamingCompleted = function() {
        _modules.forEach(function(module) {
            module.onInitialStreamingCompleted();
        });
        _this.leafletMap.onInitialStreamingCompleted();
    };
};

module.exports = EegeoMapController;
