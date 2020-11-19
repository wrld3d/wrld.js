
import L from "leaflet";

type IndoorMapId = string;
type IndoorMapFloorId = number;
type IndoorMapFloorIndex = number;

type ElevationMode = "heightAboveGround" | "heightAboveSeaLevel";

type Vector3 = [number, number, number] | {
    x: number;
    y: number;
    z: number;
};

type Vector4 = [number, number, number, number] | {
    x: number;
    y: number;
    z: number;
    w: number;
};

type Color = string | Vector3 | Vector4 | {
    r: number;
    g: number;
    b: number;
    a?: number;
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
    drawClearColor?: Color;
    indoorMapBackgroundColor?: Color;
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

    // TODO
    indoors: any;
    themes: any;
    routes: any;
    buildings: any;
    props: any;
    indoorMapEntities: any;
    indoorMapFloorOutlines: any;
    heatmaps: any;
}

/* L.Marker */

type MarkerOptions = L.MarkerOptions & {
    elevation: number;
    elevationMode: ElevationMode;
    indoorMapId: IndoorMapId;
    indoorMapFloorId: IndoorMapFloorId;
};

class Marker extends L.Marker {
    constructor(latlng: L.LatLngExpression, options?: MarkerOptions);
    getElevation(): number;
    setElevation(elevation : number): this;
    getElevationMode(): ElevationMode;
    setElevationMode(elevationMode: ElevationMode): this;
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
    color?: Color;
    elevation?: number;
    elevationMode?: ElevationMode;
    indoorMapId?: IndoorMapId;
    indoorMapFloorId?: IndoorMapFloorId;
};

class Polygon {
    constructor(latlngs: L.LatLngTuple[] | L.LatLngTuple[][], options?: PolygonOptions);
    addTo(map: Map): this;
    remove(): this;
    getColor(): Color;
    setColor(color: Color): this;
    getPoints(): L.LatLngLiteral[];
    addHole(points: L.LatLngTuple[]): this;
    getHoles(): L.LatLngLiteral[][];
}

/* Wrld.Polyline */

type PolylineOptions = {
    color?: Color;
    elevation?: number;
    elevationMode?: ElevationMode;
    indoorMapId?: IndoorMapId;
    indoorMapFloorId?: IndoorMapFloorId;
    weight?: number;
    miterLimit?: number;
};

class Polyline extends L.Polyline {
    constructor(latlngs: L.LatLngExpression[], options?: PolylineOptions);
    getPoints(): L.LatLng[];
    getIndoorMapId(): IndoorMapId;
    getIndoorMapFloorId(): IndoorMapFloorId;
    setIndoorMapWithFloorId(indoorMapId: IndoorMapId, indoorMapFloorId: IndoorMapFloorId): this;
    getElevation(): number;
    setElevation(elevation : number): this;
    getElevationMode(): ElevationMode;
    setElevationMode(elevationMode: ElevationMode): this;
    getWidth(): number;
    getColor(): Color;
    getMiterLimit(): number;
    setOptions(options: PolylineOptions): this;
    setStyle(options: PolylineOptions): this;
}

/* Wrld.Prop */

type PropOptions = {
    elevation?: number;
    elevationMode?: ElevationMode;
    indoorMapId?: IndoorMapId;
    indoorMapFloorId?: IndoorMapFloorId;
    headingDegrees?: number;
};

class Prop {
    constructor(name: string, geometryId: string, location: L.LatLngExpression, options?: PropOptions);
    addTo(map: Map): this;
    remove(): this;
    getLocation(): L.LatLng;
    setLocation(latLng: L.LatLngExpression): this;
    getIndoorMapId(): IndoorMapId;
    getIndoorMapFloorId(): IndoorMapFloorId;
    getHeadingDegrees(): number;
    setHeadingDegrees(heading: number): this;
    getElevation(): number;
    setElevation(elevation : number): this;
    getElevationMode(): ElevationMode;
    setElevationMode(elevationMode: ElevationMode): this;
    getGeometryId(): string;
    setGeometryId(geometryId: string): this;
    getName(): string;
}

/* Wrld.Heatmap */

namespace Heatmap {

    // eslint-disable-next-line no-unused-vars
    type PointData = [number, number] | [number, number, number] | {
        latLng?: L.LatLngExpression;
        weight?: number;
    } | {
        [dataCoordProperty: string]: L.LatLngExpression;
        [dataWeightProperty: string]: number;
    };

    // eslint-disable-next-line no-unused-vars
    type DesnsityStop = {
        stop: number;
        radius: number;
        gain: number;
    };

    // eslint-disable-next-line no-unused-vars
    type ColorStop = {
        stop: number;
        color: Color;
    };

    // eslint-disable-next-line no-unused-vars
    type OcclusionMapFeature = "ground" | "buildings" | "trees" | "transport";
}

type HeatmapOptions = {
    densityStops?: Heatmap.DesnsityStop[];
    densityBlend?: number;
    interpolateDensityByZoom?: boolean;
    zoomMin?: number;
    zoomMax?: number;
    weightMin?: number;
    weightMax?: number;
    colorGradient?: Heatmap.ColorStop[];
    opacity?: number;
    resolutionPixels?: number;
    intensityBias?: number;
    intensityScale?: number;
    indoorMapId?: IndoorMapId;
    indoorMapFloorId?: IndoorMapFloorId;
    elevation?: number;
    elevationMode?: ElevationMode;
    occludedMapFeatures?: Heatmap.OcclusionMapFeature[],
    occludedAlpha?: number;
    occludedSaturation?: number;
    occludedBrightness?: number;
    polygonPoints?: L.LatLngTuple[];
    dataCoordProperty?: string;
    dataWeightProperty?: string;
    textureBorderPercent?: number;
    useApproximation?: boolean;
};

