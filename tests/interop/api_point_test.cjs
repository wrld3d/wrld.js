// Populate environment globals.
window = {
  createWrldModule: require("../../tmp/sdk/eeGeoWebGL.js"),
  location: { pathname: "" },
  encodeURIComponent: function(s) {}
};

Module = {};
L = {};

// Upgrading Emscripten has changed error logging from printing
// unrelated numbers to printing actual error messages. This
// may give the impression that the tests shoould have failed,
// despite it being expected behaviour.
console.log(`It is safe to ignore the following messages if they are logged during these tests - we're often providing dummy arguments when we test if functions exist, but not that they're working. This includes passing zero as a pointer where the C++ code expects it to be non-null. State is reset between tests, so this does not contaminate later ones. Exact numbers and paths in messages may vary:
* undefined
* Eegeo ASSERT: eegeo-mobile/eegeo-api/EegeoPrecacheApi.cpp (77) Precache operation with id 1668509029 already exists
* Runtime error: The application has corrupted its heap memory area (address zero)!
* egeo-mobile/platform/Streaming/Stream/MortonKey.cpp (43) key string must be non-empty and contain a valid morton key
* Eegeo ASSERT: eegeo-mobile/eegeo-webgl/src/EmscriptenLayerMappingApi.cpp (89) couldn't find layer with id '0'
* Eegeo ASSERT: eegeo-mobile/eegeo-webgl/src/EmscriptenLayerMappingApi.cpp (100) couldn't find layer with id of '0'
* Eegeo ASSERT: eegeo-mobile/eegeo-api/EegeoIndoorsApi.cpp (250)
`)

