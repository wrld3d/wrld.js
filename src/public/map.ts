import L from "leaflet";
import type EmscriptenApi from "../private/emscripten_api/emscripten_api";
import { hasIndoorMap, matchesIndoorMap } from "../private/indoor_map_layer_options";
import Color from "../types/color";
import type { Layer, Map as MapType, MapOptions, PrecacheHandler, PrecacheResponse, ZoomPanOptions } from "./map_type";
import { Popup, PopupOptions } from "./popup";
import { Vector3 } from "./space";

const undefinedPoint = L.point(-100, -100);
const undefinedLatLng = L.latLng(0, 0);

const getCenterOfLayer = (layer: Layer) => {
  if (layer.getLatLng) {
    return layer.getLatLng();
  }
  if (layer.getBounds) {
    return layer.getBounds().isValid() ? layer.getBounds().getCenter() : null;
  }
  return null;
};

const convertLatLngToVector = (latLng: L.LatLng): Vector3 => {
  const lat = (latLng.lat * Math.PI) / 180;
  const lng = (latLng.lng * Math.PI) / 180;

  const x = Math.cos(lat) * Math.cos(lng);
  const y = Math.cos(lat) * Math.sin(lng);
  const z = Math.sin(lat);

  return new Vector3(x, y, z);
};

// Prevent Renderer from panning and scaling the overlay layer
L.Renderer.include({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _updateTransform: () => {},
});

