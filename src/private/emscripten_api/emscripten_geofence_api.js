function EmscriptenGeofenceApi(apiPointer, cwrap, runtime, emscriptenModule) {

    var _apiPointer = apiPointer;
    var _emscriptenModule = emscriptenModule;
    var _removeGeofence = cwrap("removeGeofence", null, ["number", "number"]);
    var _setGeofenceColor = cwrap("setGeofenceColor", null, ["number", "number", "number", "number", "number", "number"]);
    var _createGeofenceFromRawCoords = cwrap("createGeofenceFromRawCoords", null, ["number", "number", "number", "number", "number", "number", "number", "string", "number", "number"]);

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

      var polygonId = _createGeofenceFromRawCoords(_apiPointer, 
          coordsPointer, coords.length,
          ringVertexCountsPointer, ringVertexCounts.length, 
          config.offsetFromSeaLevel || false, 
          config.altitudeOffset || 0.0,
          indoorMapId,
          indoorMapId.length,
          config.indoorMapFloorId || 0
          );

      _emscriptenModule._free(coordsPointer);
      _emscriptenModule._free(ringVertexCountsPointer);

      return polygonId;
    };

    this.removeGeofence = function(polygonId) {
        _removeGeofence(_apiPointer, polygonId);
    };

    this.setGeofenceColor = function(polygonId, color) {
        _setGeofenceColor(_apiPointer, polygonId, color.x, color.y, color.z, color.w);
    };
}

module.exports = EmscriptenGeofenceApi;