
import L from "leaflet";

/* Wrld.Map */

type MapOptions = L.MapOptions & {
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
    drawClearColor?: string;
    indoorMapBackgroundColor?: string;
    viewVerticallyLocked?: boolean;
    targetVSyncInterval?: number;
    frameRateThrottleWhenIdleEnabled?: boolean;
    idleSecondsBeforeFrameRateThrottle?: number;
    throttledTargetFrameIntervalMilliseconds?: number;
};

declare namespace Map {

    type SetViewOptions = {
        headingDegrees: number;
        tiltDegrees: number;
        animate: boolean;
        durationSeconds: number;
        allowInterruption: boolean;
    };
}

interface Map extends L.Map {
    getAltitudeAtLatLng(latLng: L.LatLngExpression): number;
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
    setView(center: L.LatLngExpression, zoom: number, options?: SetViewOptions): this;
    setViewVerticallyLocked(isVerticallyLocked: boolean): this;
    layerPointToLatLng(point: L.PointExpression): L.LatLng;
    latLngToLayerPoint(latLng: L.LatLngExpression): L.Point;
    setMapCollapsed(isMapCollapsed: boolean): this;
    isMapCollapsed(): void;
    setDrawClearColor(clearColor: string): this;
    setTargetVSyncInterval(targetVSyncInterval: number): this;
    setFrameRateThrottleWhenIdleEnabled(frameRateThrottleWhenIdleEnabled: boolean): this;
    setIdleSecondsBeforeFrameRateThrottle(idleSecondsBeforeFrameRateThrottle: number): this;
    setThrottledTargetFrameIntervalMilliseconds(throttledTargetFrameIntervalMilliseconds: number): this;
    cancelFrameRateThrottle(): this;
    isHardwareAccelerationAvailable(): boolean;

    indoors: any;
    themes: any;
    buildings: any;
    indoorMapEntities: any;
    indoorMapFloorOutlines: any;
}

/* Wrld.Marker */

type MarkerOptions = L.MarkerOptions & {
    elevation: number;
    elevationMode: "heightAboveGround" | "heightAboveSeaLevel";
    indoorMapId: string;
    indoorMapFloorId: number;
};

declare class Marker extends L.Marker {
    constructor(latlng: L.LatLngExpression, options?: MarkerOptions);
    getElevation(): number;
    setElevation(elevation : number): this;
    getElevationMode(): this;
    setElevationMode(elevationMode: "heightAboveGround" | "heightAboveSeaLevel"): this;
}

/* Wrld */

function map(element: HTMLElement | string, apiKey: string, options?: Wrld.MapOptions): Wrld.Map;
function marker(latLng: L.LatLngExpression, options?: Wrld.MarkerOptions): Wrld.Marker;

declare module "wrld.js" {
    map;
    Marker;
    marker;
}
