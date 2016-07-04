var popups = require("../public/popup.js");

var EegeoLeafletMap = L.Map.extend({

    _worldToScreen: null,
    _ready: false,
    _cameraModule: null,
    _screenPointMappingModule: null,
    _precacheModule: null,

    themes: null,

    indoors: null,

    initialize: function(id, options, cameraModule, screenPointMappingModule, precacheModule, themesModule, indoorsModule, polygonModule) {
        this._cameraModule = cameraModule;
        this._screenPointMappingModule = screenPointMappingModule;
        this._precacheModule = precacheModule;
        this.themes = themesModule;
        this.indoors = indoorsModule;
        this.polygons = polygonModule;

        L.Map.prototype.initialize.call(this, id, options);

        this.dragging.disable();
        this.touchZoom.disable();
        this.doubleClickZoom.disable();
        this.scrollWheelZoom.disable();
        this.boxZoom.disable();
        this.keyboard.disable();

        this.attributionControl.addAttribution("3D Maps &copy; <a href='https://www.eegeo.com'>eeGeo</a> and <a href='https://www.eegeo.com/legal/'>partners</a>");
    },

    addLayer: function(layer) {
        L.Map.prototype.addLayer.call(this, layer);
        if ("getElevation" in layer) {
            this._screenPointMappingModule.addLayer(layer);
        }
    },

    removeLayer: function(layer) {
        if ("getElevation" in layer) {
            this._screenPointMappingModule.removeLayer(layer);
        }
        L.Map.prototype.removeLayer.call(this, layer);
    },

    onInitialized: function(emscriptenApi) {
        this._worldToScreen = emscriptenApi.spacesApi.worldToScreen;
        this._ready = true;
        var panes = this.getPanes();
        panes.mapPane.style["z-index"] = "10";
        panes.mapPane.style["pointer-events"] = "initial";
        panes.overlayPane.style["pointer-events"] = "none";
    },

    getScreenPositionOfLayer: function(layer) {
        var layerPoint = this._screenPointMappingModule.tryGetScreenPositionOfLayer(layer);
        if (layerPoint === null) {
            layerPoint = this.latLngToLayerPoint(layer.getLatLng());
        }
        layerPoint = L.point(layerPoint.x, layerPoint.y);
        return layerPoint;
    },

    latLngToLayerPoint: function(latlng) {
        if (!this._ready) {
            return L.point(-100, -100);
        }
        var vec = this._worldToScreen(latlng);
        return L.point(vec.x, vec.y);
    },

    latLngToContainerPoint: function(point) {
        return this.latLngToLayerPoint(point);
    },

    containerPointToLayerPoint: function(point) {
        return point;
    },

    layerPointToContainerPoint: function(point) {
        return point;
    },

    setView: function(center, zoom, options) {
        // Superclass' implementation of setView does some initialization so we have to call it
        L.Map.prototype.setView.call(this, center, zoom, options);
        
        var config = { location: center, zoom: zoom };
        this._cameraModule.setView(config);
        return this;
    },

    setZoom: function() {
        return this;
    },

    zoomIn: function() {
        return this;
    },

    zoomOut: function() {
        return this;
    },

    setZoomAround: function() {
        return this;
    },

    fitBounds: function(bounds, options) {
        var config = { bounds: bounds };
        this._cameraModule.setViewToBounds(config);
        return this;
    },

    fitWorld: function() {
        return this;
    },

    panTo: function() {
        return this;
    },

    panInsideBounds: function() {
        return this;
    },

    panBy: function() {
        return this;
    },

    setMaxBounds: function() {
        return this;
    },

    locate: function() {
        return this;
    },

    stopLocate: function() {
        return this;
    },

    remove: function() {
        return this;
    },

    openPopup: function(popup, latLng, options) {
        if (!(popup instanceof L.Popup)) {
            var content = popup;
            popup = new popups.Popup(options)
                .setLatLng(latLng)
                .setContent(content);
        }

        return L.Map.prototype.openPopup.call(this, popup, latLng, options);
    },

    update: function() {
        this.eachLayer(function (layer) {
            if (layer.update) {
                layer.update();
            }
            else if (layer.redraw) {
                layer.redraw();
            }
        });
    },

    precache: function(centre, radius, completionCallback) {
        return this._precacheModule.precache(centre, radius, completionCallback);
    },

    _rawPanBy: function(offset) {
        // Do nothing
    }

});

module.exports = EegeoLeafletMap;