describe("map_interop:", function() {
  // Stub of browser dependencies.
  var sinon = require('sinon');
  XMLHttpRequest = sinon.useFakeXMLHttpRequest();

  // Pull in globals definitions from dependencies (SDK and Leaflet).
  require("../../node_modules/leaflet/src/core/Util");
  require("../../node_modules/leaflet/src/core/Class");
  require("../../node_modules/leaflet/src/geo/LatLng");
  require("../../node_modules/leaflet/src/geo/LatLngBounds");
  require("../../node_modules/leaflet/src/geometry/Point");
  var space = require("../../src/public/space");

  var _verifyApiFunctionExists = function(caller) {
    // Bit weird, originally had this expectation set to
    // expect().not.toThrowError(/Cannot call unknown function/)
    // as more specific, but was then missing case where invalid
    // inputs to the JS API call caused failures prior to calling
    // the cwrap SDK call.
    //
    // Instead, we know the generic Emscripten error when we have
    // called a validly linked but uncallable SDK function starts
    // with (e.g.) "abort(9) at Error", so expect that. Emscripten
    // updates and compiler options have been known to change the
    // specific messages and the error type. This catches
    // JS errors and bad/missing interop method names.

    try {
      caller();
    } catch(e) {
      var genericExpectedEmscriptenCrashPattern = /^abort\((\d*|undefined)\)( at Error.*|. Build with -s ASSERTIONS=1 for more info.$)/;
      var vtableExpeectedEmscriptenCrashPattern = /^[$_a-zA-Z][$\w]*\[.+\] is not a function$/;
      if((typeof e !== 'string' || e.match(genericExpectedEmscriptenCrashPattern) == null) && (!e instanceof Error || (e.message.match(vtableExpeectedEmscriptenCrashPattern) == null && e.message.match(genericExpectedEmscriptenCrashPattern) == null))) {
        fail(e);
      }
    }
  };

  function refreshSdk() {
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
    Module = {};
    Module.noInitialRun = true;
    window.createWrldModule(Module);

    // There may still be unhandled rejections from a previous test if
    // Emscripten detected an expected issue asynchronously.
    existingListeners = process.rawListeners('unhandledRejection');
    process.removeAllListeners('unhandledRejection');
    process.on('unhandledRejection', (reason, promise) => {
      var heapCorruptionExpectedCrashPattern = /^abort\(Runtime error: The application has corrupted its heap memory area \(address zero\)!\) at Error.*/;
      if (!reason instanceof Error || reason.message.match(heapCorruptionExpectedCrashPattern) == null) {
        existingListeners.forEach((listener) => listener(reason, promise));
      }
    });
  }

  describe("when instantiating the native api", function() {
    var EmscriptenApi = require("../../src/private/emscripten_api/emscripten_api");
    refreshSdk();

    it("there should be no errors", function(done) {
      expect(function() {
        Module.then((module) => {
          var mapApiObject = new EmscriptenApi(Module);
          var eegeoApiPointer = 0;
          var emscriptenApiPointer = 0;
          var onUpdateCallback = function (deltaSeconds) { };
          var onDrawCallback = function (deltaSeconds) { };
          var onInitialStreamingCompletedCallback = function () { };
          mapApiObject.onInitialized(eegeoApiPointer, emscriptenApiPointer, onUpdateCallback, onDrawCallback, onInitialStreamingCompletedCallback);
          done();
        });
      }).not.toThrow();
    });
  });

  describe("when using the camera api", function() {
    var EmscriptenCameraApi = require("../../src/private/emscripten_api/emscripten_camera_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _cameraApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _cameraApi = new EmscriptenCameraApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the setView function should exist", function() {
      _verifyApiFunctionExists(function() {
        var config = { location: L.latLng(0,0) };
        _cameraApi.setView(config);
      });
    });

    it("the setViewToBounds function should exist", function() {
      _verifyApiFunctionExists(function() {
        var config = { bounds: L.latLngBounds(L.latLng(0,0), L.latLng(0,0)) };
        _cameraApi.setViewToBounds(config);
      });
    });

    it("the getDistanceToInterest function should exist", function() {
      _verifyApiFunctionExists(function() {
        _cameraApi.getDistanceToInterest();
      });
    });

    it("the getInterestLatLong function should exist", function() {
      _verifyApiFunctionExists(function() {
        _cameraApi.getInterestLatLong();
      });
    });

    it("the getPitchDegrees function should exist", function() {
      _verifyApiFunctionExists(function() {
        _cameraApi.getPitchDegrees();
      });
    });

    it("the getHeadingDegrees function should exist", function() {
      _verifyApiFunctionExists(function() {
        _cameraApi.getHeadingDegrees();
      });
    });

    it("the setEventCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function () {};
        _cameraApi.setEventCallback(callback);
      });
    });

    it("the getDistanceFromZoomLevel function should exist", function() {
      _verifyApiFunctionExists(function() {
        var zoomlevel = 1;
        _cameraApi.getDistanceFromZoomLevel(zoomlevel);
      });
    });

    it("the getZoomLevel function should exist", function() {
      _verifyApiFunctionExists(function() {
        _cameraApi.getZoomLevel();
      });
    });

    it("the setVerticallyLocked function should exist", function() {
      _verifyApiFunctionExists(function() {
        _cameraApi.setVerticallyLocked(false);
      });
    });

  });

  describe("when using the themes api", function() {
    var EmscriptenThemesApi = require("../../src/private/emscripten_api/emscripten_themes_api");
    var _themesApi = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _themesApi = new EmscriptenThemesApi(apiPointer, cwrap, Module);
        done();
      });
    });

    it("the setTheme function should exist", function() {
      _verifyApiFunctionExists(function() {
        _themesApi.setTheme("themeName");
      });
    });

    it("the setState function should exist", function() {
      _verifyApiFunctionExists(function() {
        var transitionTime = 0;
        _themesApi.setState("themeState", 0);
      });
    });

    it("the setThemeManifest function should exist", function() {
      _verifyApiFunctionExists(function() {
        _themesApi.setThemeManifest("themeManifest");
      });
    });

    it("the registerStreamingCompletedCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function () {};
        _themesApi.registerStreamingCompletedCallback(callback);
      });
    });
  });

  describe("when using the geofence api", function() {
    var EmscriptenGeofenceApi = require("../../src/private/emscripten_api/emscripten_geofence_api");
    var _geofenceApi = null;

    /*
        The GeoFence API does cwrap in constructor rather than lazily, because the API
        hits GL directly and so cannot easily be mocked.
    */
    it("all functions should exist", function(done) {
      _verifyApiFunctionExists(function() {
        refreshSdk();
        Module.then(() => {
          var apiPointer = 0;
          var cwrap = Module.cwrap;
          _geofenceApi = new EmscriptenGeofenceApi(apiPointer, cwrap, Module);
          done();
        });
      });
    });
  });

  describe("when using the precache api", function() {
    var EmscriptenPrecacheApi = require("../../src/private/emscripten_api/emscripten_precache_api");
    var _precacheApi = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _precacheApi = new EmscriptenPrecacheApi(apiPointer, cwrap, Module);
        done();
      });
    });

    it("the beginPrecacheOperation function should exist", function() {
      _verifyApiFunctionExists(function() {
        var operation = { getCentre: function() { return L.latLng(0,0) }, getRadius: function() { return 1; } };
        _precacheApi.beginPrecacheOperation(operation);
      });
    });

    it("the cancelPrecacheOperation function should exist", function() {
      _verifyApiFunctionExists(function() {
        var operation = { getCentre: function() { return L.latLng(0,0) }, getRadius: function() { return 1; } };
        var operationId = _precacheApi.beginPrecacheOperation(operation);
        _precacheApi.cancelPrecacheOperation(operationId);
      });
    });
  });

  describe("when using the spaces api", function() {
    var EmscriptenSpacesApi = require("../../src/private/emscripten_api/emscripten_spaces_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _spacesApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _spacesApi = new EmscriptenSpacesApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the worldToScreen function should exist", function() {
      _verifyApiFunctionExists(function() {
        var latLng = L.latLng(0, 0);
        _spacesApi.worldToScreen(latLng);
      });
    });

    it("the screenToTerrainPoint function should exist", function() {
      _verifyApiFunctionExists(function() {
        var point = L.point(0, 0);
        _spacesApi.screenToTerrainPoint(point);
      });
    });

    it("the screenToIndoorPoint function should exist", function() {
      _verifyApiFunctionExists(function() {
        var point = L.point(0, 0);
        _spacesApi.screenToIndoorPoint(point);
      });
    });

    it("the screenToWorldPoint function should exist", function() {
      _verifyApiFunctionExists(function() {
        var point = L.point(0, 0);
        _spacesApi.screenToWorldPoint(point);
      });
    });

    it("the getAltitudeAtLatLng function should exist", function() {
      _verifyApiFunctionExists(function() {
        var latLng = L.latLng(0, 0);
        _spacesApi.getAltitudeAtLatLng(latLng);
      });
    });

    it("the getUpdatedAltitudeAtLatLng function should exist", function() {
      _verifyApiFunctionExists(function() {
        var latLng = L.latLng(0, 0);
        var previousHeight = 0.0;
        var previousLevel = -1;
        _spacesApi.getUpdatedAltitudeAtLatLng(latLng, previousHeight, previousLevel);
      });
    });

    it("the getMortonKeyAtLatLng function should exist", function() {
      _verifyApiFunctionExists(function() {
        var latLng = L.latLng(0, 0);
        _spacesApi.getMortonKeyAtLatLng(latLng);
      });
    });

    it("the getMortonKeyCenter function should exist", function() {
      _verifyApiFunctionExists(function() {
        var mortonKey = "";
        _spacesApi.getMortonKeyCenter(mortonKey);
      });
    });

    it("the getMortonKeyCorners function should exist", function() {
      _verifyApiFunctionExists(function() {
        var mortonKey = "";
        _spacesApi.getMortonKeyCorners(mortonKey);
      });
    });
  });

  describe("when using the layer point mapping api", function() {
    var EmscriptenLayerPointMappingApi = require("../../src/private/emscripten_api/emscripten_layer_point_mapping_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _layerPointMappingApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _layerPointMappingApi = new EmscriptenLayerPointMappingApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the createPointMapping function should exist", function() {
      _verifyApiFunctionExists(function() {
        var mappingId = 0;
        var elevation = 100.0;
        var elevationModeInt = 0;
        var indoorMapFloorId = 2;
        var latLngs = [ L.latLng(0, 1), L.latLng(-2, 3) ];
        _layerPointMappingApi.createPointMapping(mappingId, elevation, elevationModeInt, "my_indoor_map_id", indoorMapFloorId, latLngs);
      });
    });

    it("the createPointMappingWithFloorIndex function should exist", function() {
      _verifyApiFunctionExists(function() {
        var mappingId = 0;
        var elevation = 100.0;
        var elevationModeInt = 0;
        var indoorMapFloorIndex = 0;
        var latLngs = [ L.latLng(0, 1), L.latLng(-2, 3) ];
        _layerPointMappingApi.createPointMappingWithFloorIndex(mappingId, elevation, elevationModeInt, "my_indoor_map_id", indoorMapFloorIndex, latLngs);
      });
    });

    it("the removePointMapping function should exist", function() {
      _verifyApiFunctionExists(function() {
        var mappingId = 0;
        _layerPointMappingApi.removePointMapping(mappingId);
      });
    });

    it("the getLatLngsForLayer function should exist", function() {
      _verifyApiFunctionExists(function() {
        var mappingId = 0;
        var latLngCount = 0;
        _layerPointMappingApi.getLatLngsForLayer(mappingId, latLngCount);
      });
    });
  });

  describe("when using the indoors api", function() {
    var EmscriptenIndoorsApi = require("../../src/private/emscripten_api/emscripten_indoors_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _indoorsApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _indoorsApi = new EmscriptenIndoorsApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the setNotificationCallbacks function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback0 = function() {};
        var callback1 = function() {};
        var callback2 = function() {};
        var callback3 = function() {};
        var callback4 = function() {};
        var callback5 = function() {};
        var callback6 = function() {};
        var callback7 = function() {};
        _indoorsApi.setNotificationCallbacks(callback0, callback1, callback2, callback3, callback4, callback5, callback6, callback7);
      });
    });


    it("the exitIndoorMap function should exist", function() {
      _verifyApiFunctionExists(function() {
        _indoorsApi.exitIndoorMap();
      });
    });

    it("the hasActiveIndoorMap function should exist", function() {
      _verifyApiFunctionExists(function() {
        _indoorsApi.hasActiveIndoorMap();
      });
    });

    it("the getActiveIndoorMapId function should exist", function() {
      _verifyApiFunctionExists(function() {
        _indoorsApi.getActiveIndoorMapId();
      });
    });

    it("the getActiveIndoorMapName function should exist", function() {
      _verifyApiFunctionExists(function() {
        _indoorsApi.getActiveIndoorMapName();
      });
    });

    it("the getActiveIndoorMapSourceVendor function should exist", function() {
      _verifyApiFunctionExists(function() {
        _indoorsApi.getActiveIndoorMapSourceVendor();
      });
    });

    it("the getActiveIndoorMapFloorCount function should exist", function() {
      _verifyApiFunctionExists(function() {
        _indoorsApi.getActiveIndoorMapFloorCount();
      });
    });

    it("the getActiveIndoorMapUserData function should exist", function() {
      _verifyApiFunctionExists(function() {
        _indoorsApi.getActiveIndoorMapUserData();
      });
    });

    it("the getSelectedFloorIndex function should exist", function() {
      _verifyApiFunctionExists(function() {
        _indoorsApi.getSelectedFloorIndex();
      });
    });

    it("the setSelectedFloorIndex function should exist", function() {
      _verifyApiFunctionExists(function() {
        var floorIndex = 0;
        _indoorsApi.setSelectedFloorIndex(floorIndex);
      });
    });

    it("the getFloorName function should exist", function() {
      _verifyApiFunctionExists(function() {
        var floorIndex = 0;
        _indoorsApi.getFloorName(floorIndex);
      });
    });

    it("the getFloorShortName function should exist", function() {
      _verifyApiFunctionExists(function() {
        var floorIndex = 0;
        _indoorsApi.getFloorShortName(floorIndex);
      });
    });

    it("the getFloorNumber function should exist", function() {
      _verifyApiFunctionExists(function() {
        var floorIndex = 0;
        _indoorsApi.getFloorNumber(floorIndex);
      });
    });

    it("the getFloorHeightAboveSeaLevel function should exist", function() {
      _verifyApiFunctionExists(function() {
        var floorIndex = 0;
        _indoorsApi.getFloorHeightAboveSeaLevel(floorIndex);
      });
    });

    it("the enterIndoorMap function should exist", function() {
      _verifyApiFunctionExists(function() {
        var indoorMapId = 0;
        _indoorsApi.enterIndoorMap(indoorMapId);
      });
    });

    it("the tryGetReadableName function should exist", function() {
      _verifyApiFunctionExists(function() {
        var indoorMapId = "";
        _indoorsApi.tryGetReadableName(indoorMapId);
      });
    });

    it("the tryGetFloorReadableName function should exist", function() {
      _verifyApiFunctionExists(function() {
        var indoorMapId = "";
        var indoorMapFloorId = 0;
        _indoorsApi.tryGetFloorReadableName(indoorMapId, indoorMapFloorId);
      });
    });

    it("the tryGetFloorShortName function should exist", function() {
      _verifyApiFunctionExists(function() {
        var indoorMapId = "";
        var indoorMapFloorId = 0;
        _indoorsApi.tryGetFloorShortName(indoorMapId, indoorMapFloorId);
      });
    });

  });

  describe("when using the expand floors api", function() {
    var EmscriptenExpandFloorsApi = require("../../src/private/emscripten_api/emscripten_expand_floors_api");
    var _expandFloorsApi = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _expandFloorsApi = new EmscriptenExpandFloorsApi(apiPointer, cwrap, Module);
        done();
      });
    });

    it("the expandIndoorMap function should exist", function() {
      _verifyApiFunctionExists(function() {
        _expandFloorsApi.expandIndoorMap();
      });
    });

    it("the collapseIndoorMap function should exist", function() {
      _verifyApiFunctionExists(function() {
        _expandFloorsApi.collapseIndoorMap();
      });
    });

    it("the getFloorParam function should exist", function() {
      _verifyApiFunctionExists(function() {
        _expandFloorsApi.getFloorParam();
      });
    });

    it("the setFloorParam function should exist", function() {
      _verifyApiFunctionExists(function() {
        var floorParam = 0;
        _expandFloorsApi.setFloorParam(floorParam);
      });
    });

    it("the setCollapseStartCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _expandFloorsApi.setCollapseStartCallback(callback);
      });
    });

    it("the setCollapseCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _expandFloorsApi.setCollapseCallback(callback);
      });
    });

    it("the setCollapseEndCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _expandFloorsApi.setCollapseEndCallback(callback);
      });
    });

    it("the setExpandStartCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _expandFloorsApi.setExpandStartCallback(callback);
      });
    });

    it("the setExpandCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _expandFloorsApi.setExpandCallback(callback);
      });
    });

    it("the setExpandEndCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _expandFloorsApi.setExpandEndCallback(callback);
      });
    });
  });

  describe("when using the indoorEntity api", function() {
    var EmscriptenIndoorEntityApi = require("../../src/private/emscripten_api/emscripten_indoor_entity_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _indoorEntityApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _indoorEntityApi = new EmscriptenIndoorEntityApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the registerIndoorEntityPickedCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _indoorEntityApi.registerIndoorEntityPickedCallback(callback);
      });
    });

    it("the setHighlights function should exist", function() {
      _verifyApiFunctionExists(function() {
        var ids = ["1000", "1001", "2001"];
        var color = [128, 0, 0, 128];
        var indoorMapId = "indoor_map"
        _indoorEntityApi.setHighlights(ids, color, indoorMapId);
      });
    });

    it("the clearHighlights function should exist", function() {
      _verifyApiFunctionExists(function() {
          var ids = ["1000", "1001", "2001"];
          var indoorMapId = "indoor_map"
        _indoorEntityApi.clearHighlights(ids, indoorMapId);
      });
    });
  });

  describe("when using the IndoorMapFloorOutlineInformation api", function() {
    var EmscriptenIndoorMapFloorOutlineInformationApi = require("../../src/private/emscripten_api/emscripten_indoor_map_floor_outline_information_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _emscriptenIndoorMapFloorOutlineInformationApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _emscriptenIndoorMapFloorOutlineInformationApi = new EmscriptenIndoorMapFloorOutlineInformationApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the registerIndoorMapFloorOutlineInformationLoadedCallback fucntion should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function(id) {};
        _emscriptenIndoorMapFloorOutlineInformationApi.registerIndoorMapFloorOutlineInformationLoadedCallback(callback);
      });
    });

    it("the createIndoorMapFloorOutlineInformation fucntion should exist", function() {
      _verifyApiFunctionExists(function() {
        var outlineInformationMock = {
            getIndoorMapId: function() { return "" },
            getIndoorMapFloorId: function() { return 0 }
        };
        _emscriptenIndoorMapFloorOutlineInformationApi.createIndoorMapFloorOutlineInformation(outlineInformationMock);
      });
    });

    it("the destroyIndoorMapFloorOutlineInformation fucntion should exist", function() {
      _verifyApiFunctionExists(function() {
        _emscriptenIndoorMapFloorOutlineInformationApi.destroyIndoorMapFloorOutlineInformation(0);
      });
    });

    it("the getIndoorMapFloorOutlineInformationLoaded fucntion should exist", function() {
      _verifyApiFunctionExists(function() {
        _emscriptenIndoorMapFloorOutlineInformationApi.getIndoorMapFloorOutlineInformationLoaded(0);
      });
    });

    it("the tryGetIndoorMapFloorOutlineInformation fucntion should exist", function() {
      _verifyApiFunctionExists(function() {
        _emscriptenIndoorMapFloorOutlineInformationApi.tryGetIndoorMapFloorOutlineInformation(0);
      });
    });
  });

  describe("when using the rendering api", function() {
    var EmscriptenRenderingApi = require("../../src/private/emscripten_api/emscripten_rendering_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _renderingApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _renderingApi = new EmscriptenRenderingApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the setMapCollapsed function should exist", function() {
      _verifyApiFunctionExists(function() {
        _renderingApi.setMapCollapsed(false);
      });
    });

    it("the setClearColor function should exist", function() {
      _verifyApiFunctionExists(function() {
        _renderingApi.setClearColor("#f00");
      });
    });

    it("the getCameraRelativePosition function should exist", function() {
      _verifyApiFunctionExists(function() {
        var latLng = L.latLng(0, 0);
        _renderingApi.getCameraRelativePosition(latLng);
      });
    });

    it("the getNorthFacingOrientationMatrix function should exist", function() {
      _verifyApiFunctionExists(function() {
        var latLng = L.latLng(0, 0);
        _renderingApi.getNorthFacingOrientationMatrix(latLng);
      });
    });

    it("the getCameraProjectionMatrix function should exist", function() {
      _verifyApiFunctionExists(function() {
        _renderingApi.getCameraProjectionMatrix();
      });
    });

    it("the getCameraOrientationMatrix function should exist", function() {
      _verifyApiFunctionExists(function() {
        _renderingApi.getCameraOrientationMatrix();
      });
    });

    it("the getLightingData function should exist", function() {
      _verifyApiFunctionExists(function() {
        _renderingApi.getLightingData();
      });
    });
  });

  describe("when using the polyline api", function() {
    var EmscriptenPolylineApi = require("../../src/private/emscripten_api/emscripten_polyline_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _polylineApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _polylineApi = new EmscriptenPolylineApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the createPolyline function should exist", function() {
      _verifyApiFunctionExists(function() {
        var polylineMock = {
            getLatLngs: function() { return [L.latLng(0,0)] },
            getIndoorMapId: function() { return "" },
            getIndoorMapFloorId: function() { return 0 },
            getElevation: function() { return 0 },
            getElevationMode: function() { return "heightAboveSeaLevel" },
            getWidth: function() { return 1 },
            getColor: function() { return "#ffffffff" },
            getMiterLimit: function() { return 1 }
        };
        _polylineApi.createPolyline(polylineMock);
      });
    });

    it("the destroyPolyline function should exist", function() {
      _verifyApiFunctionExists(function() {
        var polylineId = 1;
        _polylineApi.destroyPolyline(polylineId);
      });
    });

    it("the updateNativeState function should exist", function() {
      _verifyApiFunctionExists(function() {
        var polylineId = 1;
        var polylineMock = {
            getIndoorMapId: function() { return "" },
            getIndoorMapFloorId: function() { return 0 },
            getElevation: function() { return 0 },
            getElevationMode: function() { return "heightAboveSeaLevel" },
            getWidth: function() { return 1 },
            getColor: function() { return "#ffffffff" },
            getMiterLimit: function() { return 1 }
        };
        _polylineApi.updateNativeState(polylineId, polylineMock);
      });
    });
  });

  describe("when using the heatmap api", function() {
    var EmscriptenHeatmapApi = require("../../src/private/emscripten_api/emscripten_heatmap_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _heatmapApi = null;
    var _emscriptenMemory = null;
    var _heatmapMock = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _heatmapApi = new EmscriptenHeatmapApi(apiPointer, cwrap, Module, _emscriptenMemory);
        _heatmapMock = {
          getPolygonPoints: function () { return [] },
          getIndoorMapId: function () { return "" },
          getIndoorMapFloorId: function () { return 0 },
          getElevation: function () { return 0 },
          getElevationMode: function () { return "heightAboveSeaLevel" },
          getData: function () { return [{ latLng: L.latLng(37.78, -122.40), weight: 2.0 }] },
          getDensityStops: function () { return [{ stop: 0.0, radius: 10.0, gain: 1.0 }] },
          getColorGradient: function () { return [{ stop: 0.0, color: "#ffffffff" }] },
          getOccludedMapFeatures: function () { return [] },
          getWeightMin: function () { return 0.0 },
          getWeightMax: function () { return 1.0 },
          getResolutionPixels: function () { return 512 },
          getTextureBorderPercent: function () { return 0.5 },
          getUseApproximation: function () { return true },
          getDensityBlend: function () { return 0.0 },
          getInterpolateDensityByZoom: function () { return false },
          getZoomMin: function () { return 15.0 },
          getZoomMax: function () { return 18.0 },
          getOpacity: function () { return 1.0 },
          getIntensityBias: function () { return 0.0 },
          getIntensityScale: function () { return 1.0 },
          getOccludedAlpha: function () { return 1.0 },
          getOccludedSaturation: function () { return 1.0 },
          getOccludedBrightness: function () { return 1.0 },
          _anyChanged: function () { return true; },
          _getChangedFlags: function () { return {}; },
          _clearChangedFlags: function () { }
        };
        done();
      });
    });

    it("the createHeatmap function must exist", function() {
      _verifyApiFunctionExists(function() {
        _heatmapApi.createHeatmap(_heatmapMock);
      });
    });

    it("the destroyHeatmap function must exist", function() {
      _verifyApiFunctionExists(function() {
        var heatmapId = 1;
        _heatmapApi.destroyHeatmap(heatmapId);
      });
    });

    it("the updateNativeState function must exist", function() {
      _verifyApiFunctionExists(function() {
        var heatmapId = 1;
        _heatmapApi.updateNativeState(heatmapId, _heatmapMock);
      });
    });

  });

  describe("when using the blue sphere api", function() {
    var EmscriptenBlueSphereApi = require("../../src/private/emscripten_api/emscripten_blue_sphere_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _blueSphereApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _blueSphereApi = new EmscriptenBlueSphereApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the updateNativeState function should exist", function() {
      _verifyApiFunctionExists(function() {
        var blueSphereModuleMock = {
          isEnabled: function() { return true; },
          getLocation: function() { return L.latLng(10.0, 20.0) },
          getElevation: function() { return 0.0 },
          getIndoorMapId: function() { return "" },
          getIndoorMapFloorId: function() { return 0 },
          getHeadingDegrees: function() { return 0.0 }
        };
        _blueSphereApi.updateNativeState(blueSphereModuleMock);
      });
    });
  });

  describe("when using the frame rate api", function() {
    var EmscriptenFrameRateApi = require("../../src/private/emscripten_api/emscripten_frame_rate_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _frameRateApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _frameRateApi = new EmscriptenFrameRateApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the setTargetVSyncInterval function must exist", function() {
      _verifyApiFunctionExists(function() {
        _frameRateApi.setTargetVSyncInterval(1);
      });
    });

    it("the setThrottledTargetFrameInterval function must exist", function() {
      _verifyApiFunctionExists(function() {
        _frameRateApi.setThrottledTargetFrameInterval(1);
      });
    });

    it("the setIdleSecondsBeforeThrottle function must exist", function() {
      _verifyApiFunctionExists(function() {
        _frameRateApi.setIdleSecondsBeforeThrottle(1);
      });
    });

    it("the setThrottleWhenIdleEnabled function must exist", function() {
      _verifyApiFunctionExists(function() {
        _frameRateApi.setThrottleWhenIdleEnabled(true);
      });
    });

    it("the cancelThrottle function must exist", function() {
      _verifyApiFunctionExists(function() {
        _frameRateApi.cancelThrottle();
      });
    });
  });

  describe("when using the map runtime api", function() {
    var EmscriptenMapRuntimeApi = require("../../src/private/emscripten_api/emscripten_map_runtime_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _mapRuntimeApi = null;
    var _emscriptenMemory = null;

    beforeEach(function(done) {
      refreshSdk();
      Module.then(() => {
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        _emscriptenMemory = new EmscriptenMemory(Module);
        _mapRuntimeApi = new EmscriptenMapRuntimeApi(apiPointer, cwrap, Module, _emscriptenMemory);
        done();
      });
    });

    it("the onPause function must exist", function() {
      _verifyApiFunctionExists(function() {
        _mapRuntimeApi.onPause();
      });
    });

    it("the onResume function must exist", function() {
      _verifyApiFunctionExists(function() {
        _mapRuntimeApi.onResume();
      });
    });

    it("the onRemove function must exist", function() {
      _verifyApiFunctionExists(function() {
        _mapRuntimeApi.onRemove();
      });
    });
  });

});
