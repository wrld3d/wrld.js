var elevationMode = require("../private/elevation_mode.js");

var Heatmap = (L.Layer ? L.Layer : L.Class).extend({

    options: {
        dataCoordProperty: "latLng",
        dataWeightProperty: "weight",
        elevation: 0.0,
        elevationMode: elevationMode.ElevationModeType.HEIGHT_ABOVE_GROUND,
        indoorMapId: "",
        indoorMapFloorId: 0,

        weightMin: 0.0,
        weightMax: 1.0,
        // todo_heatmaps remove
        weight: 3.0,
        miterLimit: 10.0
    },

    initialize: function(pointData, options) {
        L.setOptions(this, options);
        this._pointData = this._loadPointData(pointData);
    },


    // var _options = Object.assign(this.buildDefaultOptions(), options);

	_loadPointData: function(pointData) {
        var weightedCoords = [];
        var dataCoordProperty = this.options.dataCoordProperty;
        var dataWeightProperty = this.options.dataWeightProperty;
        pointData.forEach(function(pointDatum) {
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

    getPointData: function() {
        return this._pointData;
    },

    getWeightMin: function() {
        return this.options.weightMin;
    },

    getWeightMax: function() {
        return this.options.weightMax;
    },

    getIndoorMapId: function() {
        return this.options.indoorMapId;
    },

    getIndoorMapFloorId: function() {
        return this.options.indoorMapFloorId;
    },

    getElevation: function() {
        return this.options.elevation;
    },

    getElevationMode: function() {
        return this.options.elevationMode;
    },

    setIndoorMapWithFloorId: function(indoorMapId, indoorMapFloorId) {
        this.options.indoorMapId = indoorMapId;
        this.options.indoorMapFloorId = indoorMapFloorId;
        this._needsNativeUpdate = true;
        return this;
    },

    setElevation: function(elevation) {
        this.options.elevation = elevation;
        this._needsNativeUpdate = true;
        return this;
    },

    setElevationMode: function(mode) {
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

var heatmap = function(pointData, heatmapOptions) {
    return new Heatmap(pointData, heatmapOptions || {});
};

module.exports = {
    Heatmap: Heatmap,
    heatmap: heatmap
};