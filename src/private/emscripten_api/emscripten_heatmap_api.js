var elevationMode = require("../elevation_mode.js");
var space = require("../../public/space");

function EmscriptenHeatmapApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _heatmapApi_createHeatmap = cwrap("heatmapApi_createHeatmap", "number", ["number", "string", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]);
    var _heatmapApi_destroyHeatmap = cwrap("heatmapApi_destroyHeatmap", null, ["number", "number"]);
    var _heatmapApi_setIndoorMap = cwrap("heatmapApi_setIndoorMap", null, ["number", "number", "string", "number", "number"]);
    var _heatmapApi_setElevation = cwrap("heatmapApi_setElevation", null, ["number", "number", "number"]);
    var _heatmapApi_setStyleAttributes = cwrap("heatmapApi_setStyleAttributes", null, ["number", "number", "number", "number", "number"]);

// todo_heatmap - DRY, move to general helper
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

    this.createHeatmap = function(heatmap) {
        // polygon
        var coords = [];
        var perPointElevations = [];

        // data
        var dataFlat = [];
        heatmap.getPointData().forEach(function(pointDatum) {
            dataFlat.push(pointDatum.coord.lat);
            dataFlat.push(pointDatum.coord.lng);
            var altOrDefault = 0.0;
            if (pointDatum.coord.alt !== undefined) {
                altOrDefault = pointDatum.coord.alt;
            }
            dataFlat.push(altOrDefault);
            dataFlat.push(pointDatum.weight);
        });

        var coordsBuf = _emscriptenMemory.createBufferFromArray(coords, _emscriptenMemory.createDoubleBuffer);
        var perPointElevationsBuf = _emscriptenMemory.createBufferFromArray(perPointElevations, _emscriptenMemory.createDoubleBuffer);

        var indoorMapId = heatmap.getIndoorMapId();
        var indoorMapFloorId = heatmap.getIndoorMapFloorId();
        var elevation = heatmap.getElevation();
        var elevationModeInt = elevationMode.getElevationModeInt(heatmap.getElevationMode());

        var pointDataBuf = _emscriptenMemory.createBufferFromArray(dataFlat, _emscriptenMemory.createDoubleBuffer);

        var weightMin = heatmap.getWeightMin();
        var weightMax = heatmap.getWeightMax();


        var heatmapId = _heatmapApi_createHeatmap(
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
            pointDataBuf.ptr,
            pointDataBuf.element_count,
            weightMin,
            weightMax
            );

        _emscriptenMemory.freeBuffer(coordsBuf);
        _emscriptenMemory.freeBuffer(perPointElevationsBuf);
        _emscriptenMemory.freeBuffer(pointDataBuf);

        return heatmapId;
    };

    this.destroyHeatmap = function(heatmapId) {
        _heatmapApi_destroyHeatmap(_emscriptenApiPointer, heatmapId);
    };

    this.updateNativeState = function(heatmapId, heatmap) {
        if (!heatmap._needsNativeUpdate) {
            return;
        }
        heatmap._needsNativeUpdate = false;

        var indoorMapId = heatmap.getIndoorMapId();
        var elevationModeInt = elevationMode.getElevationModeInt(heatmap.getElevationMode());
        var colorRGBA32 = colorToRgba32(heatmap.getColor());

        _heatmapApi_setIndoorMap(
            _emscriptenApiPointer,
            heatmapId,
            indoorMapId,
            indoorMapId.length,
            heatmap.getIndoorMapFloorId()
            );

        _heatmapApi_setElevation(
            _emscriptenApiPointer,
            heatmapId,
            heatmap.getElevation(),
            elevationModeInt
            );

        _heatmapApi_setStyleAttributes(
            _emscriptenApiPointer,
            heatmapId,
            heatmap.getWidth(),
            colorRGBA32,
            heatmap.getMiterLimit()
            );
    };
}

module.exports = EmscriptenHeatmapApi;
