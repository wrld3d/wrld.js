function EmscriptenGeofenceApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;

    var _removeGeofence = cwrap("removeGeofence", null, ["number", "number"]);
    var _setGeofenceColor = cwrap("setGeofenceColor", null, ["number", "number", "number", "number", "number", "number"]);
    var _createGeofenceWithHoles = cwrap("createGeofenceWithHoles", null, ["number", "number", "number", "number", "number", "number", "number"]);

    this.createGeofenceWithHoles = function(polygonId, outerPoints, holes) {
      var outerData = [];
      var holesData = [];
      var holesLengths = [];
      outerPoints.forEach(function(point) {
        outerData.push(point.lat);
        outerData.push(point.lng);
        outerData.push(point.alt || 0);
      });

      holes.forEach(function(ring) {
        holesLengths.push(ring.length*3);
        ring.forEach(function(point) {
          holesData.push(point.lat);
          holesData.push(point.lng);
          holesData.push(point.alt || 0);
        });
      });

      var outerDataPointer = Module._malloc(outerData.length * 8);
      for (var i=0; i<outerData.length; ++i) {
          Module.setValue(outerDataPointer + i*8, outerData[i], "double");
      }

      var holesDataPointer = Module._malloc(holesData.length * 8);
      for (var j=0; j<holesData.length; ++j) {
          Module.setValue(holesDataPointer+ j*8, holesData[j], "double");
      }

      var innerRingLengthsPointer = Module._malloc(holesLengths.length * 4);
      for (var k=0; k<holesLengths.length; ++k) {
          Module.setValue(innerRingLengthsPointer + k*4, holesLengths[k], "i32");
      }

      _createGeofenceWithHoles(_apiPointer, polygonId, outerDataPointer, outerData.length, holesDataPointer, holes.length, innerRingLengthsPointer);

      Module._free(outerDataPointer);
      Module._free(holesDataPointer);
      Module._free(innerRingLengthsPointer);
    };

    this.removeGeofence = function(polygonId) {
        _removeGeofence(_apiPointer, polygonId);
    };

    this.setGeofenceColor = function(polygonId, color) {
        _setGeofenceColor(_apiPointer, polygonId, color.x, color.y, color.z, color.w);
    };
}

module.exports = EmscriptenGeofenceApi;