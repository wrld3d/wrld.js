var popups = require("../public/popup.js");

var undefinedPoint = L.point(-100, -100);
var undefinedLatLng = L.latLng(0, 0);

var EegeoLeafletMap = L.Map.extend({

    _spacesApi: null,
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
        this._polygonModule = polygonModule;
        this.themes = themesModule;
        this.indoors = indoorsModule;

        L.Map.prototype.initialize.call(this, id, options);

        this.dragging.disable();
        this.touchZoom.disable();
        this.doubleClickZoom.disable();
        this.scrollWheelZoom.disable();
        this.boxZoom.disable();
        this.keyboard.disable();

        this.attributionControl.addAttribution("3D Maps &copy; <a href='https://www.eegeo.com'>eeGeo</a> and <a href='https://www.eegeo.com/legal/'>partners</a>");
    },

    _initEvents: function(onOff, surface) {
        if (!L.DomEvent || !surface) { return; }

        L.DomEvent[onOff](surface, 'click', this._onMouseClick, this);

        var events = ['dblclick', 'mousedown', 'mouseup', 'mouseenter',
                      'mouseleave', 'mousemove', 'contextmenu'],
            i, len;

        for (i = 0, len = events.length; i < len; i++) {
            L.DomEvent[onOff](surface, events[i], this._fireMouseEvent, this);
        }

        if (this.options.trackResize) {
            L.DomEvent[onOff](window, 'resize', this._onResize, this);
        }
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
        this._spacesApi = emscriptenApi.spacesApi;
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

    latLngToLayerPoint: function(latLng) {
        return (this._ready) ? this._spacesApi.worldToScreen(latLng).toPoint() : undefinedPoint;
    },

    layerPointToLatLng: function(point) {
        var latLng = (this._ready) ? this._spacesApi.screenToWorldPoint(point) : null;
        return latLng || undefinedLatLng;
    },

    latLngToContainerPoint: function(latLng) {
        return this.latLngToLayerPoint(latLng);
    },

    containerPointToLatLng: function(point) {
        return this.layerPointToLatLng(point);
    },

    containerPointToLayerPoint: function(point) {
        return point;
    },

    layerPointToContainerPoint: function(point) {
        return point;
    },

    _updateZoom: function() {
        this._zoom = this.getZoom();
    },

    setView: function(center, zoom, options) {
        // Superclass' implementation of setView does some initialization so we have to call it
        L.Map.prototype.setView.call(this, center, zoom, options);
        
        zoom = (typeof zoom === "undefined") ? this._zoom : this._limitZoom(zoom);
        center = this._limitCenter(L.latLng(center), zoom, this.options.maxBounds);
        options = options || {};

        if (!("animate" in options)) {
            if (options.pan && "animate" in options.pan) {
                options["animate"] = options.pan.animate;
            }
            else if (options.zoom && "animate" in options.zoom) {
                options["animate"] = options.zoom.animate;
            }
        }

        options.location = center;
        options.zoom = zoom;
        this._cameraModule.setView(options);
        return this;
    },

    zoomIn: function(delta, options) {
        this._updateZoom();
        return L.Map.prototype.zoomIn.call(this, delta, options);
    },

    zoomOut: function(delta, options) {
        this._updateZoom();
        return L.Map.prototype.zoomOut.call(this, delta, options);
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
        return this.setZoom(0);
    },

    panTo: function(center, options) {
        this._updateZoom();
        return L.Map.prototype.panTo.call(this, center, options);
    },

    panInsideBounds: function(bounds, options) {
        this._updateZoom();
        return L.Map.prototype.panInsideBounds.call(this, bounds, options);
    },

    panBy: function() {
        return this;
    },

    getCenter: function () {
        return this._cameraModule.getCenter();
    },

    getZoom: function () {
        this._zoom = this._cameraModule.getCurrentZoomLevel();
        return this._zoom;
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