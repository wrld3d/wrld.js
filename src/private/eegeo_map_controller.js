var HTMLMapContainer = require("./html_map_container");
var ScreenPointMappingModule = require("./screen_point_mapping_module");
var DefaultAltitudeModule = require("./default_altitude_module");
var ThemesModule = require("./themes_module");
var IndoorsModule = require("./indoors_module");
var PrecacheModule = require("./precache_module");
var CameraModule = require("./camera_module");
var PolygonModule = require("./polygon_module");
var RoutingModule = require("./routing_module");
var RenderingModule = require("./rendering_module");

var IndoorEntranceMarkerUpdater = require("./indoor_entrance_marker_updater");

var EegeoLeafletMap = require("../public/eegeo_leaflet_map");
var MapMoveEvents = require("./events/map_move_events");

var EegeoMapController = function(mapId, emscriptenApi, domElement, apiKey, browserWindow, browserDocument, module, options) {

    var _defaultOptions = {
        canvasId: "canvas",
        width: undefined,
        height: undefined,
        indoorsEnabled: false,
        displayEntranceMarkers: true,
        coverageTreeManifest: "",
        environmentThemesManifest: "",

        // Override Leaflet defaults
        center: L.latLng([37.7858, -122.401]),
        zoom: 16,
        zoomControl: false,
        zoomAnimation: false,
        minZoom: 2,
        maxZoom: 20
    };

    options = L.extend(_defaultOptions, options);

    var _mapId = mapId;
    var _emscriptenApi = emscriptenApi;
    var _browserWindow = browserWindow;
    var _browserDocument = browserDocument;

    var _screenPointMappingModule = new ScreenPointMappingModule(emscriptenApi);
    var _defaultAltitudeModule = new DefaultAltitudeModule(emscriptenApi);
    var _themesModule = new ThemesModule(emscriptenApi);
    var _precacheModule = new PrecacheModule(emscriptenApi);
    var _cameraModule = new CameraModule(emscriptenApi);
    var _indoorsModule = new IndoorsModule(emscriptenApi, this);
    var _polygonModule = new PolygonModule(emscriptenApi);
    var _routingModule = new RoutingModule(apiKey, _indoorsModule);
    var _renderingModule = new RenderingModule(emscriptenApi);

    var _canvasId = options["canvasId"];
    var _canvasWidth = options["width"] || domElement.clientWidth;
    var _canvasHeight = options["height"] || domElement.clientHeight;

    var _mapContainer = new HTMLMapContainer(_browserDocument, _browserWindow, domElement, _canvasId, _canvasWidth, _canvasHeight);

    var _canvas = _mapContainer.canvas;

    var _Module = module; 
    _Module["canvas"] = _canvas;

    var center = L.latLng(options.center);
    var distance = _cameraModule.zoomLevelToDistance(options.zoom);

    var indoorsEnabledArg = (options.indoorsEnabled) ? "1" : "0";
    var coverageTreeManifest = options.coverageTreeManifest;
    var environmentThemesManifest = options.environmentThemesManifest;

    _Module["arguments"] = [
        _canvasId,
        _mapId.toString(),
        _canvasWidth.toString(),
        _canvasHeight.toString(),
        apiKey,
        center.lat.toString(),
        center.lng.toString(),
        distance.toString(),
        indoorsEnabledArg,
        coverageTreeManifest,
        environmentThemesManifest
    ];

    this.leafletMap = new EegeoLeafletMap(
        _browserWindow,
        _mapContainer.overlay,
        options,
        _cameraModule,
        _screenPointMappingModule,
        _defaultAltitudeModule,
        _precacheModule,
        _themesModule,
        _indoorsModule,
        _polygonModule,
        _routingModule,
        _renderingModule);

    this.leafletMap._initEvents(false, _canvas);

    var _mapMoveEvents = new MapMoveEvents(this.leafletMap);

    var _modules = [
        _screenPointMappingModule,
        _defaultAltitudeModule,
        _themesModule,
        _indoorsModule,
        _precacheModule,
        _cameraModule,
        _polygonModule,
        _renderingModule
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

    this.onInitialized = function(apiPointer) {
        _mapContainer.onInitialized();
        _resizeCanvas = _Module.cwrap("resizeCanvas", null, ["number", "number"]);
        _emscriptenApi.onInitialized(apiPointer, _onUpdate, _onDraw, _onInitialStreamingCompleted);

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
    };
};

module.exports = EegeoMapController;
