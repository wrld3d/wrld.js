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
        radiusStops: [
            [0.0, 5.0],
            [1.0, 15.0]
        ],
        radiusBlend: 0.0,
        colorGradient: [
            [0.0, "#ffffff00"],
            [0.2, "#f0f9e8ff"],
            [0.4, "#bae4bcff"],
            [0.6, "#7bccc4ff"],
            [0.8, "#43a2caff"],
            [1.0, "#0868acff"]
        ],
        opacity: 1.0,
        intensityBias: 0.0,
        intensityScale: 1.0,
        occlusionMapFeatures: [HeatmapOcclusionMapFeatures.buildings, HeatmapOcclusionMapFeatures.trees],
        occludedAlpha: 0.85,
        occludedSaturation: 0.7,
        occludedBrightness: 0.7
    },

    initialize: function (pointData, options) {
        L.setOptions(this, options);
        this._pointData = this._loadPointData(pointData);
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
                coord = L.latLng(pointDatum);
            }

            weightedCoords.push({
                coord: coord,
                weight: weight
            });
        });
        return weightedCoords;
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

    getRadiusStops: function () {
        return this.options.radiusStops;
    },

    getRadiusBlend: function () {
        return this.options.radiusBlend;
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

    getOcclusionMapFeatures: function () {
        return this.options.occlusionMapFeatures;
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
        this._needsNativeUpdate = true;
        return this;
    },

    setElevation: function (elevation) {
        this.options.elevation = elevation;
        this._needsNativeUpdate = true;
        return this;
    },

    setElevationMode: function (mode) {
        if (elevationMode.isValidElevationMode(mode)) {
            this.options.elevationMode = mode;
        }
        this._needsNativeUpdate = true;
        return this;
    },

    setOptions: function (options) {
        L.setOptions(this, options);
        return this;
    },

    setStyle: function (style) {
        L.Heatmap.prototype.setStyle.call(this, style);
        this._needsNativeUpdate = true;
        return this;
    },

    // dirty flag, for heatmap_module use
    _needsNativeUpdate: false,

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