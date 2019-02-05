var elevationMode = require("../elevation_mode.js");

function EmscriptenPolylineApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _polylineApi_createPolyline = cwrap("polylineApi_createPolyline", "number", ["number", "string", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]);
    var _polylineApi_destroyPolyline = cwrap("polylineApi_destroyPolyline", null, ["number", "number"]);
    var _polylineApi_setColor = cwrap("polylineApi_setColor", null, ["number", "number", "number", "number", "number", "number"]);
    

    this.createPolyline = function(polylinePoints, polylineOptions) {
        var coords = [];
        polylinePoints.forEach(function(point) {
            coords.push(point.lat);
            coords.push(point.lng);
        });

        var coordsBuf = _emscriptenMemory.createBufferFromArray(coords, _emscriptenMemory.createDoubleBuffer);

        var indoorMapId = polylineOptions.indoorMapId || "";
        var elevationModeInt = elevationMode.getElevationModeInt(polylineOptions.elevationMode);
        
        var perPointElevations = [];
        var width = 5.0;
        var miterLimit = 10.0;
        
        
        var perPointElevationsBuf = _emscriptenMemory.createBufferFromArray(perPointElevations, _emscriptenMemory.createDoubleBuffer);
      
        var polylineId = _polylineApi_createPolyline(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapId.length,
            polylineOptions.indoorMapFloorId || 0,
            polylineOptions.elevation || 0.0,
            elevationModeInt,
            coordsBuf.ptr,
            coordsBuf.element_count,
            perPointElevationsBuf.ptr,
            perPointElevationsBuf.element_count,
            width,
            miterLimit
            );

        _emscriptenMemory.freeBuffer(coordsBuf);
        _emscriptenMemory.freeBuffer(perPointElevationsBuf);
        

        return polylineId;
    };

    this.destroyPolyline = function(polylineId) {
        _polylineApi_destroyPolyline(_emscriptenApiPointer, polylineId);
    };

    this.setColor = function(polylineId, color) {
        _polylineApi_setColor(_emscriptenApiPointer, polylineId, color.x/255, color.y/255, color.z/255, color.w/255);
    };
}

module.exports = EmscriptenPolylineApi;