export const Map: typeof MapType = L.Map.extend({
  initialize: function (
    this: MapType,
    browserWindow: typeof MapType.prototype._browserWindow,
    id: number,
    options: MapOptions,
    onRemoveCallback: typeof MapType.prototype._onRemoveCallback,
    cameraModule: typeof MapType.prototype._cameraModule,
    precacheModule: typeof MapType.prototype._precacheModule,
    themesModule: typeof MapType.prototype.themes,
    indoorsModule: typeof MapType.prototype.indoors,
    polygonModule: typeof MapType.prototype._polygonModule,
    polylineModule: typeof MapType.prototype._polylineModule,
    layerPointMappingModule: typeof MapType.prototype._layerPointMappingModule,
    routingModule: typeof MapType.prototype.routes,
    renderingModule: typeof MapType.prototype.rendering,
    buildingsModule: typeof MapType.prototype.buildings,
    propModule: typeof MapType.prototype.props,
    indoorMapEntityInformationModule: typeof MapType.prototype.indoorMapEntities,
    indoorMapFloorOutlineInformationModule: typeof MapType.prototype.indoorMapFloorOutlines,
    blueSphereModule: typeof MapType.prototype.blueSphere,
    mapRuntimeModule: typeof MapType.prototype._mapRuntimeModule,
    versionModule: typeof MapType.prototype.versionModule,
    heatmapModule: typeof MapType.prototype.heatmaps,
    frameRateModule: typeof MapType.prototype._frameRateModule,
    labelModule: typeof MapType.prototype.labels,
    streamingModule: typeof MapType.prototype.streaming
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
    this.labels = labelModule;
    this.streaming = streamingModule;
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
    this.tap?.disable();

    this.attributionControl.setPrefix(
      "<a href='http://leafletjs.com' title='A JS library for interactive maps' target='_blank'>Leaflet</a>"
    );
    this.attributionControl.addAttribution(
      "3D Maps &copy; <a href='https://www.wrld3d.com' target='_blank'>WRLD</a> and <a href='https://www.wrld3d.com/legal/' target='_blank'>partners</a>"
    );
  },

  _initEvents: function (this: MapType, remove: boolean, surface: HTMLElement) {
    if (!L.DomEvent || !surface) {
      return;
    }

    this._targets = {};
    this._targets[L.stamp(surface)] = this;

    const onOff = remove ? "off" : "on";

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
    L.DomEvent[onOff](
      surface,
      "click dblclick mousedown mouseup " + "mouseover mouseout mousemove contextmenu keypress",
      this._handleDOMEvent,
      this
    );
    L.DomEvent[onOff](
      this._container,
      "click dblclick mousedown mouseup " + "mouseover mouseout mousemove contextmenu keypress",
      this._handleDOMEvent,
      this
    );

    // use HTML event API as Leaflet translates touch events to pointer events, which aren't what eegeo-mobile is listening for
    if (remove) {
      surface.removeEventListener("touchstart", this._handleTouchStartEvent);
      this._container.removeEventListener("touchstart", this._handleTouchStartEvent);
    } else {
      surface.addEventListener("touchstart", this._handleTouchStartEvent);
      this._container.addEventListener("touchstart", this._handleTouchStartEvent);
    }

    if (this.options.trackResize) {
      L.DomEvent[onOff](this._browserWindow as unknown as HTMLElement, "resize", this._onResize, this);
    }

    if (L.Browser.any3d && this.options.transform3DLimit) {
      this[onOff]("moveend", this._onMoveEnd);
    }
  },

  _handleDOMEvent: function (this: MapType, e: Event) {
    // @ts-ignore we don't have a type definition for this
    L.Map.prototype["_handleDOMEvent"].call(this, e);

    if (e.type === "contextmenu") {
      L.DomEvent.preventDefault(e);
    }

    if (e.type === "mousedown") {
      let element = e.target as HTMLElement;
      while (element && typeof element.className === "string" && element.className !== "wrld-map-container") {
        if (element.className.indexOf("leaflet-marker") !== -1) {
          L.DomEvent.stopPropagation(e);
          break;
        }
        element = element.parentNode as HTMLElement;
      }
    }
  },

  _handleTouchStartEvent: function (this: MapType, e: Event) {
    let element = e.target as HTMLElement;
      while (element && typeof element.className === "string" && element.className !== "wrld-map-container") {
        if (element.className.indexOf("leaflet-marker") !== -1) {
          L.DomEvent.stopPropagation(e);
          break;
        }
        element = element.parentNode as HTMLElement;
      }
  },

  addLayer: function (this: MapType, layer: Layer) {
    const id = L.stamp(layer);

    if (id in this._layersOnMap) {
      return this;
    }

    this._createPointMapping(layer);

    this._layersOnMap[id] = layer;

    L.Map.prototype.addLayer.call(this, layer);
    return this;
  },

  removeLayer: function (this: MapType, layer: Layer) {
    const id = L.stamp(layer);

    if (!(id in this._layersOnMap)) {
      return this;
    }

    this._removePointMapping(layer);
    L.Map.prototype.removeLayer.call(this, layer);

    delete this._layersOnMap[id];
    return this;
  },

  _removeAllLayers: function (this: MapType) {
    const layerIds = Object.keys(this._layersOnMap);

    layerIds.forEach((id) => {
      const layer = this._layersOnMap[id];
      if (layer === undefined) {
        return;
      }
      this.removeLayer(layer);
    });
  },

  onInitialized: function (this: MapType, emscriptenApi: EmscriptenApi) {
    this._spacesApi = emscriptenApi.spacesApi;
    this._ready = true;
    const panes = this.getPanes();
    panes.mapPane.style.zIndex = "10";
    panes.mapPane.style.pointerEvents = "auto";
    panes.overlayPane.style.pointerEvents = "none";
    this.fire("initialize");
  },

  onInitialStreamingCompleted: function (this: MapType) {
    this.fire("initialstreamingcomplete");
  },

  latLngToLayerPoint: function (this: MapType, latLng: L.LatLng) {
    return this._ready ? this._spacesApi?.worldToScreen(latLng).toPoint() : undefinedPoint;
  },

  layerPointToLatLng: function (this: MapType, point: L.PointExpression) {
    const latLng = this._ready ? this._spacesApi?.screenToWorldPoint(point) : null;
    return latLng || undefinedLatLng;
  },

  latLngToContainerPoint: function (this: MapType, latLng: L.LatLng) {
    return this.latLngToLayerPoint(latLng);
  },

  containerPointToLatLng: function (this: MapType, point: L.PointExpression) {
    return this.layerPointToLatLng(point);
  },

  containerPointToLayerPoint: function (this: MapType, point: L.PointExpression) {
    return point;
  },

  layerPointToContainerPoint: function (this: MapType, point: L.PointExpression) {
    return point;
  },

  latLngsForLayer: function (this: MapType, layer: Layer) {
    return this._layerPointMappingModule.latLngsForLayer(layer);
  },

  _createPointMapping: function (this: MapType, layer: Layer) {
    this._layerPointMappingModule.createPointMapping(layer);
  },

  _removePointMapping: function (this: MapType, layer: Layer) {
    this._layerPointMappingModule.removePointMapping(layer);
  },

  _projectLatlngs: function (
    this: MapType,
    layer: Layer,
    latlngs: L.LatLng[],
    result: unknown,
    projectedBounds: L.Bounds
  ) {
    return this._layerPointMappingModule.projectLatlngs(layer, latlngs, result, projectedBounds);
  },

  _updateZoom: function (this: MapType) {
    this._zoom = this.getZoom();
  },

  setView: function (this: MapType, center: L.LatLngExpression, zoom?: number, options?: ZoomPanOptions) {
    // Superclass' implementation of setView does some initialization so we have to call it
    if (!this._viewInitialized) {
      L.Map.prototype.setView.call(this, center, zoom, { reset: true } as L.ZoomPanOptions);
      this._viewInitialized = true;
    }

    zoom = typeof zoom === "undefined" ? this._zoom : this._limitZoom(zoom);
    center = this._limitCenter(L.latLng(center), zoom, this.options.maxBounds);
    options = options || {};

    if (!("animate" in options)) {
      if (typeof options.pan === "object" && "animate" in options.pan) {
        options["animate"] = options.pan.animate;
      } else if (typeof options.zoom === "object" && "animate" in options.zoom) {
        options["animate"] = options.zoom.animate;
      }
    }

    if (!("allowInterruption" in options)) {
      if (typeof options.pan === "object" && "allowInterruption" in options.pan) {
        options["allowInterruption"] = options.pan.allowInterruption;
      } else if (typeof options.zoom === "object" && "allowInterruption" in options.zoom) {
        options["allowInterruption"] = options.zoom.allowInterruption;
      }
    }

    const _options = { ...options, zoom, location: center };
    this._cameraModule.setView(_options);
    return this;
  },

  zoomIn: function (this: MapType, delta: number) {
    delta = delta || 1;
    const config = {
      location: this.getCenter(),
      zoom: this._cameraModule.getCurrentZoomLevel() + delta,
      durationSeconds: 0.33,
      allowInterruption: false,
    };
    if (config.zoom <= this.getMaxZoom()) {
      this.fire("zoomstart");
      this.once("transitionend", () => {
        this.fire("zoomend");
      });
      this._cameraModule.setView(config);
      this._updateZoom();
    }
    return this;
  },

  zoomOut: function (this: MapType, delta: number) {
    delta = delta || 1;
    const config = {
      location: this.getCenter(),
      zoom: this._cameraModule.getCurrentZoomLevel() - delta,
      durationSeconds: 0.33,
      allowInterruption: false,
    };
    if (config.zoom >= this.getMinZoom()) {
      this.fire("zoomstart");
      this.once("transitionend", () => {
        this.fire("zoomend");
      });
      this._cameraModule.setView(config);
      this._updateZoom();
    }
    return this;
  },

  setZoomAround: function (this: MapType) {
    return this;
  },

  setViewVerticallyLocked: function (this: MapType, isVerticallyLocked: boolean) {
    this._cameraModule.setVerticallyLocked(isVerticallyLocked);
    return this;
  },

  fitBounds: function (this: MapType, bounds: L.LatLngBoundsExpression) {
    const config = { bounds: bounds };
    this._cameraModule.setViewToBounds(config);
    return this;
  },

  fitWorld: function (this: MapType) {
    return this.setZoom(0);
  },

  panTo: function (this: MapType, center: L.LatLng, options?: ZoomPanOptions) {
    this._updateZoom();
    return L.Map.prototype.panTo.call(this, center, options);
  },

  panInsideBounds: function (this: MapType, bounds: L.LatLngBoundsExpression, options?: ZoomPanOptions) {
    this._updateZoom();
    return L.Map.prototype.panInsideBounds.call(this, bounds, options);
  },

  panBy: function (this: MapType) {
    return this;
  },

  getCenter: function (this: MapType) {
    return this._cameraModule.getCenter();
  },

  pause: function (this: MapType) {
    return this._mapRuntimeModule.Pause();
  },

  resume: function (this: MapType) {
    return this._mapRuntimeModule.Resume();
  },

  getZoom: function (this: MapType) {
    this._zoom = this._cameraModule.getCurrentZoomLevel();
    return this._zoom;
  },

  getBounds: function (this: MapType) {
    const topLeft = this.layerPointToLatLng(new L.Point(0, 0));
    const topRight = this.layerPointToLatLng(new L.Point(this.getContainer().clientWidth, 0));
    const bottomLeft = this.layerPointToLatLng(new L.Point(0, this.getContainer().clientHeight));
    const BottomRight = this.layerPointToLatLng(
      new L.Point(this.getContainer().clientWidth, this.getContainer().clientHeight)
    );

    return L.latLngBounds([topLeft, topRight, bottomLeft, BottomRight]);
  },

  locate: function (this: MapType) {
    return this;
  },

  stopLocate: function (this: MapType) {
    return this;
  },

  remove: function (this: MapType) {
    this._removeAllLayers();
    this._mapRuntimeModule.Remove();
    this._onRemoveCallback();
    return this;
  },

  openPopup: function (this: MapType, popup: Popup | L.Content, latLng: L.LatLngExpression, options?: PopupOptions) {
    let _popup: Popup;

    if (!(popup instanceof L.Popup)) {
      // aka if L.Content
      const content = popup;
      _popup = new Popup(options).setLatLng(latLng).setContent(content);
    } else {
      _popup = popup;
    }

    // troubles with the parent's method overrides – manually specifying the signature to allow current behaviour
    const _super = L.Map.prototype.openPopup as unknown as (
      content: L.Popup,
      latlng: L.LatLngExpression,
      options?: PopupOptions
    ) => MapType;

    return _super.call(this, _popup, latLng, options);
  },

  _onUpdate: function (this: MapType) {
    this.fire("update");
  },

  _onDraw: function (this: MapType) {
    this._updateLayerVisibility();

    this.eachLayer((layer: Layer) => {
      if (layer.update) {
        layer.update();
      } else if (layer.redraw) {
        layer.redraw();
      }
    });
    this.fire("draw");
  },

  getAltitudeAtLatLng: function (this: MapType, latLng: L.LatLngExpression) {
    return this._ready ? this._spacesApi?.getAltitudeAtLatLng(latLng) : 0;
  },

  getMortonKeyAtLatLng: function (this: MapType, latLng: L.LatLngExpression) {
    return this._ready ? this._spacesApi?.getMortonKeyAtLatLng(latLng) : null;
  },

  getMortonKeyCenter: function (this: MapType, mortonKey: string) {
    return this._ready ? this._spacesApi?.getMortonKeyCenter(mortonKey) : null;
  },

  getMortonKeyCorners: function (this: MapType, mortonKey: string, insetMeters: number) {
    return this._ready ? this._spacesApi?.getMortonKeyCorners(mortonKey, insetMeters) : null;
  },

  getCameraDistanceToInterest: function (this: MapType) {
    return this._cameraModule.getDistanceToInterest();
  },

  getCameraPitchDegrees: function (this: MapType) {
    return this._cameraModule.getPitchDegrees();
  },

  setCameraTiltDegrees: function (this: MapType, tilt: number) {
    this._cameraModule.setTiltDegrees(tilt);
    return this;
  },

  getCameraTiltDegrees: function (this: MapType) {
    return this._cameraModule.getTiltDegrees();
  },

  getCameraHeadingDegrees: function (this: MapType) {
    return this._cameraModule.getHeadingDegrees();
  },

  setCameraHeadingDegrees: function (this: MapType, heading: number) {
    this._cameraModule.setHeadingDegrees(heading);
    return this;
  },

  getMaximumPrecacheRadius: function (this: MapType): number {
    return this._precacheModule.getMaximumPrecacheRadius();
  },

  precache: function (
    this: MapType,
    center: L.LatLngExpression,
    radius: number,
    completionCallback: (success: boolean) => void
  ): PrecacheResponse {
    return this.precacheWithDetailedResult(center, radius, (precacheResult) => {
      completionCallback(precacheResult.succeeded);
    });
  },

  precacheWithDetailedResult: function (
    this: MapType,
    center: L.LatLngExpression,
    radius: number,
    completionCallback: PrecacheHandler
  ) {
    return this._precacheModule.precache(center, radius, completionCallback);
  },

  setMapCollapsed: function (this: MapType, isMapCollapsed: boolean) {
    this.rendering.setMapCollapsed(isMapCollapsed);
    return this;
  },

  isMapCollapsed: function () {
    return this.rendering.isMapCollapsed();
  },

  setDrawClearColor: function (this: MapType, clearColor: Color) {
    this.rendering.setClearColor(clearColor);
    return this;
  },

  setTargetVSyncInterval: function (this: MapType, targetVSyncInterval: number) {
    this._frameRateModule.setTargetVSyncInterval(targetVSyncInterval);
    return this;
  },

  setThrottledTargetFrameInterval: function (this: MapType, throttledTargetFrameIntervalMilliseconds: number) {
    this._frameRateModule.setThrottledTargetFrameInterval(throttledTargetFrameIntervalMilliseconds);
    return this;
  },

  setIdleSecondsBeforeThrottle: function (this: MapType, idleSecondsBeforeThrottle: number) {
    this._frameRateModule.setIdleSecondsBeforeThrottle(idleSecondsBeforeThrottle);
    return this;
  },

  setThrottleWhenIdleEnabled: function (this: MapType, throttleWhenIdleEnabled: boolean) {
    this._frameRateModule.setThrottleWhenIdleEnabled(throttleWhenIdleEnabled);
    return this;
  },

  cancelFrameRateThrottle: function (this: MapType) {
    this._frameRateModule.cancelThrottle();
    return this;
  },

  isHardwareAccelerationAvailable: function (this: MapType) {
    const canvas = document.createElement("canvas");
    const hardwareAccelerationEnforcer = { failIfMajorPerformanceCaveat: true };
    const webglContext =
      canvas.getContext("webgl", hardwareAccelerationEnforcer) ||
      canvas.getContext("experimental-webgl", hardwareAccelerationEnforcer);
    return !!(webglContext && webglContext instanceof WebGLRenderingContext);
  },

  _getAngleFromCameraToHorizon: function (this: MapType) {
    const altitude = this.getCameraDistanceToInterest();
    const earthRadius = 6378100.0;
    return Math.acos(earthRadius / (earthRadius + altitude));
  },

  _isLatLngBehindEarth: function (this: MapType, latlng: L.LatLng, cameraVector: Vector3, maxAngle: number) {
    const latlngVector = convertLatLngToVector(latlng);
    const dotProd = cameraVector.x * latlngVector.x + cameraVector.y * latlngVector.y + cameraVector.z * latlngVector.z;
    return dotProd < Math.cos(maxAngle);
  },

  _updateLayerVisibility: function (this: MapType) {
    const layerIds = Object.keys(this._layersOnMap);
    const cameraVector = convertLatLngToVector(this.getCenter());
    const maxAngle = this._getAngleFromCameraToHorizon();

    layerIds.forEach((id) => {
      const layer = this._layersOnMap[id];

      // we're checking for null, as there's a few potentially confusing interactions that can happen.
      // e.g. if we have a marker with an associated popup (say markerId = 23 and popupId = 75), then on starting this loop, we'll
      // have layerIds = [ 23, 75 ] and both of these ids exist in the _layersOnMap dictionary. However, a side-effect of removing
      // a marker is that any associated popup will be removed. We're spinning over the layerIds that we copied _before_
      // removing anything, so we now have a stale id (75) that no longer exists in _layersOnMap, and we can skip it.
      if (layer === undefined) {
        return;
      }

      const latlng = getCenterOfLayer(layer);

      // certain layers (such as L.layerGroup) don't have positions and are purely organisational tools, so we can ignore them
      // Additionally check if it's FeatureGroup, which is explicitly used by Leaflet.Draw.
      if (latlng === null || layer instanceof L.FeatureGroup) {
        return;
      }

      const latLngBehindEarth = this._isLatLngBehindEarth(latlng, cameraVector, maxAngle);
      const hasLayer = this.hasLayer(layer);
      const indoorMapDisplayFilter = this._isVisibleForCurrentMapState(layer);

      if (!hasLayer && !latLngBehindEarth && indoorMapDisplayFilter) {
        L.Map.prototype.addLayer.call(this, layer);
      } else if (hasLayer && (latLngBehindEarth || !indoorMapDisplayFilter)) {
        L.Map.prototype.removeLayer.call(this, layer);
      }
    });
  },

  _isVisibleForCurrentMapState: function (this: MapType, layer: Layer): boolean {
    const currentMapStateIsOutdoors = !this.indoors.isIndoors();
    const layerIsOutdoors = !hasIndoorMap(layer);

    if (layer.options?.displayOption === "currentMap") return true;

    if (currentMapStateIsOutdoors) {
      return layerIsOutdoors;
    }

    // from here on in, we know our map state is indoors
    if (layerIsOutdoors) {
      return false;
    }

    return matchesIndoorMap(
      this.indoors.getActiveIndoorMap()?.getIndoorMapId(),
      this.indoors.getFloor()?.getFloorZOrder(),
      this.indoors.getFloor()?.getFloorIndex(),
      layer
    );
  },

  _rawPanBy: function (this: MapType) {
    // Do nothing
  },
});

export type {
    MapFloorId,
    MapFloorIndex,
    MapId,
    MapOptions,
    PrecacheHandler,
    PrecacheResponse,
    ZoomPanOptions
} from "./map_type";

export type Map = MapType;

export default Map;
