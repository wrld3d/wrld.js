
import L from "leaflet";

type IndoorMapId = string;
type IndoorMapFloorId = number;
type IndoorMapFloorIndex = number;

type Vector3 = [number, number, number] | {
    x: number,
    y: number,
    z: number
};

type Vector4 = [number, number, number, number] | {
    x: number,
    y: number,
    z: number,
    w: number,
};

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

namespace Map {

    // eslint-disable-next-line no-unused-vars
    type SetViewOptions = {
        headingDegrees: number;
        tiltDegrees: number;
        animate: boolean;
        durationSeconds: number;
        allowInterruption: boolean;
    };
}

// eslint-disable-next-line no-redeclare
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
    setView(center: L.LatLngExpression, zoom: number, options?: Map.SetViewOptions): this;
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

/* L.Marker */

type MarkerOptions = L.MarkerOptions & {
    elevation: number;
    elevationMode: "heightAboveGround" | "heightAboveSeaLevel";
    indoorMapId: IndoorMapId;
    indoorMapFloorId: IndoorMapFloorId;
};

class Marker extends L.Marker {
    constructor(latlng: L.LatLngExpression, options?: MarkerOptions);
    getElevation(): number;
    setElevation(elevation : number): this;
    getElevationMode(): this;
    setElevationMode(elevationMode: "heightAboveGround" | "heightAboveSeaLevel"): this;
    setIndoorMapWithFloorId(indoorMapId: IndoorMapId, indoorMapFloorId: IndoorMapFloorId): this;
    setIndoorMapWithFloorIndex(indoorMapId: IndoorMapId, indoorMapFloorIndex: IndoorMapFloorIndex): this;
    setOutdoor(): this;
}

/* L.Popup */

type PopupOptions = L.PopupOptions & {
    elevation: number;
};

class Popup extends L.Popup {
    constructor(options?: PopupOptions, source?: L.Layer);
    getElevation(): number;
    setElevation(elevation : number): this;
}

/* Wrld.Polygon */

type PolygonOptions = {
    color?: Vector3 | Vector4;
    elevation?: number;
    elevationMode?: "heightAboveGround" | "heightAboveSeaLevel";
    indoorMapId?: IndoorMapId;
    indoorMapFloorId?: IndoorMapFloorId;
};

class Polygon {
    constructor(latlngs: L.LatLngTuple[] | L.LatLngTuple[][], options?: PolygonOptions);
    addTo(map: Map): this;
    remove(): this;
    getColor(): Vector4;
    setColor(color: Vector3 | Vector4): this;
    getPoints(): L.LatLngLiteral[];
    addHole(points: L.LatLngTuple[]): this;
    getHoles(): L.LatLngLiteral[][];
}

/* Wrld */

function map(element: HTMLElement | string, apiKey: string, options?: MapOptions): Map;
function marker(latLng: L.LatLngExpression, options?: MarkerOptions): Marker;
function popup(options?: PopupOptions, source?: L.Layer): Popup;
function polygon(latlngs: L.LatLngTuple[] | L.LatLngTuple[][], options?: PolygonOptions): Polygon;

declare module "wrld.js" {
    map;
    Marker;
    marker;
    Popup;
    popup;
    Polygon;
    polygon;
}
