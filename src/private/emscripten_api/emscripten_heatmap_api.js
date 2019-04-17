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
        "number", "number", "number", "number", "number"
    ]);
    var _heatmapApi_destroyHeatmap = cwrap("heatmapApi_destroyHeatmap", null, ["number", "number"]);
    var _heatmapApi_setIndoorMap = cwrap("heatmapApi_setIndoorMap", null, ["number", "number", "string", "number", "number"]);
    var _heatmapApi_setElevation = cwrap("heatmapApi_setElevation", null, ["number", "number", "number", "number"]);
    var _heatmapApi_setDensityBlend = cwrap("heatmapApi_setDensityBlend", null, ["number", "number", "number"]);
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
            if (occlusionFeature === heatmap.HeatmapOcclusionMapFeatures.ground) {
                occludedMapFeaturesInt = occludedMapFeaturesInt | 0x1;
            }
            else if (occlusionFeature === heatmap.HeatmapOcclusionMapFeatures.buildings) {
                occludedMapFeaturesInt = occludedMapFeaturesInt | 0x2;
            }
            else if (occlusionFeature === heatmap.HeatmapOcclusionMapFeatures.trees) {
                occludedMapFeaturesInt = occludedMapFeaturesInt | 0x4;
            }
            else if (occlusionFeature === heatmap.HeatmapOcclusionMapFeatures.transport) {
                occludedMapFeaturesInt = occludedMapFeaturesInt | 0x8;
            }
        });

        return occludedMapFeaturesInt;
    }

    function _getArrayDepth (array) {
        var arrayDepth = 0;
        var testElement = array;
        do {
            testElement = testElement[0];
            arrayDepth++;
        } while (Array.isArray(testElement));
        return arrayDepth;
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
        var arrayDepth = _getArrayDepth(coordsArray);

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

    function _loadDensityParams(densityParams) {
        var isArray = Array.isArray(densityParams);
        var stop = 0.0;
        var radius = 0.0;
        var gain = 0.0;

        if (isArray) {

            if (densityParams.length < 2) {
                throw new Error("Expected array [<stop>, <radius>, <(optional) gain>] when parsing options.densityStops");
            }
            stop = densityParams[0];
            radius = densityParams[1];
            gain = (densityParams.length > 2) ? densityParams[2] : 1.0;
        }
        else {
            if (densityParams.stop === undefined || densityParams.radius === undefined) {
                throw new Error("Expected object {stop:<stop>, radius:<radius>, (optional) gain:<gain>} when parsing options.densityStops");
            }

            stop = densityParams.stop;
            radius = densityParams.radius;
            gain = densityParams.gain || 1.0;
        }


        return {
            stop: stop,
            radius: radius,
            gain: gain
        };
    }

    function _loadDensityParamSets(densityStopsArray) {
        var densityStops = [];
        var arrayDepth = _getArrayDepth(densityStopsArray);

        if (arrayDepth === 1 && typeof densityStopsArray[0] === "number") {
            densityStops.push(_loadDensityParams(densityStopsArray));
        }
        else if (arrayDepth <= 2) {
            densityStopsArray.forEach(function (densityStopsSet) {
                densityStops.push(_loadDensityParams(densityStopsSet));
            });
        }
        else {
            throw new Error("Incorrect array depth for heatmap options.densityStops.");
        }
        return densityStops;
    }

    function _loadColorStop(colorStopParams) {
        var isArray = Array.isArray(colorStopParams);
        var stop = 0.0;
        var color = "#ffffffff";

        if (isArray) {
            if (colorStopParams.length < 2) {
                throw new Error("Expected array [<stop>, <color>] when parsing options.colorGradient");
            }
            stop = colorStopParams[0];
            color = colorStopParams[1];
        }
        else {
            if (colorStopParams.stop === undefined || colorStopParams.color === undefined) {
                throw new Error("Expected object {stop:<stop>, color:<color>} when parsing options.colorGradient");
            }

            stop = colorStopParams.stop;
            color = colorStopParams.color;
        }


        return {
            stop: stop,
            color: color
        };
    }

    function _loadGradient(gradientStopsArray) {
        var colorGradient = [];
        var arrayDepth = _getArrayDepth(gradientStopsArray);

        if (arrayDepth === 1 && typeof gradientStopsArray[0] === "number") {
            colorGradient.push(_loadColorStop(gradientStopsArray));
        }
        else if (arrayDepth <= 2) {
            gradientStopsArray.forEach(function (gradientStop) {
                colorGradient.push(_loadColorStop(gradientStop));
            });
        }
        else {
            throw new Error("Incorrect array depth for heatmap options.colorGradient.");
        }
        return colorGradient;
    }

    function _buildFlatData(pointData) {
        var dataFlat = [];
        pointData.forEach(function(pointDatum) {
            dataFlat.push(pointDatum.coord.lat);
            dataFlat.push(pointDatum.coord.lng);
            var altOrDefault = 0.0;
            if (pointDatum.coord.alt !== undefined) {
                altOrDefault = pointDatum.coord.alt;
            }
            dataFlat.push(altOrDefault);
            dataFlat.push(pointDatum.weight);
        });

        return dataFlat;
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

        var polygonVertexCoordsBuffer = _emscriptenMemory.createBufferFromArray(polygonCoords, _emscriptenMemory.createDoubleBuffer);
        var polygonRingVertexCountsBuffer = _emscriptenMemory.createBufferFromArray(polygonRingVertexCounts, _emscriptenMemory.createInt32Buffer);

        var indoorMapId = heatmap.getIndoorMapId();
        var indoorMapFloorId = heatmap.getIndoorMapFloorId();
        var elevation = heatmap.getElevation();
        var elevationModeInt = elevationMode.getElevationModeInt(heatmap.getElevationMode());

        // data
        var dataFlat = _buildFlatData(heatmap.getPointData());
        var pointDataBuf = _emscriptenMemory.createBufferFromArray(dataFlat, _emscriptenMemory.createDoubleBuffer);


        var densityParamSets = _loadDensityParamSets(heatmap.getDensityStops());
        var heatmapDensityStops = [];
        var heatmapRadii = [];
        var heatmapGains = [];
        densityParamSets.forEach(function(densityParams) {
            heatmapDensityStops.push(densityParams.stop);
            heatmapRadii.push(densityParams.radius);
            heatmapGains.push(densityParams.gain);
        });

        var colorGradient = _loadGradient(heatmap.getColorGradient());
        var gradientStops = [];
        var gradientColors = [];
        colorGradient.forEach(function(colorStop) {
            gradientStops.push(colorStop.stop);
            gradientColors.push(interopUtils.colorToRgba32(colorStop.color));
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
            var colorGradient = _loadGradient(heatmap.getColorGradient());
            var gradientStops = [];
            var gradientColors = [];
            colorGradient.forEach(function(colorStop) {
                gradientStops.push(colorStop.stop);
                gradientColors.push(interopUtils.colorToRgba32(colorStop.color));
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

            var densityParamSets = _loadDensityParamSets(heatmap.getDensityStops());
            var heatmapDensityStops = [];
            var heatmapRadii = [];
            var heatmapGains = [];
            densityParamSets.forEach(function(densityParams) {
                heatmapDensityStops.push(densityParams.stop);
                heatmapRadii.push(densityParams.radius);
                heatmapGains.push(densityParams.gain);
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

            var dataFlat = _buildFlatData(heatmap.getPointData());
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
