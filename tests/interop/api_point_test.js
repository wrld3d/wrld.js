// Populate environment globals.
window = { 
  createWrldModule: require("../../tmp/sdk/eeGeoWebGL.js"),
  location: { pathname: "" },
  encodeURIComponent: function(s) {}
};

Module = {};
L = {};

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
    // with (e.g.) "abort(9) at Error", so expect that. This catches 
    // JS errors and bad/missing interop method names. 
    
    try {
      caller();
    } catch(e) {
      var genericExpectedEmscriptenCrashPattern = /^abort\(\d*\) at Error.*/;

      if(typeof e !== 'string' || e.match(genericExpectedEmscriptenCrashPattern) == null) {
        fail(e);
      }
    }
  };

  function refreshSdk() {
    Module = {};
    window.createWrldModule(Module);
  }

  describe("when instantiating the native api", function() {
    var EmscriptenApi = require("../../src/private/emscripten_api/emscripten_api");
    refreshSdk();
    
    it("there should be no errors", function() {
      expect(function() {
        var mapApiObject = new EmscriptenApi(Module);
        var apiPointer = 0;
        var onUpdateCallback = function(deltaSeconds) {};
        var onDrawCallback = function(deltaSeconds) {};
        var onInitialStreamingCompletedCallback = function() {};
        mapApiObject.onInitialized(apiPointer, onUpdateCallback, onDrawCallback, onInitialStreamingCompletedCallback);
      }).not.toThrow();
    });
  });

  describe("when using the camera api", function() {
    var EmscriptenCameraApi = require("../../src/private/emscripten_api/emscripten_camera_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _cameraApi = null;
    var _emscriptenMemory = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _emscriptenMemory = new EmscriptenMemory(Module);
      _cameraApi = new EmscriptenCameraApi(apiPointer, cwrap, runtime, _emscriptenMemory);
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

  });

  describe("when using the themes api", function() {
    var EmscriptenThemesApi = require("../../src/private/emscripten_api/emscripten_themes_api");
    var _themesApi = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _themesApi = new EmscriptenThemesApi(apiPointer, cwrap, runtime);
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
    it("all functions should exist", function() {
      _verifyApiFunctionExists(function() {
        refreshSdk();
        var apiPointer = 0;
        var cwrap = Module.cwrap;
        var runtime = Module.Runtime;
        _geofenceApi = new EmscriptenGeofenceApi(apiPointer, cwrap, runtime, Module);
      });
    });
  });

  describe("when using the precache api", function() {
    var EmscriptenPrecacheApi = require("../../src/private/emscripten_api/emscripten_precache_api");
    var _precacheApi = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _precacheApi = new EmscriptenPrecacheApi(apiPointer, cwrap, runtime);
    });

    it("the beginPrecacheOperation function should exist", function() {
      _verifyApiFunctionExists(function() {
        var operationId = 0;
        var operation = { getCentre: function() { return L.latLng(0,0) }, getRadius: function() { return 1; } };
        _precacheApi.beginPrecacheOperation(operationId, operation);
      });
    });

    it("the cancelPrecacheOperation function should exist", function() {
      _verifyApiFunctionExists(function() {
        var operationId = 0;
        var operation = { getCentre: function() { return L.latLng(0,0) }, getRadius: function() { return 1; } };
        _precacheApi.beginPrecacheOperation(operationId, operation);
        _precacheApi.cancelPrecacheOperation(operationId);
      });
    });
  });

  describe("when using the spaces api", function() {
    var EmscriptenSpacesApi = require("../../src/private/emscripten_api/emscripten_spaces_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _spacesApi = null;
    var _emscriptenMemory = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _emscriptenMemory = new EmscriptenMemory(Module);
      _spacesApi = new EmscriptenSpacesApi(apiPointer, cwrap, runtime, _emscriptenMemory);
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

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _emscriptenMemory = new EmscriptenMemory(Module);
      _layerPointMappingApi = new EmscriptenLayerPointMappingApi(apiPointer, cwrap, runtime, _emscriptenMemory);      
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
    var _indoorsApi = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _indoorsApi = new EmscriptenIndoorsApi(apiPointer, cwrap, runtime);
    });   

    it("the setNotificationCallbacks function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback0 = function() {};
        var callback1 = function() {};
        var callback2 = function() {};
        var callback3 = function() {};
        var callback4 = function() {};
        var callback5 = function() {};
        _indoorsApi.setNotificationCallbacks(callback0, callback1, callback2, callback3, callback4, callback5);
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
  });

  describe("when using the expand floors api", function() {
    var EmscriptenExpandFloorsApi = require("../../src/private/emscripten_api/emscripten_expand_floors_api");
    var _expandFloorsApi = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _expandFloorsApi = new EmscriptenExpandFloorsApi(apiPointer, cwrap, runtime);
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

  describe("when using the highlight api", function() {
    var EmscriptenHighlightApi = require("../../src/private/emscripten_api/emscripten_highlight_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _highlightApi = null;
    var _emscriptenMemory = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _emscriptenMemory = new EmscriptenMemory(Module);
      _highlightApi = new EmscriptenHighlightApi(apiPointer, cwrap, runtime, _emscriptenMemory);
    });
    
    it("the registerEntityClickedCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _highlightApi.registerEntityClickedCallback(callback);
      });
    });
    
    it("the setEntityHighlights function should exist", function() {
      _verifyApiFunctionExists(function() {
        var ids = ["1000", "1001", "2001"];
        var color = [128, 0, 0, 128];
        _highlightApi.setEntityHighlights(ids, color);
      });
    });
    
    it("the clearEntityHighlights function should exist", function() {
      _verifyApiFunctionExists(function() {
        _highlightApi.clearEntityHighlights();
      });
    });
  });

  describe("when using the rendering api", function() {
    var EmscriptenRenderingApi = require("../../src/private/emscripten_api/emscripten_rendering_api");
    var EmscriptenMemory = require("../../src/private/emscripten_api/emscripten_memory");
    var _renderingApi = null;
    var _emscriptenMemory = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _emscriptenMemory = new EmscriptenMemory(Module);
      _renderingApi = new EmscriptenRenderingApi(apiPointer, cwrap, runtime, _emscriptenMemory);
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
});
