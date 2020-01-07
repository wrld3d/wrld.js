var elevationMode = require("../elevation_mode.js");
var interopUtils = require("./emscripten_interop_utils.js");

function EmscriptenPolylineApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _polylineApi_createPolyline = cwrap("polylineApi_createPolyline", "number", ["number", "string", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]);
    var _polylineApi_destroyPolyline = cwrap("polylineApi_destroyPolyline", null, ["number", "number"]);
    var _polylineApi_setIndoorMap = cwrap("polylineApi_setIndoorMap", null, ["number", "number", "string", "number", "number"]);
    var _polylineApi_setElevation = cwrap("polylineApi_setElevation", null, ["number", "number", "number"]);
    var _polylineApi_setStyleAttributes = cwrap("polylineApi_setStyleAttributes", null, ["number", "number", "number", "number", "number"]);

    this.createPolyline = function(polyline) {
        var coords = [];
        var perPointElevations = [];
        var anyAltitudes = false;
        polyline.getLatLngs().forEach(function(latLng) {
            coords.push(latLng.lat);
            coords.push(latLng.lng);
            var altOrDefault = 0.0;
            if (latLng.alt !== undefined) {
                anyAltitudes = true;
                altOrDefault = latLng.alt;
            }
            perPointElevations.push(altOrDefault);
        });

        if (!anyAltitudes) {
            perPointElevations = [];
        }

        var coordsBuf = _emscriptenMemory.createBufferFromArray(coords, _emscriptenMemory.createDoubleBuffer);
        var perPointElevationsBuf = _emscriptenMemory.createBufferFromArray(perPointElevations, _emscriptenMemory.createDoubleBuffer);

        var indoorMapId = polyline.getIndoorMapId();
        var indoorMapFloorId = polyline.getIndoorMapFloorId();
        var elevation = polyline.getElevation();
        var elevationModeInt = elevationMode.getElevationModeInt(polyline.getElevationMode());
        var width = polyline.getWidth();
        var colorRGBA32 = interopUtils.colorToRgba32(polyline.getColor());
        var miterLimit = polyline.getMiterLimit();

        var polylineId = _polylineApi_createPolyline(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapId.length,
            indoorMapFloorId,
            elevation,
            elevationModeInt,
            coordsBuf.ptr,
            coordsBuf.element_count,
            perPointElevationsBuf.ptr,
            perPointElevationsBuf.element_count,
            width,
            colorRGBA32,
            miterLimit
            );

        _emscriptenMemory.freeBuffer(coordsBuf);
        _emscriptenMemory.freeBuffer(perPointElevationsBuf);


        return polylineId;
    };

    this.destroyPolyline = function(polylineId) {
        _polylineApi_destroyPolyline(_emscriptenApiPointer, polylineId);
    };

    this.updateNativeState = function(polylineId, polyline) {
        if (!polyline._needsNativeUpdate) {
            return;
        }
        polyline._needsNativeUpdate = false;

        var indoorMapId = polyline.getIndoorMapId();
        var elevationModeInt = elevationMode.getElevationModeInt(polyline.getElevationMode());
        var colorRGBA32 = interopUtils.colorToRgba32(polyline.getColor());

        _polylineApi_setIndoorMap(
            _emscriptenApiPointer,
            polylineId,
            indoorMapId,
            indoorMapId.length,
            polyline.getIndoorMapFloorId()
            );

        _polylineApi_setElevation(
            _emscriptenApiPointer,
            polylineId,
            polyline.getElevation(),
            elevationModeInt
            );

        _polylineApi_setStyleAttributes(
            _emscriptenApiPointer,
            polylineId,
            polyline.getWidth(),
            colorRGBA32,
            polyline.getMiterLimit()
            );
    };
}

module.exports = EmscriptenPolylineApi;