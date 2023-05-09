import type L from "leaflet";

import type { Color } from "../types/color";
import type { Vector3 } from "./space";
import type DisplayOption from "../types/displayOption";

import type SpaceApi from "../private/emscripten_api/emscripten_spaces_api";

// Type definitions for public modules
import type { HeatmapsModule } from "../types/modules/heatmap";
import type { PropsModule } from "../types/modules/props";
import type { RoutesModule } from "../types/modules/routes";
import type { ThemesModule } from "../private/modules/themes_module";
import type { BuildingsModule } from "../types/modules/buildings";
import type { IndoorMapEntitiesModule } from "../types/modules/indoorMapEntities";
import type {IndoorMapFloorOutlinesModule} from "../types/modules/indoorMapFloorOutlines";
import type { IndoorsModule } from "../types/modules/indoors";
import type { LabelModule } from "../private/modules/label_module";
import type { StreamingModule } from "../types/modules/streaming";
// Private modules
import type RenderingModule from "../private/modules/rendering_module";
import type BlueSphereModule from "../private/modules/blue_sphere_module";
import type VersionModule from "../private/modules/version_module";
import type PolylineModule from "../private/modules/polyline_module";
import type LayerPointMappingModule from "../private/modules/layer_point_mapping_module";
import type FrameRateModule from "../private/modules/frame_rate_module";
import type MapRuntimeModule from "../private/modules/map_runtime_module";
import type PrecacheModule from "../private/modules/precache_module";
import type CameraModule from "../private/modules/camera_module";
import type PolygonModule from "../private/modules/polygon_module";

export type MapId = string;
export type MapFloorId = number;
export type MapFloorIndex = number;

export type MapOptions = L.MapOptions & {
  canvasId?: string;
  width?: number;
  height?: number;
  indoorsEnabled?: boolean;
  displayEntranceMarkers?: boolean;
  coverageTreeManifest?: string;
  environmentThemesManifest?: string;
  headingDegrees?: number;
  trafficEnabled?: boolean;
  trafficDisabledWhenEnteringIndoorMaps?: boolean;
  indoorLabelsAlwaysHidden?: boolean;
  drawClearColor?: Color;
  indoorMapBackgroundColor?: Color;
  viewVerticallyLocked?: boolean;
  targetVSyncInterval?: number;
  frameRateThrottleWhenIdleEnabled?: boolean;
  idleSecondsBeforeFrameRateThrottle?: number;
  throttledTargetFrameIntervalMilliseconds?: number;
  /** If provided, the map will attempt to enter this indoor map */
  indoorId?: string;
  /** If provided, the map will open on this floor if `indoorId` is also provided */
  floorIndex?: number;
  qualitySetting?:QualitySettings
};

export type ZoomPanOptions = L.ZoomPanOptions & {
  headingDegrees?: number;
  tiltDegrees?: number;
  animate?: boolean;
  durationSeconds?: number;
  allowInterruption?: boolean;
  pan?: number | ZoomPanOptions;
  zoom?: number | ZoomPanOptions;
}

export enum QualitySettings {
  VeryLow = 0,
  Low = 1,
  MediumLow = 2,
  Standard = 3,
  High = 4,
}

export type PrecacheResponse = {
  cancel: () => void;
};

export type PrecacheHandler = (result: {
  succeeded: boolean;
}) => void;

export type Layer = L.Layer & {
  getLatLng?: () => L.LatLng;
  getBounds?: () => L.LatLngBounds;
  options?: { displayOption?: DisplayOption };
  update?: () => void;
  redraw?: () => void;
};

