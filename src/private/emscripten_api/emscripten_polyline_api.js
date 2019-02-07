var elevationMode = require("../elevation_mode.js");
var space = require("../../public/space");

function EmscriptenPolylineApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _polylineApi_createPolyline = cwrap("polylineApi_createPolyline", "number", ["number", "string", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]);
    var _polylineApi_destroyPolyline = cwrap("polylineApi_destroyPolyline", null, ["number", "number"]);
    var _polylineApi_setIndoorMap = cwrap("polylineApi_setIndoorMap", null, ["number", "number", "string", "number", "number"]);
    var _polylineApi_setElevation = cwrap("polylineApi_setElevation", null, ["number", "number", "number"]);
    var _polylineApi_setStyleAttributes = cwrap("polylineApi_setStyleAttributes", null, ["number", "number", "number", "number", "number"]);


    function vec4ToRgba32(v) {
        var rgba = ((v.x & 0xFF) << 24) + ((v.y & 0xFF) << 16) + ((v.z & 0xFF) << 8) + (v.w & 0xFF);
        return rgba;
    }

    function hexToRgba32(hex) {
        // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

        hex = hex.replace(/^#/, "");
        var a = 0xff;
        if (hex.length === 8) {
            a = parseInt(hex.slice(6, 8), 16) & 0xff;
        }
        else if (hex.length === 4) {
            a = parseInt(hex.slice(3, 4).repeat(2), 16) & 0xff;
        }

        var rgb = 0xffffff;
        if (hex.length === 6 || hex.length === 8) {
            rgb = parseInt(hex.substring(0, 6), 16) & 0xffffff;
        }
        else if (hex.length === 3 || hex.length === 4) {
            rgb = parseInt((hex[0].repeat(2) + hex[1].repeat(2) + hex[2].repeat(2)), 16) & 0xffffff;
        }

        return (rgb << 8) + a;
    }

    function colorToRgba32(color) {
        if (typeof(color) === "string") {
            return hexToRgba32(color);
        }
        else {
            var v = new space.Vector4(color);
            return vec4ToRgba32(v);
        }
    }

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
        var colorRGBA32 = colorToRgba32(polyline.getColor());
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
        var colorRGBA32 = colorToRgba32(polyline.getColor());

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