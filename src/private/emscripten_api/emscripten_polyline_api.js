var elevationMode = require("../elevation_mode.js");

function EmscriptenPolylineApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _removeGeofence = cwrap("polyline_temp_removeGeofence", null, ["number", "number"]);
    var _setGeofenceColor = cwrap("polyline_temp_setGeofenceColor", null, ["number", "number", "number", "number", "number", "number"]);
    var _createGeofenceFromRawCoords = cwrap("polyline_temp_createGeofenceFromRawCoords", null, ["number", "number", "number", "number", "number", "number", "number", "string", "number", "number"]);
    
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

      var coordsBuf = _emscriptenMemory.createBufferFromArray(coords, _emscriptenMemory.createDoubleBuffer);

      var ringVertexCountsBuf = _emscriptenMemory.createBufferFromArray(ringVertexCounts, _emscriptenMemory.createInt32Buffer);

      var indoorMapId = config.indoorMapId || "";
      var elevationModeAboveSeaLevel = this._getElevationIsAboveSeaLevelFromConfig(config);
      var altitudeOffset = this._getAltitudeOffsetFromConfig(config);
      
      var polygonId = _createGeofenceFromRawCoords(_emscriptenApiPointer,
          coordsBuf.ptr,
          coordsBuf.element_count,
          ringVertexCountsBuf.ptr,
          ringVertexCountsBuf.element_count,
          elevationModeAboveSeaLevel,
          altitudeOffset,
          indoorMapId,
          indoorMapId.length,
          config.indoorMapFloorId || 0
          );

      _emscriptenMemory.freeBuffer(coordsBuf);
      _emscriptenMemory.freeBuffer(ringVertexCountsBuf);

      return polygonId;
    };

    this.removeGeofence = function(polygonId) {
        _removeGeofence(_emscriptenApiPointer, polygonId);
    };

    this.setGeofenceColor = function(polygonId, color) {
        _setGeofenceColor(_emscriptenApiPointer, polygonId, color.x/255, color.y/255, color.z/255, color.w/255);
    };
}

module.exports = EmscriptenPolylineApi;