export declare class Map extends L.Map {
  protected constructor();
  protected _container: HTMLElement;
  protected _browserWindow: typeof window;
  protected _layersOnMap: Record<string, Layer>;
  protected _spacesApi: null | SpaceApi;
  protected _ready: boolean;
  protected _viewInitialized: boolean;
  protected _targets: Record<number, unknown>;
  protected _zoom: number;
  // public modules
  indoors: IndoorsModule;
  props: PropsModule;
  buildings: BuildingsModule;
  indoorMapEntities: IndoorMapEntitiesModule;
  indoorMapFloorOutlines: IndoorMapFloorOutlinesModule;
  themes: ThemesModule;
  routes: RoutesModule;
  heatmaps: HeatmapsModule;
  rendering: RenderingModule;
  blueSphere: BlueSphereModule;
  versionModule: VersionModule;
  labels: LabelModule;
  streaming: StreamingModule;
  // internal modules
  /** @internal */ _polylineModule: PolylineModule;
  /** @internal */ _polygonModule: PolygonModule;
  // private modules
  protected _layerPointMappingModule: LayerPointMappingModule;
  protected _frameRateModule: FrameRateModule;
  protected _mapRuntimeModule: MapRuntimeModule;
  protected _precacheModule: PrecacheModule;
  protected _cameraModule: CameraModule;
  // callbacks
  protected _onRemoveCallback: () => void;
  // options
  public options: MapOptions;

  getAltitudeAtLatLng(latLng: L.LatLngExpression): number;
  getMortonKeyAtLatLng(latLng: L.LatLngExpression): string | null;
  getMortonKeyCenter(mortonKey: string): L.LatLng | null;
  getMortonKeyCorners(mortonKey: string, insetMeters: number): L.LatLng[] | null;
  getCameraDistanceToInterest(): number;
  getCameraPitchDegrees(): number;
  getCameraTiltDegrees(): number;
  setCameraTiltDegrees(tilt: number): this;
  getCameraHeadingDegrees(): number;
  setCameraHeadingDegrees(heading: number): this;
  getMaximumPrecacheRadius(): number;
  precache(center: L.LatLngExpression, radius: number, callback: (success: boolean) => void): PrecacheResponse;
  precacheWithDetailedResult(center: L.LatLngExpression, radius: number, callback: PrecacheHandler): PrecacheResponse;
  setView(center: L.LatLngExpression, zoom: number, options?: ZoomPanOptions): this;
  setViewVerticallyLocked(isVerticallyLocked: boolean): this;
  latLngsForLayer(layer: Layer): L.LatLng[];
  setMapCollapsed(isMapCollapsed: boolean): this;
  isMapCollapsed(): void;
  setDrawClearColor(clearColor: string): this;
  setTargetVSyncInterval(targetVSyncInterval: number): this;
  setFrameRateThrottleWhenIdleEnabled(frameRateThrottleWhenIdleEnabled: boolean): this;
  setIdleSecondsBeforeFrameRateThrottle(idleSecondsBeforeFrameRateThrottle: number): this;
  setThrottledTargetFrameInterval(throttledTargetFrameIntervalMilliseconds: number): this;
  setIdleSecondsBeforeThrottle(idleSecondsBeforeThrottle: number): this;
  setThrottleWhenIdleEnabled(throttleWhenIdleEnabled: true): this;
  cancelFrameRateThrottle(): this;
  isHardwareAccelerationAvailable(): boolean;
  // internal methods
  /** @internal **/ _createPointMapping: (layer: Layer) => void;
  /** @internal **/ _projectLatlngs: (layer: Layer, latlngs: L.LatLng[], result: unknown, projectedBounds: L.LatLngBounds[]) => boolean;
  // private methods
  protected _handleDOMEvent: L.DomEvent.EventHandlerFn;
  protected _handleTouchStartEvent: L.DomEvent.EventHandlerFn;
  protected _onResize: L.DomEvent.EventHandlerFn;
  protected _onMoveEnd: L.LeafletEventHandlerFn;
  protected _getAngleFromCameraToHorizon: () => number;
  protected _isLatLngBehindEarth: (latLng: L.LatLng, cameraVector: Vector3, maxAngle: number) => boolean;
  protected _removeAllLayers: () => void;
  protected _updateLayerVisibility: () => void;
  protected _isVisibleForCurrentMapState: (layer: Layer) => boolean;
  protected _removePointMapping(layer: Layer): void;
  protected _limitZoom(zoom: number): number;
  protected _limitCenter(center: L.LatLng, zoom: number, maxBounds?: L.LatLngBoundsExpression): L.LatLng;
  protected _updateZoom(): void;
}

export default Map;
