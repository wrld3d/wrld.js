var elevationMode = require("../elevation_mode.js");
var heatmap = require("../../public/heatmap.js");
var interopUtils = require("./emscripten_interop_utils.js");


function EmscriptenHeatmapApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _heatmapApi_createHeatmap = cwrap("heatmapApi_createHeatmap", "number", [
        "number", "string", "number", "number", "number", "number", "number", "number", "number", "number",
        "number", "number", "number", "number", "number", "number", "number", "number", "number", "number",
        "number", "number", "number", "number", "number", "number", "number", "number", "number", "number",
        "number", "number", "number"
    ]);
    var _heatmapApi_destroyHeatmap = cwrap("heatmapApi_destroyHeatmap", null, ["number", "number"]);
    var _heatmapApi_setIndoorMap = cwrap("heatmapApi_setIndoorMap", null, ["number", "number", "string", "number", "number"]);
    var _heatmapApi_setElevation = cwrap("heatmapApi_setElevation", null, ["number", "number", "number"]);
    var _heatmapApi_setStyleAttributes = cwrap("heatmapApi_setStyleAttributes", null, ["number", "number", "number", "number", "number"]);



    function occlusionMapFeaturesToInt(occlusionMapFeatures) {
        var occlusionMapFeaturesInt = 0;

        occlusionMapFeatures.forEach(function(occlusionFeature) {
            if (occlusionFeature === heatmap.HeatmapOcclusionMapFeatures.ground) {
                occlusionMapFeaturesInt = occlusionMapFeaturesInt | 0x1;
            }
            else if (occlusionFeature === heatmap.HeatmapOcclusionMapFeatures.buildings) {
                occlusionMapFeaturesInt = occlusionMapFeaturesInt | 0x2;
            }
            else if (occlusionFeature === heatmap.HeatmapOcclusionMapFeatures.trees) {
                occlusionMapFeaturesInt = occlusionMapFeaturesInt | 0x4;
            }
            else if (occlusionFeature === heatmap.HeatmapOcclusionMapFeatures.transport) {
                occlusionMapFeaturesInt = occlusionMapFeaturesInt | 0x8;
            }
        });

        return occlusionMapFeaturesInt;
    }

    function _loadLatLngAlts (coords) {
        var points = [];
        coords.forEach(function (coord) {
            points.push(L.latLng(coord));
        });
        return points;
    }

    function _loadPolygonRings (coordsArray) {
        var polygonRings = [];
        var arrayDepth = 0;
        var testElement = coordsArray;
        do {
            testElement = testElement[0];
            arrayDepth++;
        } while (Array.isArray(testElement));

        if (arrayDepth === 2) {
            polygonRings.push(_loadLatLngAlts(coordsArray));
        }
        else if (arrayDepth === 3) {
            coordsArray.forEach(function (holeCoords) {
                polygonRings.push(_loadLatLngAlts(holeCoords));
            });
        }
        else {
            throw new Error("Incorrect array depth for heatmap options.polygonPoints.");
        }
        return polygonRings;
    }

    this.createHeatmap = function(heatmap) {
        // polygon
        var polygonPoints = heatmap.getPolygonPoints();
        var polygonRings = _loadPolygonRings(polygonPoints);

        var polygonCoords = [];
        var polygonRingVertexCounts = [];

        polygonRings.forEach(function(ring) {
          polygonRingVertexCounts.push(ring.length);
          ring.forEach(function(point) {
            polygonCoords.push(point.lat);
            polygonCoords.push(point.lng);
            polygonCoords.push(point.alt ? point.alt : 0.0);
          });
        });

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

        var polygonVertexCoordsBuffer = _emscriptenMemory.createBufferFromArray(polygonCoords, _emscriptenMemory.createDoubleBuffer);
        var polygonRingVertexCountsBuffer = _emscriptenMemory.createBufferFromArray(polygonRingVertexCounts, _emscriptenMemory.createInt32Buffer);

        var indoorMapId = heatmap.getIndoorMapId();
        var indoorMapFloorId = heatmap.getIndoorMapFloorId();
        var elevation = heatmap.getElevation();
        var elevationModeInt = elevationMode.getElevationModeInt(heatmap.getElevationMode());
        var pointDataBuf = _emscriptenMemory.createBufferFromArray(dataFlat, _emscriptenMemory.createDoubleBuffer);

        var heatmapRadiiStops = [];
        var heatmapRadii = [];
        heatmap.getRadiusStops().forEach(function(pair) {
            heatmapRadiiStops.push(pair[0]);
            heatmapRadii.push(pair[1]);
        });

        var gradientStops = [];
        var gradientColors = [];
        heatmap.getColorGradient().forEach(function(pair) {
            gradientStops.push(pair[0]);
            gradientColors.push(interopUtils.colorToRgba32(pair[1]));
        });

        // heatmap_todo investigate supporting ES6 for Float32Array / typed arrays
        var heatmapRadiiStopsBuffer = _emscriptenMemory.createBufferFromArray(heatmapRadiiStops, _emscriptenMemory.createDoubleBuffer);
        var heatmapRadiiBuffer = _emscriptenMemory.createBufferFromArray(heatmapRadii, _emscriptenMemory.createDoubleBuffer);
        var gradientStopsBuffer = _emscriptenMemory.createBufferFromArray(gradientStops, _emscriptenMemory.createDoubleBuffer);
        var gradientColorsBuffer = _emscriptenMemory.createBufferFromArray(gradientColors, _emscriptenMemory.createInt32Buffer);
        var occlusionMapFeaturesInt = occlusionMapFeaturesToInt(heatmap.getOcclusionMapFeatures());

        var heatmapId = _heatmapApi_createHeatmap(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapId.length,
            indoorMapFloorId,
            elevation,
            elevationModeInt,
            polygonVertexCoordsBuffer.ptr,
            polygonVertexCoordsBuffer.element_count,
            polygonRingVertexCountsBuffer.ptr,
            polygonRingVertexCountsBuffer.element_count,
            pointDataBuf.ptr,
            pointDataBuf.element_count,
            heatmap.getWeightMin(),
            heatmap.getWeightMax(),
            heatmap.getResolutionPixels(),
            heatmap.getTextureBorderPercent(),
            heatmap.getUseApproximation() ? 1 : 0,
            heatmapRadiiStopsBuffer.ptr,
            heatmapRadiiStopsBuffer.element_count,
            heatmapRadiiBuffer.ptr,
            heatmapRadiiBuffer.element_count,
            gradientStopsBuffer.ptr,
            gradientStopsBuffer.element_count,
            gradientColorsBuffer.ptr,
            gradientColorsBuffer.element_count,
            heatmap.getRadiusBlend(),
            heatmap.getOpacity(),
            heatmap.getIntensityBias(),
            heatmap.getIntensityScale(),
            occlusionMapFeaturesInt,
            heatmap.getOccludedAlpha(),
            heatmap.getOccludedSaturation(),
            heatmap.getOccludedBrightness()
        );

        _emscriptenMemory.freeBuffer(polygonVertexCoordsBuffer);
        _emscriptenMemory.freeBuffer(polygonRingVertexCountsBuffer);
        _emscriptenMemory.freeBuffer(pointDataBuf);
        _emscriptenMemory.freeBuffer(heatmapRadiiBuffer);
        _emscriptenMemory.freeBuffer(heatmapRadiiStopsBuffer);
        _emscriptenMemory.freeBuffer(gradientStopsBuffer);
        _emscriptenMemory.freeBuffer(gradientColorsBuffer);

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
        var colorRGBA32 = interopUtils.colorToRgba32(heatmap.getColor());

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
