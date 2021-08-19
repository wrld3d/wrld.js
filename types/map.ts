import type L from "leaflet";

import type indoors from "./indoors";
import type props from "./props";
import type buildings from "./buildings";
import type indoorMapEntities from "./indoorMapEntities";
import type indoorMapFloorOutlines from "./indoorMapFloorOutlines";
import type { Color } from "./color";
import type themes from "./themes";
import type routes from "./routes";
import type Heatmap from "./heatmap";

declare namespace Map {
  type MapId = string;
  type MapFloorId = number;
  type MapFloorIndex = number;

  type Options = L.MapOptions & {
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
  };

  type SetViewOptions = Partial<{
      headingDegrees: number;
      tiltDegrees: number;
      animate: boolean;
      durationSeconds: number;
      allowInterruption: boolean;
  }>;
}

interface Map extends L.Map {
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
  precache(center: L.LatLngExpression, radius: number, callback: (success: boolean) => void): {
      cancel: () => void;
  };
  precacheWithDetailedResult(center: L.LatLngExpression, radius: number, callback: (success: boolean) => void): {
      cancel: () => void;
  };
  setView(center: L.LatLngExpression, zoom: number, options?: Map.SetViewOptions): this;
  setViewVerticallyLocked(isVerticallyLocked: boolean): this;
  latLngsForLayer(layer: L.Layer): L.LatLng[];
  setMapCollapsed(isMapCollapsed: boolean): this;
  isMapCollapsed(): void;
  setDrawClearColor(clearColor: string): this;
  setTargetVSyncInterval(targetVSyncInterval: number): this;
  setFrameRateThrottleWhenIdleEnabled(frameRateThrottleWhenIdleEnabled: boolean): this;
  setIdleSecondsBeforeFrameRateThrottle(idleSecondsBeforeFrameRateThrottle: number): this;
  setThrottledTargetFrameIntervalMilliseconds(throttledTargetFrameIntervalMilliseconds: number): this;
  cancelFrameRateThrottle(): this;
  isHardwareAccelerationAvailable(): boolean;
  indoors: indoors.Indoors;
  props: props.Props;
  buildings: buildings.Buildings;
  indoorMapEntities: indoorMapEntities.IndoorMapEntities;
  indoorMapFloorOutlines: indoorMapFloorOutlines.IndoorMapFloorOutlines;
  themes: themes.Themes;
  routes: routes.Routes;
  heatmaps: Heatmap.Heatmaps;
}

export default Map;
