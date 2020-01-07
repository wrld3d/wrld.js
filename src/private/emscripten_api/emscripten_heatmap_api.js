var elevationMode = require("../elevation_mode.js");
var heatmap = require("../../public/heatmap.js");
var interopUtils = require("./emscripten_interop_utils.js");


function EmscriptenHeatmapApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _heatmapApi_createHeatmap = cwrap("heatmapApi_createHeatmap", "number", [
        "number", "string", "number", "number", "number", "number", "number", "number", "number", "number",
        "number", "number", "number", "number", "number", "number", "number", "number", "number", "number",
        "number", "number", "number", "number", "number", "number", "number", "number", "number", "number",
        "number", "number", "number", "number", "number", "number", "number", "number"
    ]);
    var _heatmapApi_destroyHeatmap = cwrap("heatmapApi_destroyHeatmap", null, ["number", "number"]);
    var _heatmapApi_setIndoorMap = cwrap("heatmapApi_setIndoorMap", null, ["number", "number", "string", "number", "number"]);
    var _heatmapApi_setElevation = cwrap("heatmapApi_setElevation", null, ["number", "number", "number", "number"]);
    var _heatmapApi_setDensityBlend = cwrap("heatmapApi_setDensityBlend", null, ["number", "number", "number"]);
    var _heatmapApi_setInterpolateDensityByZoom = cwrap("heatmapApi_setInterpolateDensityByZoom", null, ["number", "number", "number", "number", "number"]);
    var _heatmapApi_setIntensityBias = cwrap("heatmapApi_setIntensityBias", null, ["number", "number", "number"]);
    var _heatmapApi_setIntensityScale = cwrap("heatmapApi_setIntensityScale", null, ["number", "number", "number"]);
    var _heatmapApi_setOpacity = cwrap("heatmapApi_setOpacity", null, ["number", "number", "number"]);
    var _heatmapApi_setColorGradient = cwrap("heatmapApi_setColorGradient", null, ["number", "number", "number", "number", "number", "number"]);
    var _heatmapApi_setResolution = cwrap("heatmapApi_setResolution", null, ["number", "number", "number"]);
    var _heatmapApi_setHeatmapDensities = cwrap("heatmapApi_setHeatmapDensities", null, ["number", "number", "number", "number", "number", "number", "number", "number"]);
    var _heatmapApi_useApproximation = cwrap("heatmapApi_useApproximation", null, ["number", "number", "number"]);
    var _heatmapApi_setData = cwrap("heatmapApi_setData", null, ["number", "number", "number", "number", "number", "number"]);



    function occludedMapFeaturesToInt(occludedMapFeatures) {
        var occludedMapFeaturesInt = 0;

        occludedMapFeatures.forEach(function(occlusionFeature) {
            if (occlusionFeature === heatmap.HeatmapOcclusionMapFeature.GROUND) {
                occludedMapFeaturesInt = occludedMapFeaturesInt | 0x1;
            }
            else if (occlusionFeature === heatmap.HeatmapOcclusionMapFeature.BUILDINGS) {
                occludedMapFeaturesInt = occludedMapFeaturesInt | 0x2;
            }
            else if (occlusionFeature === heatmap.HeatmapOcclusionMapFeature.TREES) {
                occludedMapFeaturesInt = occludedMapFeaturesInt | 0x4;
            }
            else if (occlusionFeature === heatmap.HeatmapOcclusionMapFeature.TRANSPORT) {
                occludedMapFeaturesInt = occludedMapFeaturesInt | 0x8;
            }
        });

        return occludedMapFeaturesInt;
    }

    function _buildFlatData(pointData) {
        var dataFlat = [];
        pointData.forEach(function(pointDatum) {
            dataFlat.push(pointDatum.latLng.lat);
            dataFlat.push(pointDatum.latLng.lng);
            var altOrDefault = 0.0;
            if (pointDatum.latLng.alt !== undefined) {
                altOrDefault = pointDatum.latLng.alt;
            }
            dataFlat.push(altOrDefault);
            dataFlat.push(pointDatum.weight);
        });

        return dataFlat;
    }

    this.createHeatmap = function(heatmap) {
        // polygon
        var polygonCoords = [];
        var polygonRingVertexCounts = [];

        heatmap.getPolygonPoints().forEach(function(ring) {
          polygonRingVertexCounts.push(ring.length);
          ring.forEach(function(point) {
            polygonCoords.push(point.lat);
            polygonCoords.push(point.lng);
            polygonCoords.push(point.alt ? point.alt : 0.0);
          });
        });

        if (polygonCoords.length === 0) {
            polygonRingVertexCounts.push(0);
        }

        var polygonVertexCoordsBuffer = _emscriptenMemory.createBufferFromArray(polygonCoords, _emscriptenMemory.createDoubleBuffer);
        var polygonRingVertexCountsBuffer = _emscriptenMemory.createBufferFromArray(polygonRingVertexCounts, _emscriptenMemory.createInt32Buffer);

        var indoorMapId = heatmap.getIndoorMapId();
        var indoorMapFloorId = heatmap.getIndoorMapFloorId();
        var elevation = heatmap.getElevation();
        var elevationModeInt = elevationMode.getElevationModeInt(heatmap.getElevationMode());

        // data
        var dataFlat = _buildFlatData(heatmap.getData());
        var pointDataBuf = _emscriptenMemory.createBufferFromArray(dataFlat, _emscriptenMemory.createDoubleBuffer);

        var heatmapDensityStops = [];
        var heatmapRadii = [];
        var heatmapGains = [];
        heatmap.getDensityStops().forEach(function(density) {
            heatmapDensityStops.push(density.stop);
            heatmapRadii.push(density.radius);
            heatmapGains.push(density.gain);
        });

        var gradientStops = [];
        var gradientColors = [];
        heatmap.getColorGradient().forEach(function(gradient) {
            gradientStops.push(gradient.stop);
            gradientColors.push(interopUtils.colorToRgba32(gradient.color));
        });

        // heatmap_todo investigate supporting ES6 for Float32Array / typed arrays
        var heatmapDensityStopsBuffer = _emscriptenMemory.createBufferFromArray(heatmapDensityStops, _emscriptenMemory.createDoubleBuffer);
        var heatmapRadiiBuffer = _emscriptenMemory.createBufferFromArray(heatmapRadii, _emscriptenMemory.createDoubleBuffer);
        var heatmapGainsBuffer = _emscriptenMemory.createBufferFromArray(heatmapGains, _emscriptenMemory.createDoubleBuffer);
        var gradientStopsBuffer = _emscriptenMemory.createBufferFromArray(gradientStops, _emscriptenMemory.createDoubleBuffer);
        var gradientColorsBuffer = _emscriptenMemory.createBufferFromArray(gradientColors, _emscriptenMemory.createInt32Buffer);
        var occludedMapFeaturesInt = occludedMapFeaturesToInt(heatmap.getOccludedMapFeatures());

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
            heatmapDensityStopsBuffer.ptr,
            heatmapDensityStopsBuffer.element_count,
            heatmapRadiiBuffer.ptr,
            heatmapRadiiBuffer.element_count,
            heatmapGainsBuffer.ptr,
            heatmapGainsBuffer.element_count,
            gradientStopsBuffer.ptr,
            gradientStopsBuffer.element_count,
            gradientColorsBuffer.ptr,
            gradientColorsBuffer.element_count,
            heatmap.getDensityBlend(),
            heatmap.getInterpolateDensityByZoom(),
            heatmap.getZoomMin(),
            heatmap.getZoomMax(),
            heatmap.getOpacity(),
            heatmap.getIntensityBias(),
            heatmap.getIntensityScale(),
            occludedMapFeaturesInt,
            heatmap.getOccludedAlpha(),
            heatmap.getOccludedSaturation(),
            heatmap.getOccludedBrightness()
        );

        _emscriptenMemory.freeBuffer(polygonVertexCoordsBuffer);
        _emscriptenMemory.freeBuffer(polygonRingVertexCountsBuffer);
        _emscriptenMemory.freeBuffer(pointDataBuf);
        _emscriptenMemory.freeBuffer(heatmapDensityStopsBuffer);
        _emscriptenMemory.freeBuffer(heatmapRadiiBuffer);
        _emscriptenMemory.freeBuffer(heatmapGainsBuffer);
        _emscriptenMemory.freeBuffer(gradientStopsBuffer);
        _emscriptenMemory.freeBuffer(gradientColorsBuffer);

        return heatmapId;
    };

    this.destroyHeatmap = function(heatmapId) {
        _heatmapApi_destroyHeatmap(_emscriptenApiPointer, heatmapId);
    };

    this.updateNativeState = function(heatmapId, heatmap) {
        if (!heatmap._anyChanged()) {
            return;
        }
        var changedFlags = heatmap._getChangedFlags();

        if (changedFlags.indoorMap) {
            var indoorMapId = heatmap.getIndoorMapId();
            _heatmapApi_setIndoorMap(
                _emscriptenApiPointer,
                heatmapId,
                indoorMapId,
                indoorMapId.length,
                heatmap.getIndoorMapFloorId()
                );
        }

        if (changedFlags.elevation) {
            var elevationModeInt = elevationMode.getElevationModeInt(heatmap.getElevationMode());
            _heatmapApi_setElevation(
                _emscriptenApiPointer,
                heatmapId,
                heatmap.getElevation(),
                elevationModeInt
                );
        }

        if (changedFlags.densityBlend) {
            _heatmapApi_setDensityBlend(
                _emscriptenApiPointer,
                heatmapId,
                heatmap.getDensityBlend()
            );
        }

        if (changedFlags.densityBlend) {
            _heatmapApi_setInterpolateDensityByZoom(
                _emscriptenApiPointer,
                heatmapId,
                heatmap.getInterpolateDensityByZoom(),
                heatmap.getZoomMin(),
                heatmap.getZoomMax()
            );
        }

        if (changedFlags.intensityBias) {
            _heatmapApi_setIntensityBias(
                _emscriptenApiPointer,
                heatmapId,
                heatmap.getIntensityBias()
            );
        }

        if (changedFlags.intensityScale) {
            _heatmapApi_setIntensityScale(
                _emscriptenApiPointer,
                heatmapId,
                heatmap.getIntensityScale()
            );
        }

        if (changedFlags.opacity) {
            _heatmapApi_setOpacity(
                _emscriptenApiPointer,
                heatmapId,
                heatmap.getOpacity()
            );
        }

        if (changedFlags.colorGradient) {
            var gradientStops = [];
            var gradientColors = [];
            heatmap.getColorGradient().forEach(function(gradient) {
                gradientStops.push(gradient.stop);
                gradientColors.push(interopUtils.colorToRgba32(gradient.color));
            });

            var gradientStopsBuffer = _emscriptenMemory.createBufferFromArray(gradientStops, _emscriptenMemory.createDoubleBuffer);
            var gradientColorsBuffer = _emscriptenMemory.createBufferFromArray(gradientColors, _emscriptenMemory.createInt32Buffer);

            _heatmapApi_setColorGradient(
                _emscriptenApiPointer,
                heatmapId,
                gradientStopsBuffer.ptr,
                gradientStopsBuffer.element_count,
                gradientColorsBuffer.ptr,
                gradientColorsBuffer.element_count
            );

            _emscriptenMemory.freeBuffer(gradientStopsBuffer);
            _emscriptenMemory.freeBuffer(gradientColorsBuffer);
        }

        if (changedFlags.resolution) {
            _heatmapApi_setResolution(
                _emscriptenApiPointer,
                heatmapId,
                heatmap.getResolutionPixels()
            );
        }

        if (changedFlags.densityStops) {
            var heatmapDensityStops = [];
            var heatmapRadii = [];
            var heatmapGains = [];
            heatmap.getDensityStops().forEach(function(density) {
                heatmapDensityStops.push(density.stop);
                heatmapRadii.push(density.radius);
                heatmapGains.push(density.gain);
            });

            var heatmapDensityStopsBuffer = _emscriptenMemory.createBufferFromArray(heatmapDensityStops, _emscriptenMemory.createDoubleBuffer);
            var heatmapRadiiBuffer = _emscriptenMemory.createBufferFromArray(heatmapRadii, _emscriptenMemory.createDoubleBuffer);
            var heatmapGainsBuffer = _emscriptenMemory.createBufferFromArray(heatmapGains, _emscriptenMemory.createDoubleBuffer);

            _heatmapApi_setHeatmapDensities(
                _emscriptenApiPointer,
                heatmapId,
                heatmapDensityStopsBuffer.ptr,
                heatmapDensityStopsBuffer.element_count,
                heatmapRadiiBuffer.ptr,
                heatmapRadiiBuffer.element_count,
                heatmapGainsBuffer.ptr,
                heatmapGainsBuffer.element_count
            );

            _emscriptenMemory.freeBuffer(heatmapDensityStopsBuffer);
            _emscriptenMemory.freeBuffer(heatmapRadiiBuffer);
            _emscriptenMemory.freeBuffer(heatmapGainsBuffer);
        }

        if (changedFlags.useApproximation) {
            _heatmapApi_useApproximation(
                _emscriptenApiPointer,
                heatmapId,
                heatmap.getUseApproximation() ? 1 : 0
            );
        }

        if (changedFlags.data) {

            var dataFlat = _buildFlatData(heatmap.getData());
            var pointDataBuf = _emscriptenMemory.createBufferFromArray(dataFlat, _emscriptenMemory.createDoubleBuffer);

            _heatmapApi_setData(
                _emscriptenApiPointer,
                heatmapId,
                pointDataBuf.ptr,
                pointDataBuf.element_count,
                heatmap.getWeightMin(),
                heatmap.getWeightMax()
                );

            _emscriptenMemory.freeBuffer(pointDataBuf);
        }


        heatmap._clearChangedFlags();
    };
}

module.exports = EmscriptenHeatmapApi;
