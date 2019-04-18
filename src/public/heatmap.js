var elevationMode = require("../private/elevation_mode.js");

var HeatmapOcclusionMapFeatures = {
    ground: "GROUND",
    buildings: "BUILDINGS",
    trees: "TREES",
    transport: "TRANSPORT"
};

var Heatmap = (L.Layer ? L.Layer : L.Class).extend({

    options: {
        dataCoordProperty: "latLng",
        dataWeightProperty: "weight",
        elevation: 0.0,
        elevationMode: elevationMode.ElevationModeType.HEIGHT_ABOVE_GROUND,
        indoorMapId: "",
        indoorMapFloorId: 0,
        polygonPoints: [],

        weightMin: 0.0,
        weightMax: 1.0,
        resolutionPixels: 512.0,
        textureBorderPercent: 0.05,
        useApproximation: true,

        densityStops: [
            {stop: 0.0, radius: 5.0, gain: 1.0},
            {stop: 1.0, radius: 15.0, gain: 1.0},
        ],
        densityBlend: 0.0,
        interpolateDensityByZoom: false,
        zoomMin: 15.0,
        zoomMax: 18.0,

        // Default gradient suitable for sequential data, with transparency near zero, similar to
        // http://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=5
        colorGradient: [
            {stop: 0.0, color: "#ffffff00"},
            {stop: 0.2, color: "#ffffb2ff"},
            {stop: 0.4, color: "#fecc5cff"},
            {stop: 0.6, color: "#fd8d3cff"},
            {stop: 0.8, color: "#f03b20ff"},
            {stop: 1.0, color: "#bd0026ff"}
        ],
        opacity: 1.0,
        intensityBias: 0.0,
        intensityScale: 1.0,
        occludedMapFeatures: [HeatmapOcclusionMapFeatures.buildings, HeatmapOcclusionMapFeatures.trees],
        occludedAlpha: 0.85,
        occludedSaturation: 0.7,
        occludedBrightness: 0.7
    },

    _loadPointData: function (pointData) {
        var weightedCoords = [];
        var dataCoordProperty = this.options.dataCoordProperty;
        var dataWeightProperty = this.options.dataWeightProperty;
        pointData.forEach(function (pointDatum) {
            var weight = 1.0;
            var coord = [];
            if (dataCoordProperty in pointData) {
                coord = L.latLng(pointDatum[dataCoordProperty]);

                if (dataWeightProperty in pointDatum) {
                    weight = pointDatum[dataWeightProperty];
                }
            }
            else {
                coord = L.latLng(pointDatum[0], pointDatum[1]);
                if (pointDatum.length > 2) {
                    weight = pointDatum[2];
                }
            }

            weightedCoords.push({
                coord: coord,
                weight: weight
            });
        });
        return weightedCoords;
    },

    _getArrayDepth: function (array) {
        var arrayDepth = 0;
        var testElement = array;
        do {
            testElement = testElement[0];
            arrayDepth++;
        } while (Array.isArray(testElement));
        return arrayDepth;
    },

    _loadLatLngAlts: function (coords) {
        var points = [];
        coords.forEach(function (coord) {
            points.push(L.latLng(coord));
        });
        return points;
    },

    _loadPolygonRings: function (coordsArray) {
        var polygonRings = [];
        var arrayDepth = this._getArrayDepth(coordsArray);

        if (arrayDepth === 2) {
            polygonRings.push(this._loadLatLngAlts(coordsArray));
        }
        else if (arrayDepth === 3) {
            coordsArray.forEach(function (holeCoords) {
                polygonRings.push(this._loadLatLngAlts(holeCoords));
            }, this);
        }
        else if (coordsArray.length === 0){
            polygonRings = [];
        }
        else {
            throw new Error("Incorrect array depth for heatmap options.polygonPoints.");
        }
        return polygonRings;
    },

    _loadDensityParams: function(densityParams) {
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
    },

    _loadDensityStops: function(densityStopsArray) {
        var densityStops = [];
        var arrayDepth = this._getArrayDepth(densityStopsArray);

        if (arrayDepth === 1 && typeof densityStopsArray[0] === "number") {
            densityStops.push(this._loadDensityParams(densityStopsArray));
        }
        else if (arrayDepth <= 2) {
            densityStopsArray.forEach(function (densityStopsSet) {
                densityStops.push(this._loadDensityParams(densityStopsSet));
            }, this);
        }
        else {
            throw new Error("Incorrect array depth for heatmap options.densityStops.");
        }
        return densityStops;
    },

    _loadColorStop: function(colorStopParams) {
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
    },

    _loadColorGradient: function(gradientStopsArray) {
        var colorGradient = [];
        var arrayDepth = this._getArrayDepth(gradientStopsArray);

        if (arrayDepth === 1 && typeof gradientStopsArray[0] === "number") {
            colorGradient.push(this._loadColorStop(gradientStopsArray));
        }
        else if (arrayDepth <= 2) {
            gradientStopsArray.forEach(function (gradientStop) {
                colorGradient.push(this._loadColorStop(gradientStop));
            }, this);
        }
        else {
            throw new Error("Incorrect array depth for heatmap options.colorGradient.");
        }
        return colorGradient;
    },

    initialize: function (pointData, options) {
        this.setOptions(options);
        this._pointData = this._loadPointData(pointData);
    },

    getPolygonPoints: function () {
        return this.options.polygonPoints;
    },

    getIndoorMapId: function () {
        return this.options.indoorMapId;
    },

    getIndoorMapFloorId: function () {
        return this.options.indoorMapFloorId;
    },

    getElevation: function () {
        return this.options.elevation;
    },

    getElevationMode: function () {
        return this.options.elevationMode;
    },

    getPointData: function () {
        return this._pointData;
    },

    getWeightMin: function () {
        return this.options.weightMin;
    },

    getWeightMax: function () {
        return this.options.weightMax;
    },

    getResolutionPixels: function () {
        return this.options.resolutionPixels;
    },

    getTextureBorderPercent: function () {
        return this.options.textureBorderPercent;
    },

    getUseApproximation: function () {
        return this.options.useApproximation;
    },

    getDensityStops: function () {
        return this.options.densityStops;
    },

    getDensityBlend: function () {
        return this.options.densityBlend;
    },

    getInterpolateDensityByZoom: function () {
        return this.options.interpolateDensityByZoom;
    },

    getZoomMin: function () {
        return this.options.zoomMin;
    },

    getZoomMax: function () {
        return this.options.zoomMax;
    },

    getColorGradient: function () {
        return this.options.colorGradient;
    },

    getOpacity: function () {
        return this.options.opacity;
    },

    getIntensityBias: function () {
        return this.options.intensityBias;
    },

    getIntensityScale: function () {
        return this.options.intensityScale;
    },

    getOccludedMapFeatures: function () {
        return this.options.occludedMapFeatures;
    },

    getOccludedAlpha: function () {
        return this.options.occludedAlpha;
    },

    getOccludedSaturation: function () {
        return this.options.occludedSaturation;
    },

    getOccludedBrightness: function () {
        return this.options.occludedBrightness;
    },

    ////

    setIndoorMapWithFloorId: function (indoorMapId, indoorMapFloorId) {
        this.options.indoorMapId = indoorMapId;
        this.options.indoorMapFloorId = indoorMapFloorId;
        this._changedFlags.indoorMap = true;
        return this;
    },

    setElevation: function (elevation) {
        this.options.elevation = elevation;
        this._changedFlags.elevation = true;
        return this;
    },

    setElevationMode: function (mode) {
        if (elevationMode.isValidElevationMode(mode)) {
            this.options.elevationMode = mode;
        }
        this._changedFlags.elevation = true;
        return this;
    },

    setDensityBlend: function (densityBlend) {
        this.options.densityBlend = densityBlend;
        this._changedFlags.densityBlend = true;
        return this;
    },

    setInterpolateDensityByZoom: function(interpolateDensityByZoom) {
        this.options.interpolateDensityByZoom = interpolateDensityByZoom;
        this._changedFlags.interpolateDensityByZoom = true;
        return this;
    },

    setZoomMin: function(zoomMin) {
        this.options.zoomMin = zoomMin;
        this._changedFlags.interpolateDensityByZoom = true;
        return this;
    },

    setZoomMax: function(zoomMax) {
        this.options.zoomMin = zoomMax;
        this._changedFlags.interpolateDensityByZoom = true;
        return this;
    },

    setIntensityBias: function (intensityBias) {
        this.options.intensityBias = intensityBias;
        this._changedFlags.intensityBias = true;
        return this;
    },

    setIntensityScale: function (intensityScale) {
        this.options.intensityScale = intensityScale;
        this._changedFlags.intensityScale = true;
        return this;
    },

    setOpacity: function (opacity) {
        this.options.opacity = opacity;
        this._changedFlags.opacity = true;
        return this;
    },

    setColorGradient: function (colorGradient) {
        this.options.colorGradient = this._loadColorGradient(colorGradient);
        this._changedFlags.colorGradient = true;
        return this;
    },

    setResolution: function (resolutionPixels) {
        this.options.resolutionPixels = resolutionPixels;
        this._changedFlags.resolution = true;
        return this;
    },

    setDensityStops: function (densityStops) {
        this.options.densityStops = this._loadDensityStops(densityStops);
        this._changedFlags.densityStops = true;
        return this;
    },

    setUseApproximation: function (useApproximation) {
        this.options.useApproximation = useApproximation;
        this._changedFlags.useApproximation = true;
        return this;
    },

    setData: function (pointData) {
        this._pointData = this._loadPointData(pointData);
        this._changedFlags.data = true;
        return this;
    },

    setWeightMin: function (weightMin) {
        this.options.weightMin = weightMin;
        this._changedFlags.data = true;
        return this;
    },

    setWeightMax: function (weightMax) {
        this.options.weightMax = weightMax;
        this._changedFlags.data = true;
        return this;
    },

    setOptions: function (options) {
        // todo_heatmap - only flag if changed
        L.setOptions(this, options);
        this.options.polygonPoints = this._loadPolygonRings(this.options.polygonPoints);
        this.options.densityStops = this._loadDensityStops(this.options.densityStops);
        this.options.colorGradient = this._loadColorGradient(this.options.colorGradient);

        Object.keys(this._changedFlags).forEach(function (key) {
            this._changedFlags[key] = true;
        }, this);

        return this;
    },

    _update: function () {
    },

    beforeAdd: function (map) {
        // don't call base, avoid assigning this._renderer
    },

    onAdd: function () {
        this._map.heatmaps.addHeatmap(this);
    },

    onRemove: function () {
        this._map.heatmaps.removeHeatmap(this);
    },

    redraw: function () {
    },

    _changedFlags: {
        indoorMap: false,
        elevation: false,
        densityBlend: false,
        interpolateDensityByZoom: false,
        intensityBias: false,
        intensityScale: false,
        opacity: false,
        colorGradient: false,
        occludedStyle: false,
        resolution: false,
        densityStops: false,
        useApproximation: false,
        data: false
    },

    _anyChanged: function () {
        return Object.values(this._changedFlags).some(Boolean);
    },

    _getChangedFlags: function () {
        return this._changedFlags;
    },

    _clearChangedFlags: function () {
        Object.keys(this._changedFlags).forEach(function (key) {
            this._changedFlags[key] = false;
        }, this);
    }
});

var heatmap = function (pointData, heatmapOptions) {
    return new Heatmap(pointData, heatmapOptions || {});
};

module.exports = {
    Heatmap: Heatmap,
    heatmap: heatmap,
    HeatmapOcclusionMapFeatures: HeatmapOcclusionMapFeatures
};