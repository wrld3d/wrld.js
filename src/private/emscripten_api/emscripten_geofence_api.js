var elevationMode = require("../elevation_mode.js");
var interopUtils = require("./emscripten_interop_utils.js");

function EmscriptenGeofenceApi(eegeoApiPointer, cwrap, emscriptenModule) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _emscriptenModule = emscriptenModule;
    var _removeGeofence = cwrap("removeGeofence", null, ["number", "number"]);
    var _setGeofenceColor = cwrap("setGeofenceColor", null, ["number", "number", "number", "number", "number", "number"]);
    var _createGeofenceFromRawCoords = cwrap("createGeofenceFromRawCoords", null, ["number", "number", "number", "number", "number", "number", "number", "string", "number", "number"]);
    
    this._getElevationIsAboveSeaLevelFromConfig = function(config) {
        var configUsingNewApi = typeof config.elevationMode !== "undefined";
        return configUsingNewApi ? config.elevationMode.toLowerCase() === elevationMode.ElevationModeType.HEIGHT_ABOVE_SEA_LEVEL.toLowerCase() : 
            (config.offsetFromSeaLevel || false);
    };
    
    this._getAltitudeOffsetFromConfig = function(config) {
        var configUsingNewApi = typeof config.elevation !== "undefined";
        return configUsingNewApi ? config.elevation : (config.altitudeOffset || 0.0);
    };

    this.createGeofence = function(outerPoints, holes, config) {
      var coords = [];
      var ringVertexCounts = [];
      ringVertexCounts.push(outerPoints.length);
      outerPoints.forEach(function(point) {
        coords.push(point.lat);
        coords.push(point.lng);
      });

      holes.forEach(function(ring) {
        ringVertexCounts.push(ring.length);
        ring.forEach(function(point) {
          coords.push(point.lat);
          coords.push(point.lng);
        });
      });

      var coordsPointer = _emscriptenModule._malloc(coords.length * 8);
      for (var i=0; i<coords.length; ++i) {
          _emscriptenModule.setValue(coordsPointer + i*8, coords[i], "double");
      }

      var ringVertexCountsPointer = _emscriptenModule._malloc(ringVertexCounts.length * 4);
      for (var k=0; k<ringVertexCounts.length; ++k) {
          _emscriptenModule.setValue(ringVertexCountsPointer + k*4, ringVertexCounts[k], "i32");
      }

      var indoorMapId = config.indoorMapId || "";      
      var elevationModeAboveSeaLevel = this._getElevationIsAboveSeaLevelFromConfig(config);
      var altitudeOffset = this._getAltitudeOffsetFromConfig(config);     
      
      var polygonId = _createGeofenceFromRawCoords(_eegeoApiPointer, 
          coordsPointer, coords.length,
          ringVertexCountsPointer, ringVertexCounts.length,
          elevationModeAboveSeaLevel, 
          altitudeOffset,
          indoorMapId,
          indoorMapId.length,
          config.indoorMapFloorId || 0
          );

      _emscriptenModule._free(coordsPointer);
      _emscriptenModule._free(ringVertexCountsPointer);

      return polygonId;
    };

    this.removeGeofence = function(polygonId) {
        _removeGeofence(_eegeoApiPointer, polygonId);
    };

    this.setGeofenceColor = function(polygonId, color) {
        var colorVec4 = interopUtils.colorToVec4(color);
        _setGeofenceColor(_eegeoApiPointer, polygonId, colorVec4.x/255, colorVec4.y/255, colorVec4.z/255, colorVec4.w/255);
    };
}

module.exports = EmscriptenGeofenceApi;