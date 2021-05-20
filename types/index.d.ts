
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

declare namespace Map {

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

    // TODO
    indoors: any;
    themes: any;
    routes: any;
    buildings: BuildingsModule;
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

declare class Marker extends L.Marker {
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

declare class Popup extends L.Popup {
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

declare class Polygon {
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

declare class Polyline extends L.Polyline {
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

declare class Prop {
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

declare namespace Heatmap {

    // eslint-disable-next-line no-unused-vars
    type PointData = [number, number] | [number, number, number] | {
        latLng?: L.LatLngExpression;
        weight?: number;
    } | {
        [property: string]: L.LatLngExpression | number;
    };

    // eslint-disable-next-line no-unused-vars
    type DensityStop = {
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
    densityStops?: Heatmap.DensityStop[];
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
declare class Heatmap extends L.Layer {
    constructor(pointData: Heatmap.PointData[], options?: HeatmapOptions);

    getDensityStops(): Heatmap.DensityStop[];
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

declare namespace indoors {
    
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

declare namespace themes {

    /* eslint-disable no-unused-vars */
    enum season {
        Spring = "Spring",
        Summer = "Summer",
        Autumn = "Autumn",
        Winter = "Winter"
    }

    enum time {
        Dawn = "Dawn",
        Day = "Day",
        Dusk = "Dusk",
        Night = "Night"
    }

    enum weather {
        Clear = "Default",
        Overcast = "Overcast",
        Foggy = "Foggy",
        Rainy = "Rainy",
        Snowy = "Snowy"
    }
    /* eslint-enable no-unused-vars */

}

/* Wrld.buildings */

declare namespace buildings {
    
    /* eslint-disable no-unused-vars */
    class BuildingHighlight {
        getId(): number;
        getOptions(): BuildingHighlightOptions;
        getColor(): { x: number; y: number; z: number; w: number; };
        getBuildingInformation(): null | BuildingInformation;
        addTo(map: Map): this;
        remove(): this;
        setColor(color: Color): this;
    }
    
    class BuildingHighlightOptions {
        highlightBuildingAtLocation(latLng: L.LatLng): this;
        highlightBuildingAtScreenPoint(screenPoint: L.Point): this;
        color(color: Color): this
        informationOnly(): this;
    }
    
    function buildingHighlight(options: BuildingHighlightOptions): BuildingHighlight;
    
    function buildingHighlightOptions(): BuildingHighlightOptions;
    
    class BuildingInformation {
        getBuildingId(): string;
        getBuildingDimensions(): BuildingDimensions;
        getBuildingContours(): BuildingContour[];
    }
    
    class BuildingDimensions {
        getBaseAltitude(): number;
        getTopAltitude(): number;
        getCentroid(): L.LatLng;
    }
    
    class BuildingContour {
        getBottomAltitude(): number;
        getTopAltitude(): number;
        getPoints(): L.LatLng[];
    }
    /* eslint-enable no-unused-vars */
}

type FindBuildingResult = {
    found: boolean;
    point: L.LatLng;
};

type BuildingInformationReceivedEventHandler = (buildingHighlight: buildings.BuildingHighlight) => void;

class BuildingsModule {
    findBuildingAtScreenPoint(screenPoint: L.LatLng): FindBuildingResult;
    findBuildingAtLatLng(latLng: L.LatLng): FindBuildingResult;

    on(type: "buildinginformationreceived", fn: BuildingInformationReceivedEventHandler): void;
    once(type: "buildinginformationreceived", fn: BuildingInformationReceivedEventHandler): void;
    off(type: "buildinginformationreceived", fn: BuildingInformationReceivedEventHandler): void;
}

/* Wrld.indoorMapEntities - TODO */

//declare namespace indoorMapEntities {}
const indoorMapEntities: any;

/* Wrld.spaindoorMapFloorOutlinesce - TODO */

//declare namespace indoorMapFloorOutlines {}
const indoorMapFloorOutlines: any;

/* Wrld */

declare function map(element: HTMLElement | string, apiKey: string, options?: MapOptions): Map;
declare function marker(latLng: L.LatLngExpression, options?: MarkerOptions): Marker;
declare function popup(options?: PopupOptions, source?: L.Layer): Popup;
declare function polygon(latlngs: L.LatLngTuple[] | L.LatLngTuple[][], options?: PolygonOptions): Polygon;
declare function polyline(latlngs: L.LatLngExpression[], options?: PolylineOptions): Polyline;
declare function prop(name: string, geometryId: string, location: L.LatLngExpression, options?: PropOptions): Prop;
declare function heatmap(pointData: Heatmap.PointData[], options?: HeatmapOptions): Heatmap;

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
