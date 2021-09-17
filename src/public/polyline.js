import { Polyline as _Polyline } from "leaflet";
import { ElevationModeType, isValidElevationMode } from "../private/elevation_mode.js";

export const Polyline = _Polyline.extend({

    initialize: function(latlngs, options) {
        _Polyline.prototype.initialize.call(this, latlngs, options);
    },

    options: {
        elevation: 0.0,
        elevationMode: ElevationModeType.HEIGHT_ABOVE_GROUND,
        indoorMapId: "",
        indoorMapFloorId: 0,
        weight: 3.0,
        miterLimit: 10.0
    },

    getPoints: function() {
        return this.getLatLngs();
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

    getWidth: function() {
        return this.options.weight;
    },

    getColor: function() {
        return this.options.color;
    },

    getMiterLimit: function() {
        return this.options.miterLimit;
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
        if (isValidElevationMode(mode)) {
            this.options.elevationMode = mode;
        }
        this._needsNativeUpdate = true;
        return this;
    },

    setOptions: function (options) {
        return this.setStyle(options);
    },

    setStyle: function (style) {
        _Polyline.prototype.setStyle.call(this, style);
        this._needsNativeUpdate = true;
        return this;
    },

    // dirty flag, for polyline_module use
    _needsNativeUpdate: false,

    _update: function () {
    },

    beforeAdd: function (map) {
        // don't call base, avoid assigning this._renderer
    },

    onAdd: function () {
        this._map._polylineModule.addPolyline(this);
    },

    onRemove: function () {
        this._map._polylineModule.removePolyline(this);
    },

    redraw: function () {
    }
});

export const polyline = (latlngs, polylineOptions) => new Polyline(latlngs, polylineOptions || {});
