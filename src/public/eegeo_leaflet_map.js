var popups = require("../public/popup.js");
var indoorOptions = require("../private/indoor_map_layer_options.js");

var undefinedPoint = L.point(-100, -100);
var undefinedLatLng = L.latLng(0, 0);

var getCenterOfLayer = function(layer) {
    if ("getLatLng" in layer) {
        return layer.getLatLng();
    }
    if ("getBounds" in layer) {
        return layer.getBounds().isValid() ? layer.getBounds().getCenter() : null;
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

    initialize: function(
            browserWindow,
            id,
            options,
            onRemoveCallback,
            cameraModule,
            precacheModule,
            themesModule,
            indoorsModule,
            polygonModule,
            polylineModule,
            layerPointMappingModule,
            routingModule,
            renderingModule,
            buildingsModule,
            propModule,
            indoorMapEntityInformationModule,
            indoorMapFloorOutlineInformationModule,
            blueSphereModule,
            mapRuntimeModule,
            versionModule,
            heatmapModule,
            frameRateModule
            ) {
        this._browserWindow = browserWindow;
        this._onRemoveCallback = onRemoveCallback;
        this._cameraModule = cameraModule;
        this._precacheModule = precacheModule;
        this._polygonModule = polygonModule;
        this._polylineModule = polylineModule;
        this._layerPointMappingModule = layerPointMappingModule;
        this._frameRateModule = frameRateModule;
        this.themes = themesModule;
        this.indoors = indoorsModule;
        this.routes = routingModule;
        //TODO: The public methods exposed by the RenderingModule require documentation, test coverage and examples.
        //Reverting the change to private as it is being used by the Search Bar and might be used in other places
        //which we may not know about.
        this.rendering = renderingModule;
        this.buildings = buildingsModule;
        this.props = propModule;
        this.indoorMapEntities = indoorMapEntityInformationModule;
        this.indoorMapFloorOutlines = indoorMapFloorOutlineInformationModule;
        this.blueSphere = blueSphereModule;
        this.versionModule = versionModule;
        this.heatmaps = heatmapModule;
        this._mapRuntimeModule = mapRuntimeModule;
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

        this.attributionControl.setPrefix("<a href='http://leafletjs.com' title='A JS library for interactive maps' target='_blank'>Leaflet</a>");
        this.attributionControl.addAttribution("3D Maps &copy; <a href='https://www.wrld3d.com' target='_blank'>WRLD</a> and <a href='https://www.wrld3d.com/legal/' target='_blank'>partners</a>");
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
        var id = L.stamp(layer);

        if (id in this._layersOnMap) {
            return this;
        }

        this._createPointMapping(layer);

        this._layersOnMap[id] = layer;

        L.Map.prototype.addLayer.call(this, layer);
        return this;
    },

    removeLayer: function(layer) {
        var id = L.stamp(layer);

        if(!(id in this._layersOnMap)) {
            return this;
        }

        this._removePointMapping(layer);
        L.Map.prototype.removeLayer.call(this, layer);

        delete this._layersOnMap[id];
        return this;
    },

    _removeAllLayers: function() {
        var layerIds = Object.keys(this._layersOnMap);
        var _this = this;
        layerIds.forEach(function(id) {
            var layer = _this._layersOnMap[id];
            if (layer === undefined) {
                return;
            }
            _this.removeLayer(layer);
        });
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

    onInitialStreamingCompleted: function() {
        this.fire("initialstreamingcomplete");
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

    latLngsForLayer: function(layer) {
        return this._layerPointMappingModule.latLngsForLayer(layer);
    },

    _createPointMapping: function(layer) {
        this._layerPointMappingModule.createPointMapping(layer);
    },

    _removePointMapping: function(layer) {
        this._layerPointMappingModule.removePointMapping(layer);
    },

    _projectLatlngs: function(layer, latlngs, result, projectedBounds) {
        return this._layerPointMappingModule.projectLatlngs(layer, latlngs, result, projectedBounds);
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

        if (!("allowInterruption" in options)) {
            if (options.pan && "allowInterruption" in options.pan) {
                options["allowInterruption"] = options.pan.allowInterruption;
            }
            else if (options.zoom && "allowInterruption" in options.zoom) {
                options["allowInterruption"] = options.zoom.allowInterruption;
            }
        }

        options.location = center;
        options.zoom = zoom;
        this._cameraModule.setView(options);
        return this;
    },

    zoomIn: function(delta, options) {
        delta = delta || 1;
        var config = { location: this.getCenter(), zoom: this._cameraModule.getCurrentZoomLevel() + delta, durationSeconds: 0.33, allowInterruption: false };
        if (config.zoom <= this.getMaxZoom()) {
            this.fire("zoomstart");
            this.once("transitionend", function() { this.fire("zoomend"); });
            this._cameraModule.setView(config);
            this._updateZoom();
        }
        return this;
    },

    zoomOut: function(delta, options) {
        delta = delta || 1;
        var config = { location: this.getCenter(), zoom: this._cameraModule.getCurrentZoomLevel() - delta, durationSeconds: 0.33, allowInterruption: false };
        if (config.zoom >= this.getMinZoom()) {
            this.fire("zoomstart");
            this.once("transitionend", function() { this.fire("zoomend"); });
            this._cameraModule.setView(config);
            this._updateZoom();
        }
        return this;
    },

    setZoomAround: function() {
        return this;
    },

    setViewVerticallyLocked: function(isVerticallyLocked) {
        this._cameraModule.setVerticallyLocked(isVerticallyLocked);
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

    pause: function(){
        return this._mapRuntimeModule.Pause();
    },

    resume: function(){
        return this._mapRuntimeModule.Resume();
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
        this._removeAllLayers();
        this._mapRuntimeModule.Remove();
        this._onRemoveCallback();
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
        this._updateLayerVisibility();

        this.eachLayer(function (layer) {
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

    getMaximumPrecacheRadius: function() {
        return this._precacheModule.getMaximumPrecacheRadius();
    },

    precache: function(center, radius, completionCallback) {
        return this.precacheWithDetailedResult(center, radius, function(precacheResult) { completionCallback(precacheResult.succeeded); });
    },

    precacheWithDetailedResult: function(center, radius, completionCallback) {
        return this._precacheModule.precache(center, radius, completionCallback);
    },

    setMapCollapsed: function(isMapCollapsed) {
        this.rendering.setMapCollapsed(isMapCollapsed);
        return this;
    },

    isMapCollapsed: function() {
        return this.rendering.isMapCollapsed();
    },

    setDrawClearColor: function(clearColor) {
        this.rendering.setClearColor(clearColor);
        return this;
    },

    setTargetVSyncInterval: function(targetVSyncInterval) {
        this._frameRateModule.setTargetVSyncInterval(targetVSyncInterval);
        return this;
    },

    setThrottledTargetFrameInterval: function(throttledTargetFrameIntervalMilliseconds) {
        this._frameRateModule.setThrottledTargetFrameInterval(throttledTargetFrameIntervalMilliseconds);
        return this;
    },

    setIdleSecondsBeforeThrottle: function(idleSecondsBeforeThrottle) {
        this._frameRateModule.setIdleSecondsBeforeThrottle(idleSecondsBeforeThrottle);
        return this;
    },

    setThrottleWhenIdleEnabled: function(throttleWhenIdleEnabled) {
        this._frameRateModule.setThrottleWhenIdleEnabled(throttleWhenIdleEnabled);
        return this;
    },

    cancelFrameRateThrottle: function() {
        this._frameRateModule.cancelThrottle();
        return this;
    },

    isHardwareAccelerationAvailable: function() {
        var canvas = document.createElement("canvas");
        var hardwareAccelerationEnforcer = { failIfMajorPerformanceCaveat: true };
        var webglContext = canvas.getContext("webgl", hardwareAccelerationEnforcer) || canvas.getContext("experimental-webgl", hardwareAccelerationEnforcer);
        return !!(webglContext && webglContext instanceof WebGLRenderingContext);
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

            // we're checking for null, as there's a few potentially confusing interactions that can happen.
            // e.g. if we have a marker with an associated popup (say markerId = 23 and popupId = 75), then on starting this loop, we'll
            // have layerIds = [ 23, 75 ] and both of these ids exist in the _layersOnMap dictionary. However, a side-effect of removing
            // a marker is that any associated popup will be removed. We're spinning over the layerIds that we copied _before_
            // removing anything, so we now have a stale id (75) that no longer exists in _layersOnMap, and we can skip it.
            if(layer === undefined) {
                return;
            }

            var latlng = getCenterOfLayer(layer);

            // certain layers (such as L.layerGroup) don't have positions and are purely organisational tools, so we can ignore them
            // Additionally check if it's FeatureGroup, which is explicitly used by Leaflet.Draw.
            if (latlng === null || layer instanceof L.FeatureGroup) {
                return;
            }

            var latLngBehindEarth = _this._isLatLngBehindEarth(latlng, cameraVector, maxAngle);
            var hasLayer = _this.hasLayer(layer);
            var indoorMapDisplayFilter = _this._isVisibleForCurrentMapState(layer);

            if (!hasLayer && !latLngBehindEarth && indoorMapDisplayFilter) {
                L.Map.prototype.addLayer.call(_this, layer);
            }
            else if (hasLayer && (latLngBehindEarth || !indoorMapDisplayFilter)) {
                L.Map.prototype.removeLayer.call(_this, layer);
            }

        });
    },

    _isVisibleForCurrentMapState: function(layer) {
        var currentMapStateIsOutdoors = !this.indoors.isIndoors();
        var layerIsOutdoors = !indoorOptions.hasIndoorMap(layer);

		if (layer.options.displayOption === "currentMap")
			return true;

        if (currentMapStateIsOutdoors)
        {
            return layerIsOutdoors;
        }

        // from here on in, we know our map state is indoors
        if (layerIsOutdoors) {
            return false;
        }

        return indoorOptions.matchesIndoorMap(
            this.indoors.getActiveIndoorMap().getIndoorMapId(),
            this.indoors.getFloor()._getFloorId(),
            this.indoors.getFloor().getFloorIndex(),
            layer);
    },

    _rawPanBy: function(offset) {
        // Do nothing
    }

});

module.exports = EegeoLeafletMap;