// eslint-disable-next-line no-redeclare
class Heatmap extends L.Layer {
    constructor(pointData: Heatmap.PointData[], options?: HeatmapOptions);

    getDensityStops(): Heatmap.DesnsityStop[];
    getDensityBlend(): number;
    getInterpolateDensityByZoom(): boolean;
    getZoomMin(): number;
    getZoomMax(): number;
    getWeightMin(): number;
    getWeightMax(): number;
    getColorGradient(): Heatmap.ColorStop[];
    getOpacity(): number;
    getResolutionPixels(): number;
    getIntensityBias(): number;
    getIntensityScale(): number;
    getIndoorMapId(): IndoorMapId;
    getIndoorMapFloorId(): IndoorMapFloorId;
    getElevation(): number;
    getElevationMode(): ElevationMode;
    getOccludedMapFeatures(): Heatmap.OcclusionMapFeature[];
    getOccludedAlpha(): number;
    getOccludedSaturation(): number;
    getOccludedBrightness(): number;
    getPolygonPoints(): L.LatLngTuple;
    getTextureBorderPercent(): number;
    getUseApproximation(): boolean;

    setOptions(options: HeatmapOptions): this;
    setDensityStops(densityStops: Heatmap.DensityStop[]): this;
    setDensityBlend(densityBlend: number): this;
    setInterpolateDensityByZoom(interpolateDensityByZoom: boolean): this;
    setZoomMin(zoomMin: number): this;
    setZoomMax(zoomMax: number): this;
    setWeightMin(weightMin: number): this;
    setWeightMax(weightMax: number): this;
    setColorGradient(colorGradient: Heatmap.ColorStop[]): this;
    setOpacity(opacity: number): this;
    setResolution(resolutionPixels: number): this;
    setIntensityBias(intensityBias: number): this;
    setIntensityScale(intensityScale: number): this;
    setIndoorMapWithFloorId(indoorMapId: IndoorMapId, indoorMapFloorId: IndoorMapFloorId): this;
    setElevation(elevation: number): this;
    setElevationMode(mode: ElevationMode): this;
    setPolygonPoints(polygonPoints: L.LatLngTuple): this;
    setUseApproximation(useApproximation: boolean): this;
}

/* Wrld.indoors */

namespace indoors {
    
    // eslint-disable-next-line no-unused-vars
    class IndoorMap {
        exit(): void;
        getIndoorMapId(): IndoorMapId;
        getIndoorMapName(): string;
        getFloorCount(): number;
        getFloors(): IndoorMapFloor;
        getSearchTags(): { name: string; search_tag: string; icon_key: string}[];
    }

    class IndoorMapFloor {
        // retain compat with existing API -- id was exposed as short name
        // whereas it should really be the floorId (a.k.a. z_order)
        getFloorId(): string;
        getFloorIndex(): number;
        getFloorName(): string;
        getFloorShortName(): string;
    }
    
    // eslint-disable-next-line no-unused-vars
    class IndoorMapEntrance {
        getIndoorMapId(): IndoorMapId;
        getIndoorMapName(): string;
        getLatLng(): L.LatLng;
    }
}

/* Wrld.themes */

namespace themes {

    // eslint-disable-next-line no-unused-vars
    const season = {
        Spring: "Spring",
        Summer: "Summer",
        Autumn: "Autumn",
        Winter: "Winter"
    };

    // eslint-disable-next-line no-unused-vars
    const time = {
        Dawn: "Dawn",
        Day: "Day",
        Dusk: "Dusk",
        Night: "Night"
    };

    // eslint-disable-next-line no-unused-vars
    const weather = {
        Clear: "Default",
        Overcast: "Overcast",
        Foggy: "Foggy",
        Rainy: "Rainy",
        Snowy: "Snowy"
    };

}

/* Wrld.buildings - TODO */

namespace buildings {}

/* Wrld.indoorMapEntities - TODO */

namespace indoorMapEntities {}

/* Wrld.spaindoorMapFloorOutlinesce - TODO */

namespace indoorMapFloorOutlines {}

/* Wrld */

function map(element: HTMLElement | string, apiKey: string, options?: MapOptions): Map;
function marker(latLng: L.LatLngExpression, options?: MarkerOptions): Marker;
function popup(options?: PopupOptions, source?: L.Layer): Popup;
function polygon(latlngs: L.LatLngTuple[] | L.LatLngTuple[][], options?: PolygonOptions): Polygon;
function polyline(latlngs: L.LatLngExpression[], options?: PolylineOptions): Polyline;
function prop(name: string, geometryId: string, location: L.LatLngExpression, options?: PropOptions): Prop;
function heatmap(pointData: Heatmap.PointData[], options?: HeatmapOptions): Heatmap;

declare module "wrld.js" {
    map;
    Marker;
    marker;
    Popup;
    popup;
    Polygon;
    polygon;
    Polyline;
    polyline;
    Prop;
    prop;
    Heatmap;
    heatmap;

    indoors;
    themes;
    buildings;
    indoorMapEntities;
    indoorMapFloorOutlines;
}

// TODO: L.popup
// TODO: L.circle
// TODO: L.marker
// TODO: L.polygon
// TODO: L.polyline
// TODO: L.rectangle
