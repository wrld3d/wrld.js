// Populate environment globals.
window = { 
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
      var sdkModule = "../../tmp/sdk/eeGeoWebGL.js";
      delete require.cache[require.resolve(sdkModule)];
      require(sdkModule);
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
    var _cameraApi = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _cameraApi = new EmscriptenCameraApi(apiPointer, cwrap, runtime);
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

    it("the setEventCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function () {};
        _cameraApi.setEventCallback(callback);
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
        _geofenceApi = new EmscriptenGeofenceApi(apiPointer, cwrap, runtime);
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
        _precacheApi.cancelPrecacheOperation(operationId);
      });
    });
  });

  describe("when using the spaces api", function() {
    var EmscriptenSpacesApi = require("../../src/private/emscripten_api/emscripten_spaces_api");
    var _spacesApi = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _spacesApi = new EmscriptenSpacesApi(apiPointer, cwrap, runtime);
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
  });

  describe("when using the screen point mapping api", function() {
    var EmscriptenScreenPointMappingApi = require("../../src/private/emscripten_api/emscripten_screen_point_mapping_api");
    var ScreenPointMapping = require("../../src/private/screen_point_mapping");
    var _screenPointMappingApi = null;
    var _screenPointMapping = null;

    beforeEach(function() {
      refreshSdk();
      var apiPointer = 0;
      var cwrap = Module.cwrap;
      var runtime = Module.Runtime;
      _screenPointMappingApi = new EmscriptenScreenPointMappingApi(apiPointer, cwrap, runtime);

      var layer = { getLatLng: function() { return L.latLng(0, 0); }, getElevation: function() { return 0; } }; 
      _screenPointMapping = new ScreenPointMapping(layer);
    });   

    it("the createScreenPointMapping function should exist", function() {
      _verifyApiFunctionExists(function() {
        var mappingId = 0;
        _screenPointMappingApi.createScreenPointMapping(mappingId, _screenPointMapping);
      });
    });

    it("the createScreenPointMapping function should exist", function() {
      _verifyApiFunctionExists(function() {
        var mappingId = 0;
        _screenPointMappingApi.createScreenPointMapping(mappingId, _screenPointMapping);
        _screenPointMappingApi.updateScreenPointMapping(mappingId, _screenPointMapping);
      });
    });

    it("the createScreenPointMapping function should exist", function() {
      _verifyApiFunctionExists(function() {
        var mappingId = 0;
        _screenPointMappingApi.createScreenPointMapping(mappingId, _screenPointMapping);
        _screenPointMappingApi.removeScreenPointMapping(mappingId);
      });
    });

    it("the getScreenPosition function should exist", function() {
      _verifyApiFunctionExists(function() {
        var mappingId = 0;
        _screenPointMappingApi.createScreenPointMapping(mappingId, _screenPointMapping);
        _screenPointMappingApi.getScreenPosition(mappingId);
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

    it("the registerIndoorMapEnteredCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _indoorsApi.registerIndoorMapEnteredCallback(callback);
      });
    });

    it("the registerIndoorMapExitedCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _indoorsApi.registerIndoorMapExitedCallback(callback);
      });
    });

    it("the registerIndoorMapFloorChangedCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _indoorsApi.registerIndoorMapFloorChangedCallback(callback);
      });
    });

    it("the registerIndoorMapMarkerAddedCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _indoorsApi.registerIndoorMapMarkerAddedCallback(callback);
      });
    });

    it("the registerIndoorMapMarkerRemovedCallback function should exist", function() {
      _verifyApiFunctionExists(function() {
        var callback = function() {};
        _indoorsApi.registerIndoorMapMarkerRemovedCallback(callback);
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

    it("the getFloorId function should exist", function() {
      _verifyApiFunctionExists(function() {
        var floorIndex = 0;
        _indoorsApi.getFloorId(floorIndex);
      });
    });

    it("the getFloorName function should exist", function() {
      _verifyApiFunctionExists(function() {
        var floorIndex = 0;
        _indoorsApi.getFloorName(floorIndex);
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
});
