var HTMLMapContainer = require("./html_map_container");
var ScreenPointMappingModule = require("./screen_point_mapping_module");
var ThemesModule = require("./themes_module");
var IndoorsModule = require("./indoors_module");
var PrecacheModule = require("./precache_module");
var CameraModule = require("./camera_module");
var PolygonModule = require("./polygon_module");

var IndoorEntranceMarkerUpdater = require("./indoor_entrance_marker_updater");

var EegeoLeafletMap = require("./eegeo_leaflet_map");

var EegeoMapController = function(mapId, emscriptenApi, domElement, apiKey, options) {

    var _mapId = mapId;
    var _emscriptenApi = emscriptenApi;

    var _screenPointMappingModule = new ScreenPointMappingModule(emscriptenApi);
    var _themesModule = new ThemesModule(emscriptenApi);
    var _indoorsModule = new IndoorsModule(emscriptenApi);
    var _precacheModule = new PrecacheModule(emscriptenApi);
    var _cameraModule = new CameraModule(emscriptenApi);
    var _polygonModule = new PolygonModule(emscriptenApi);

    var _modules = [
        _screenPointMappingModule,
        _themesModule,
        _indoorsModule,
        _precacheModule,
        _cameraModule,
        _polygonModule
    ];

    var _canvasId = options["canvasId"] || "canvas";
    var _canvasWidth = options["width"] || domElement.clientWidth;
    var _canvasHeight = options["height"] || domElement.clientHeight;

    var _mapContainer = new HTMLMapContainer(domElement, _canvasId, _canvasWidth, _canvasHeight);

    var _canvas = _mapContainer.canvas;

    var _Module = window.Module;
    _Module["canvas"] = _canvas;

    var defaultCenter = [37.7858, -122.401];
    var defaultZoom = 12;

    options.center = options.center || defaultCenter;
    options.zoom = options.zoom || defaultZoom;

    var centerLatLng = L.latLng(options.center);
    var distance = _cameraModule.zoomLevelToDistance(options.zoom);

    var indoorsEnabled = !!options["indoorsEnabled"];
    var indoorsEnabledArg = (indoorsEnabled) ? "1" : "0";

    _Module["arguments"] = [
        _canvasId,
        _mapId.toString(),
        _canvasWidth.toString(),
        _canvasHeight.toString(),
        apiKey,
        centerLatLng.lat.toString(),
        centerLatLng.lng.toString(),
        distance.toString(),
        indoorsEnabledArg
        ];

    options.zoomControl = false;

    this.leafletMap = new EegeoLeafletMap(_mapContainer.overlay, options, _cameraModule, _screenPointMappingModule, _precacheModule, _themesModule, _indoorsModule, _polygonModule);

    var displayEntranceMarkers = !!options["displayEntranceMarkers"] || !("displayEntranceMarkers" in options);

    this._indoorEntranceMarkerUpdater = null;

    if (displayEntranceMarkers) {
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
        _modules.forEach(function(module) {
            module.onInitialized();
        });
        this.leafletMap.onInitialized(_emscriptenApi);
    };

    var _this = this;

    var _onUpdate = function(deltaSeconds) {
        _updateCanvasSize();

        _modules.forEach(function(module) {
            module.onUpdate(deltaSeconds);
        });
    };

    var _onDraw = function(deltaSeconds) {
        _modules.forEach(function(module) {
            module.onDraw(deltaSeconds);
        });

        _this.leafletMap.update();
    };

    var _onInitialStreamingCompleted = function() {
        _modules.forEach(function(module) {
            module.onInitialStreamingCompleted();
        });
    };
};

module.exports = EegeoMapController;