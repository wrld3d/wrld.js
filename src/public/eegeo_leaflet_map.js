var popups = require("../public/popup.js");

var undefinedPoint = L.point(-100, -100);
var undefinedLatLng = L.latLng(0, 0);

var getCenterOfLayer = function(layer) {
    if ("getLatLng" in layer) {
        return layer.getLatLng();
    }
    if ("getBounds" in layer) {
        return layer.getBounds().getCenter();
    }
    return null;
};

var convertLatLngToVector = function(latLng) {
    var lat = latLng.lat * Math.PI / 180;
    var lng = latLng.lng * Math.PI / 180;

    var x = Math.cos(lat) * Math.cos(lng);
    var y = Math.cos(lat) * Math.sin(lng);
    var z = Math.sin(lat);
    
    return {
        x: x,
        y: y,
        z: z
    };
};


// Prevent Renderer from panning and scaling the overlay layer
L.Renderer.include({
    _updateTransform: function() { }
});


var EegeoLeafletMap = L.Map.extend({

    initialize: function(browserWindow, id, options, cameraModule, screenPointMappingModule, defaultAltitudeModule, precacheModule, themesModule, indoorsModule, polygonModule, routingModule, renderingModule) {
        this._browserWindow = browserWindow;
        this._cameraModule = cameraModule;
        this._screenPointMappingModule = screenPointMappingModule;
        this._defaultAltitudeModule = defaultAltitudeModule;
        this._precacheModule = precacheModule;
        this._polygonModule = polygonModule;
        this.themes = themesModule;
        this.indoors = indoorsModule;
        this.routes = routingModule;
        this.rendering = renderingModule;
        this._layersOnMap = {};
        this._spacesApi = null;
        this._ready = false;
        this._viewInitialized = false;

        L.Map.prototype.initialize.call(this, id, options);

        this.dragging.disable();
        this.touchZoom.disable();
        this.doubleClickZoom.disable();
        this.scrollWheelZoom.disable();
        this.boxZoom.disable();
        this.keyboard.disable();

        this.on("pan", this._updateLayerVisibility);
        this.on("zoom", this._updateLayerVisibility);
        this.on("transitionend", this._updateLayerVisibility);

        this.attributionControl.setPrefix("<a href='http://leafletjs.com' title='A JS library for interactive maps' target='_blank'>Leaflet</a>");
        this.attributionControl.addAttribution("3D Maps &copy; <a href='https://www.wrld3d.com' target='_blank'>WRLD</a> and <a href='https://www.wrld3d.com/legal/' target='_blank'>partners</a>");

        this.indoors.on("indoormapenter", this._updateIndoorLayers.bind(this));
        this.indoors.on("indoormapexit", this._updateIndoorLayers.bind(this));
        this.indoors.on("indoormapfloorchange", this._updateIndoorLayers.bind(this));
    },

    _initEvents: function (remove, surface) {
        if (!L.DomEvent || !surface) { return; }

        this._targets = {};
        this._targets[L.stamp(surface)] = this;

        var onOff = remove ? "off" : "on";

        // @event click: MouseEvent
        // Fired when the user clicks (or taps) the map.
        // @event dblclick: MouseEvent
        // Fired when the user double-clicks (or double-taps) the map.
        // @event mousedown: MouseEvent
        // Fired when the user pushes the mouse button on the map.
        // @event mouseup: MouseEvent
        // Fired when the user releases the mouse button on the map.
        // @event mouseover: MouseEvent
        // Fired when the mouse enters the map.
        // @event mouseout: MouseEvent
        // Fired when the mouse leaves the map.
        // @event mousemove: MouseEvent
        // Fired while the mouse moves over the map.
        // @event contextmenu: MouseEvent
        // Fired when the user pushes the right mouse button on the map, prevents
        // default browser context menu from showing if there are listeners on
        // this event. Also fired on mobile when the user holds a single touch
        // for a second (also called long press).
        // @event keypress: KeyboardEvent
        // Fired when the user presses a key from the keyboard while the map is focused.
        L.DomEvent[onOff](surface, "click dblclick mousedown mouseup " +
            "mouseover mouseout mousemove contextmenu keypress", this._handleDOMEvent, this);
        L.DomEvent[onOff](this._container, "click dblclick mousedown mouseup " +
            "mouseover mouseout mousemove contextmenu keypress", this._handleDOMEvent, this);

        if (this.options.trackResize) {
            L.DomEvent[onOff](this._browserWindow, "resize", this._onResize, this);
        }

        if (L.Browser.any3d && this.options.transform3DLimit) {
            this[onOff]("moveend", this._onMoveEnd);
        }
    },

    _handleDOMEvent: function (e) {
        L.Map.prototype._handleDOMEvent.call(this, e);

        if (e.type === "contextmenu") {
            L.DomEvent.preventDefault(e);
        }

		if (e.type === "mousedown") {
            var element = e.target;
            while (element && typeof element.className === "string" && element.className !== "wrld-map-container") {
                if (element.className.indexOf("leaflet-marker") !== -1) {
                    L.DomEvent.stopPropagation(e);
                    break;
                }
                element = element.parentNode;
            }
		}
	},

    addLayer: function(layer) {
        var latLng = getCenterOfLayer(layer);
        var isPositionedLayer = latLng !== null;
        if (isPositionedLayer) {
            var id = L.stamp(layer);
            if (id in this._layersOnMap) {
                return;
            }
            this._layersOnMap[id] = layer;

            if (this._isLatLngBehindEarth(latLng, convertLatLngToVector(this.getCenter()), this._getAngleFromCameraToHorizon())) {
                return;
            }

            if (!this._interiorMatchesLayer(layer)) {
              return;
            }

            if ("getElevation" in layer) {
                this._screenPointMappingModule.addLayer(layer);
            }
            else if ("getLatLng" in layer && "setLatLng" in layer) {
                this._defaultAltitudeModule.addLayer(layer);
            }
        }
        L.Map.prototype.addLayer.call(this, layer);
    },

    removeLayer: function(layer) {
        var latLng = getCenterOfLayer(layer);
        var isPositionedLayer = latLng !== null;
        if (isPositionedLayer) {
            var id = L.stamp(layer);
            if (id in this._layersOnMap) {
                if ("getElevation" in layer) {
                    this._screenPointMappingModule.removeLayer(layer);
                }
                else {
                    this._defaultAltitudeModule.removeLayer(layer);
                }
                delete this._layersOnMap[id];
            }
        }
        L.Map.prototype.removeLayer.call(this, layer);
    },

    onInitialized: function(emscriptenApi) {
        this._spacesApi = emscriptenApi.spacesApi;
        this._ready = true;
        var panes = this.getPanes();
        panes.mapPane.style["z-index"] = "10";
        panes.mapPane.style["pointer-events"] = "auto";
        panes.overlayPane.style["pointer-events"] = "none";
        this.fire("initialize");
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
        if (!this._viewInitialized) {
            L.Map.prototype.setView.call(this, center, zoom, { reset: true });
            this._viewInitialized = true;
        }
        
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
        var config = { location: this.getCenter(), zoom: this._cameraModule.getNearestZoomLevelAbove() + delta, durationSeconds: 0.33, allowInterruption: false };
        if (config.zoom <= this.getMaxZoom()) {
            this._cameraModule.setView(config);
            this._updateZoom();
        }
        return this;
    },

    zoomOut: function(delta, options) {
        var config = { location: this.getCenter(), zoom: this._cameraModule.getNearestZoomLevelBelow() - delta, durationSeconds: 0.33, allowInterruption: false };
        if (config.zoom >= this.getMinZoom()) {
            this._cameraModule.setView(config);
            this._updateZoom();
        }
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

    getCenter: function() {
        return this._cameraModule.getCenter();
    },

    getZoom: function() {
        this._zoom = this._cameraModule.getCurrentZoomLevel();
        return this._zoom;
    },
    
    getBounds: function () {
        var topLeft = this.layerPointToLatLng(new L.Point(0, 0));
        var topRight = this.layerPointToLatLng(new L.Point(this.getContainer().clientWidth, 0));
        var bottomLeft = this.layerPointToLatLng(new L.Point(0, this.getContainer().clientHeight));
        var BottomRight = this.layerPointToLatLng(new L.Point(this.getContainer().clientWidth, this.getContainer().clientHeight));
        
        return new L.LatLngBounds([topLeft, topRight, bottomLeft, BottomRight]);
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

    _onUpdate: function() {
        this.fire("update");
    },

    _onDraw: function() {
        var self = this;
        this.eachLayer(function (layer) {
            if (self._ready && layer.getLatLngs) {
                if ((!layer.options) || (layer.options.preserveAltitude !== true)) {
                    layer.getLatLngs().forEach(function (path) {
                        if (path instanceof L.LatLng) {
                            path.alt = self.getAltitudeAtLatLng(path);
                        }
                        else {
                            path.forEach(function (latLng) {
                                latLng.alt = self.getAltitudeAtLatLng(latLng);
                            });
                        }
                    });
                }
            }
            if (layer.update) {
                layer.update();
            }
            else if (layer.redraw) {
                layer.redraw();
            }
        });
        this.fire("draw");
    },

    getAltitudeAtLatLng: function(latLng) {
        return (this._ready) ? this._spacesApi.getAltitudeAtLatLng(latLng) : 0;
    },

    getMortonKeyAtLatLng: function(latLng) {
        return (this._ready) ? this._spacesApi.getMortonKeyAtLatLng(latLng) : null;
    },

    getMortonKeyCenter: function(mortonKey) {
        return (this._ready) ? this._spacesApi.getMortonKeyCenter(mortonKey) : null;
    },

    getMortonKeyCorners: function(mortonKey, insetMeters) {
        return (this._ready) ? this._spacesApi.getMortonKeyCorners(mortonKey, insetMeters) : null;
    },

    getCameraDistanceToInterest: function() {
        return this._cameraModule.getDistanceToInterest();
    },

    getCameraPitchDegrees: function() {
        return this._cameraModule.getPitchDegrees();
    },
    
    setCameraTiltDegrees: function(tilt) {
      this._cameraModule.setTiltDegrees(tilt);
      return this;
    },
    
    getCameraTiltDegrees: function() {
      return this._cameraModule.getTiltDegrees();
    },
    
    getCameraHeadingDegrees: function() {
        return this._cameraModule.getHeadingDegrees();
    },

    setCameraHeadingDegrees: function(heading) {
      this._cameraModule.setHeadingDegrees(heading);
      return this;
    },

    precache: function(centre, radius, completionCallback) {
        return this._precacheModule.precache(centre, radius, completionCallback);
    },

    _getAngleFromCameraToHorizon: function() {
        var altitude = this.getCameraDistanceToInterest();
        var earthRadius = 6378100.0;
        return Math.acos(earthRadius / (earthRadius + altitude));
    },

    _isLatLngBehindEarth: function(latlng, cameraVector, maxAngle) {
        var latlngVector = convertLatLngToVector(latlng);
        var dotProd = cameraVector.x * latlngVector.x + cameraVector.y * latlngVector.y + cameraVector.z * latlngVector.z;
        return dotProd < Math.cos(maxAngle);
    },

    _updateLayerVisibility: function() {
        var layerIds = Object.keys(this._layersOnMap);
        var cameraVector = convertLatLngToVector(this.getCenter());
        var maxAngle = this._getAngleFromCameraToHorizon();

        var _this = this;
        layerIds.forEach(function(id) {
            var layer = _this._layersOnMap[id];
            var latlng = getCenterOfLayer(layer);
            var hasElevation = "getElevation" in layer;

            var latLngBehindEarth = _this._isLatLngBehindEarth(latlng, cameraVector, maxAngle);
            var hasLayer = _this.hasLayer(layer);
            var indoorMapDisplayFilter = _this._interiorMatchesLayer(layer);
            
            if (!hasLayer && !latLngBehindEarth && indoorMapDisplayFilter) {
                L.Map.prototype.addLayer.call(_this, layer);
                if (hasElevation) {
                    _this._screenPointMappingModule.addLayer(layer);
                }                         
            }                                    
            else if (hasLayer && (latLngBehindEarth || !indoorMapDisplayFilter)) {
                if (hasElevation) {
                    _this._screenPointMappingModule.removeLayer(layer);
                }
                L.Map.prototype.removeLayer.call(_this, layer);                            
            }
            
        });
    },

    _updateIndoorLayers: function() {
      var self = this;
      var keys = Object.keys(this._layersOnMap);
      keys.forEach(function(key) {
        var layer = self._layersOnMap[key];
        if(self._interiorMatchesLayer(layer)) {
          L.Map.prototype.addLayer.call(self, layer);
        }
        else {
          L.Map.prototype.removeLayer.call(self, layer);
        }
      });
    },

    _interiorMatchesLayer: function(layer) {             
      if (layer.options.indoorMapId === undefined || layer.options.indoorFloorIndex === undefined)
      {
        return true;
      }

      if(!this.indoors.isIndoors()) {
        return false;
      }

      return this.indoors.getActiveIndoorMap().getIndoorMapId() === layer.options.indoorMapId &&
                  this.indoors.getFloor().getFloorIndex() === layer.options.indoorFloorIndex;
    },

    _rawPanBy: function(offset) {
        // Do nothing
    }

});

module.exports = EegeoLeafletMap;
