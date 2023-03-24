import L from "leaflet";
import { ElevationModeType, isValidElevationMode } from "../private/elevation_mode";
import { factoryFor } from "../private/factoryFor";
import type Color from "../types/color";
import type ElevationMode from "../types/elevationMode";
import type { Map, MapFloorId, MapId } from "./map";
import type { LayerOptions } from "leaflet";

const RESOLUTION_PIXELS_MIN = 64.0;
const RESOLUTION_PIXELS_MAX = 2048;

export enum HeatmapOcclusionMapFeature {
  GROUND = "ground",
  BUILDINGS = "buildings",
  TREES = "trees",
  TRANSPORT = "transport",
}

export type OcclusionMapFeature = "ground" | "buildings" | "trees" | "transport";

export type WeightedPoint = {
  latLng?: L.LatLngExpression;
  weight?: number;
};

export type CustomPoint = {
  [property: string]: L.LatLngExpression | number;
};

export type PointData = [number, number] | [number, number, number] | WeightedPoint | CustomPoint;

export type DensityStop = {
  stop: number;
  radius: number;
  gain: number;
};

export type DensityStopArray = [number, number, number];

export type ColorStop = {
  stop: number;
  color: Color;
};

export type ColorStopArray = [number, Color];

export interface HeatmapOptions extends LayerOptions {
  densityStops?: DensityStop[];
  densityBlend?: number;
  interpolateDensityByZoom?: boolean;
  zoomMin?: number;
  zoomMax?: number;
  weightMin?: number;
  weightMax?: number;
  colorGradient?: ColorStopArray | ColorStop[] | ColorStopArray[];
  opacity?: number;
  resolutionPixels?: number;
  intensityBias?: number;
  intensityScale?: number;
  indoorMapId?: MapId;
  indoorMapFloorId?: MapFloorId;
  elevation?: number;
  elevationMode?: ElevationMode;
  occludedMapFeatures?: OcclusionMapFeature[];
  occludedAlpha?: number;
  occludedSaturation?: number;
  occludedBrightness?: number;
  polygonPoints?: L.LatLngTuple[];
  dataCoordProperty?: string;
  dataWeightProperty?: string;
  textureBorderPercent?: number;
  useApproximation?: boolean;
}

declare class HeatmapType extends L.Layer {
  options: Required<HeatmapOptions>;
  protected _map: Map;
  protected _pointData: WeightedPoint[];
  protected _changedFlags: {
    data: boolean;
    indoorMap: boolean;
    elevation: boolean;
    densityBlend: boolean;
    interpolateDensityByZoom: boolean;
    intensityBias: boolean;
    intensityScale: boolean;
    opacity: boolean;
    colorGradient: boolean;
    resolution: boolean;
    densityStops: boolean;
    useApproximation: boolean;
    polygon: boolean;
  };
  constructor(pointData: PointData[], options?: HeatmapOptions);
  getData(): WeightedPoint[];
  getDensityStops(): DensityStop[];
  getDensityBlend(): number;
  getInterpolateDensityByZoom(): boolean;
  getZoomMin(): number;
  getZoomMax(): number;
  getWeightMin(): number;
  getWeightMax(): number;
  getColorGradient(): ColorStop[];
  getOpacity(): number;
  getResolutionPixels(): number;
  getIntensityBias(): number;
  getIntensityScale(): number;
  getIndoorMapId(): MapId;
  getIndoorMapFloorId(): MapFloorId;
  getElevation(): number;
  getElevationMode(): ElevationMode;
  getOccludedMapFeatures(): OcclusionMapFeature[];
  getOccludedAlpha(): number;
  getOccludedSaturation(): number;
  getOccludedBrightness(): number;
  getPolygonPoints(): L.LatLngTuple;
  getTextureBorderPercent(): number;
  getUseApproximation(): boolean;

  setData(pointData: PointData[]): this;
  setOptions(options: HeatmapOptions): this;
  setDensityStops(densityStops: DensityStop[]): this;
  setDensityBlend(densityBlend: number): this;
  setInterpolateDensityByZoom(interpolateDensityByZoom: boolean): this;
  setZoomMin(zoomMin: number): this;
  setZoomMax(zoomMax: number): this;
  setWeightMin(weightMin: number): this;
  setWeightMax(weightMax: number): this;
  setColorGradient(colorGradient: ColorStopArray | ColorStop[] | ColorStopArray[]): this;
  setOpacity(opacity: number): this;
  setResolution(resolutionPixels: number): this;
  setIntensityBias(intensityBias: number): this;
  setIntensityScale(intensityScale: number): this;
  setIndoorMapWithFloorId(indoorMapId: MapId, indoorMapFloorId: MapFloorId): this;
  setElevation(elevation: number): this;
  setElevationMode(mode: ElevationMode): this;
  setPolygonPoints(polygonPoints: L.LatLngTuple[] | L.LatLngTuple[][]): this;
  setUseApproximation(useApproximation: boolean): this;

  protected _getArrayDepth(array: unknown[] | unknown): number;
  protected _loadLatLngAlts(coords: L.LatLngExpression[]): L.LatLngTuple[];
  protected _loadPolygonRings(coordsArray: L.LatLngTuple[] | L.LatLngTuple[][]): L.LatLngTuple[];
  protected _loadDensityParams(densityParams: DensityStop | DensityStopArray): DensityStop;
  protected _loadDensityStops(
    densityStopsArray: (DensityStop | DensityStopArray) | (DensityStop | DensityStopArray)[]
  ): DensityStop[];
  protected _loadPointData(pointData: PointData[]): WeightedPoint[];
  protected _loadColorGradient(colorGradient: ColorStopArray | ColorStop[] | ColorStopArray[]): ColorStop[];
  protected _loadColorStop(colorStop: ColorStop | ColorStopArray): ColorStop;
}

export type Heatmap = HeatmapType;

export const Heatmap: typeof HeatmapType = (L.Layer ? L.Layer : L.Class).extend({
  options: {
    dataCoordProperty: "latLng",
    dataWeightProperty: "weight",
    elevation: 0.0,
    elevationMode: ElevationModeType.HEIGHT_ABOVE_GROUND,
    indoorMapId: "",
    indoorMapFloorId: 0,
    polygonPoints: [],

    weightMin: 0.0,
    weightMax: 1.0,
    resolutionPixels: 512.0,
    textureBorderPercent: 0.05,
    useApproximation: true,

    densityStops: [
      { stop: 0.0, radius: 5.0, gain: 1.0 },
      { stop: 1.0, radius: 15.0, gain: 1.0 },
    ],
    densityBlend: 0.0,
    interpolateDensityByZoom: false,
    zoomMin: 15.0,
    zoomMax: 18.0,

    // Default gradient suitable for sequential data, with transparency near zero, similar to
    // http://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=5
    colorGradient: [
      { stop: 0.0, color: "#ffffff00" },
      { stop: 0.2, color: "#ffffb2ff" },
      { stop: 0.4, color: "#fecc5cff" },
      { stop: 0.6, color: "#fd8d3cff" },
      { stop: 0.8, color: "#f03b20ff" },
      { stop: 1.0, color: "#bd0026ff" },
    ],
    opacity: 1.0,
    intensityBias: 0.0,
    intensityScale: 1.0,
    occludedMapFeatures: [HeatmapOcclusionMapFeature.BUILDINGS, HeatmapOcclusionMapFeature.TREES],
    occludedAlpha: 0.85,
    occludedSaturation: 0.7,
    occludedBrightness: 0.7,
  } as HeatmapOptions,

  _loadPointData: function (this: Heatmap, pointData: PointData[]) {
    const weightedCoords: WeightedPoint[] = [];
    const dataCoordProperty = this.options.dataCoordProperty;
    const dataWeightProperty = this.options.dataWeightProperty;
    pointData.forEach((pointDatum) => {
      let weight = 1.0;
      let latLng: L.LatLng;
      if (dataCoordProperty in pointDatum) {
        const _pointDatum = pointDatum as CustomPoint;
        latLng = L.latLng(_pointDatum[dataCoordProperty] as L.LatLngExpression);

        if (dataWeightProperty in pointDatum) {
          weight = _pointDatum[dataWeightProperty] as number;
        }
      } else if (Array.isArray(pointDatum)) {
        latLng = L.latLng(pointDatum[0], pointDatum[1]);
        if (pointDatum.length > 2) {
          weight = pointDatum[2] as number;
        }
      } else {
        throw new Error("Expected {latLng, weight} or [<lat>, lng, weight] when parsing pointData.");
      }

      weightedCoords.push({
        latLng: latLng,
        weight: weight,
      });
    });
    return weightedCoords;
  },

  _getArrayDepth: function (this: Heatmap, array: unknown[]) {
    let arrayDepth = 0;
    let testElement: unknown[] | unknown = array;
    do {
      testElement = (testElement as unknown[])[0];
      arrayDepth++;
    } while (Array.isArray(testElement));
    return arrayDepth;
  },

  _loadLatLngAlts: function (this: Heatmap, coords: L.LatLngExpression[]) {
    return coords.map(L.latLng);
  },

  _loadPolygonRings: function (this: Heatmap, coordsArray: L.LatLngTuple[] | L.LatLngTuple[][]) {
    let polygonRings: L.LatLngTuple[][] = [];
    const arrayDepth = this._getArrayDepth(coordsArray);

    if (arrayDepth === 2) {
      coordsArray = coordsArray as L.LatLngTuple[];
      polygonRings.push(this._loadLatLngAlts(coordsArray));
    } else if (arrayDepth === 3) {
      coordsArray = coordsArray as L.LatLngTuple[][];
      coordsArray.forEach((holeCoords) => {
        polygonRings.push(this._loadLatLngAlts(holeCoords));
      }, this);
    } else if (coordsArray.length === 0) {
      polygonRings = [];
    } else {
      throw new Error("Incorrect array depth for heatmap options.polygonPoints.");
    }
    return polygonRings;
  },

  _loadDensityParams: function (this: Heatmap, densityParams: DensityStop | DensityStopArray) {
    let stop = 0.0;
    let radius = 0.0;
    let gain = 0.0;

    if (Array.isArray(densityParams)) {
      if (densityParams.length < 2) {
        throw new Error("Expected array [<stop>, <radius>, <(optional) gain>] when parsing options.densityStops");
      }
      stop = densityParams[0];
      radius = densityParams[1];
      gain = densityParams.length > 2 ? densityParams[2] : 1.0;
    } else {
      if (densityParams.stop === undefined || densityParams.radius === undefined) {
        throw new Error(
          "Expected object {stop:<stop>, radius:<radius>, (optional) gain:<gain>} when parsing options.densityStops"
        );
      }

      stop = densityParams.stop;
      radius = densityParams.radius;
      gain = densityParams.gain || 1.0;
    }

    if (isNaN(stop)) {
      throw new Error("Expected Number for heatmap density stop parameter: " + String(stop));
    }
    if (isNaN(radius)) {
      throw new Error("Expected Number for heatmap radius parameter: " + String(radius));
    }
    if (isNaN(gain)) {
      throw new Error("Expected Number for heatmap gain parameter: " + String(gain));
    }

    return {
      stop: stop,
      radius: radius,
      gain: gain,
    };
  },

  _loadDensityStops: function (
    this: Heatmap,
    densityStopsArray: DensityStop | DensityStopArray | DensityStop[] | DensityStopArray[]
  ): DensityStop[] {
    const densityStops: DensityStop[] = [];
    const arrayDepth = this._getArrayDepth(densityStopsArray);

    if (arrayDepth === 1 && Array.isArray(densityStopsArray) && typeof densityStopsArray[0] === "number") {
      densityStops.push(this._loadDensityParams(densityStopsArray as DensityStopArray));
    } else if (arrayDepth <= 2) {
      (densityStopsArray as DensityStop[]).forEach((densityStopsSet) => {
        densityStops.push(this._loadDensityParams(densityStopsSet));
      }, this);
    } else {
      throw new Error("Incorrect array depth for heatmap options.densityStops.");
    }
    return densityStops;
  },

  _loadColorStop: function (this: Heatmap, colorStopParams: ColorStop | ColorStopArray): ColorStop {
    let stop = 0.0;
    let color: Color = "#ffffffff";

    if (Array.isArray(colorStopParams)) {
      if (colorStopParams.length < 2) {
        throw new Error("Expected array [<stop>, <color>] when parsing options.colorGradient");
      }
      stop = colorStopParams[0];
      color = colorStopParams[1];
    } else {
      if (colorStopParams.stop === undefined || colorStopParams.color === undefined) {
        throw new Error("Expected object {stop:<stop>, color:<color>} when parsing options.colorGradient");
      }

      stop = colorStopParams.stop;
      color = colorStopParams.color;
    }

    if (isNaN(stop)) {
      throw new Error("Expected Number for color stop parameter: " + String(stop));
    }

    return {
      stop: stop,
      color: color,
    };
  },

  _loadColorGradient: function (
    this: Heatmap,
    gradientStopsArray: ColorStopArray | ColorStop[] | ColorStopArray[]
  ): ColorStop[] {
    const colorGradient: ColorStop[] = [];
    const arrayDepth = this._getArrayDepth(gradientStopsArray);

    if (arrayDepth === 1 && typeof gradientStopsArray[0] === "number") {
      gradientStopsArray = gradientStopsArray as ColorStopArray;
      colorGradient.push(this._loadColorStop(gradientStopsArray));
    } else if (arrayDepth <= 2 && Array.isArray(gradientStopsArray)) {
      gradientStopsArray = gradientStopsArray as ColorStop[] | ColorStopArray[];
      gradientStopsArray.forEach((gradientStop: ColorStop | ColorStopArray) => {
        colorGradient.push(this._loadColorStop(gradientStop));
      }, this);
    } else {
      throw new Error("Incorrect array depth for heatmap options.colorGradient.");
    }
    return colorGradient;
  },

  initialize: function (this: Heatmap, pointData: PointData[], options?: HeatmapOptions) {
    this.setOptions(options || {});
    this._pointData = this._loadPointData(pointData);
  },

  getData: function (this: Heatmap) {
    return this._pointData;
  },

  setData: function (this: Heatmap, pointData: PointData[]) {
    this._pointData = this._loadPointData(pointData);
    this._changedFlags.data = true;
    return this;
  },

  getPolygonPoints: function (this: Heatmap) {
    return this.options.polygonPoints;
  },

  getIndoorMapId: function (this: Heatmap) {
    return this.options.indoorMapId;
  },

  getIndoorMapFloorId: function (this: Heatmap) {
    return this.options.indoorMapFloorId;
  },

  getElevation: function (this: Heatmap) {
    return this.options.elevation;
  },

  getElevationMode: function (this: Heatmap) {
    return this.options.elevationMode;
  },

  getWeightMin: function (this: Heatmap) {
    return this.options.weightMin;
  },

  getWeightMax: function (this: Heatmap) {
    return this.options.weightMax;
  },

  getResolutionPixels: function (this: Heatmap) {
    return this.options.resolutionPixels;
  },

  getTextureBorderPercent: function (this: Heatmap) {
    return this.options.textureBorderPercent;
  },

  getUseApproximation: function (this: Heatmap) {
    return this.options.useApproximation;
  },

  getDensityStops: function (this: Heatmap) {
    return this.options.densityStops;
  },

  getDensityBlend: function (this: Heatmap) {
    return this.options.densityBlend;
  },

  getInterpolateDensityByZoom: function (this: Heatmap) {
    return this.options.interpolateDensityByZoom;
  },

  getZoomMin: function (this: Heatmap) {
    return this.options.zoomMin;
  },

  getZoomMax: function (this: Heatmap) {
    return this.options.zoomMax;
  },

  getColorGradient: function (this: Heatmap) {
    return this.options.colorGradient;
  },

  getOpacity: function (this: Heatmap) {
    return this.options.opacity;
  },

  getIntensityBias: function (this: Heatmap) {
    return this.options.intensityBias;
  },

  getIntensityScale: function (this: Heatmap) {
    return this.options.intensityScale;
  },

  getOccludedMapFeatures: function (this: Heatmap) {
    return this.options.occludedMapFeatures;
  },

  getOccludedAlpha: function (this: Heatmap) {
    return this.options.occludedAlpha;
  },

  getOccludedSaturation: function (this: Heatmap) {
    return this.options.occludedSaturation;
  },

  getOccludedBrightness: function (this: Heatmap) {
    return this.options.occludedBrightness;
  },

  ////

  setIndoorMapWithFloorId: function (this: Heatmap, indoorMapId: MapId, indoorMapFloorId: MapFloorId) {
    if (isNaN(indoorMapFloorId)) {
      throw new Error("Heatmap indoorMapFloorId cannot be NaN");
    }
    this.options.indoorMapId = indoorMapId || Heatmap.prototype.options.indoorMapId;
    this.options.indoorMapFloorId = indoorMapFloorId;
    this._changedFlags.indoorMap = true;
    return this;
  },

  setElevation: function (this: Heatmap, elevation: number) {
    if (isNaN(elevation)) {
      throw new Error("Heatmap elevation cannot be NaN");
    }
    this.options.elevation = elevation;
    this._changedFlags.elevation = true;
    return this;
  },

  setElevationMode: function (this: Heatmap, mode: ElevationMode) {
    if (!isValidElevationMode(mode)) {
      throw new Error("Heatmap elevationMode must be valid");
    }
    this.options.elevationMode = mode;
    this._changedFlags.elevation = true;
    return this;
  },

  setDensityBlend: function (this: Heatmap, densityBlend: number) {
    if (isNaN(densityBlend)) {
      throw new Error("Heatmap densityBlend cannot be NaN");
    }
    this.options.densityBlend = Math.min(Math.max(densityBlend, 0.0), 1.0);
    this._changedFlags.densityBlend = true;
    return this;
  },

  setInterpolateDensityByZoom: function (this: Heatmap, interpolateDensityByZoom: boolean) {
    this.options.interpolateDensityByZoom = interpolateDensityByZoom ? true : false;
    this._changedFlags.interpolateDensityByZoom = true;
    return this;
  },

  setZoomMin: function (this: Heatmap, zoomMin: number) {
    if (isNaN(zoomMin)) {
      throw new Error("Heatmap zoomMin cannot be NaN");
    }
    this.options.zoomMin = Math.max(zoomMin, 0.0);
    this._changedFlags.interpolateDensityByZoom = true;
    return this;
  },

  setZoomMax: function (this: Heatmap, zoomMax: number) {
    if (isNaN(zoomMax)) {
      throw new Error("Heatmap zoomMax cannot be NaN");
    }
    this.options.zoomMax = Math.max(zoomMax, 0.0);
    this._changedFlags.interpolateDensityByZoom = true;
    return this;
  },

  setIntensityBias: function (this: Heatmap, intensityBias: number) {
    if (isNaN(intensityBias)) {
      throw new Error("Heatmap intensityBias cannot be NaN");
    }
    this.options.intensityBias = Math.min(Math.max(intensityBias, 0.0), 1.0);
    this._changedFlags.intensityBias = true;
    return this;
  },

  setIntensityScale: function (this: Heatmap, intensityScale: number) {
    if (isNaN(intensityScale)) {
      throw new Error("Heatmap intensityScale cannot be NaN");
    }
    this.options.intensityScale = Math.max(intensityScale, 0.0);
    this._changedFlags.intensityScale = true;
    return this;
  },

  setOpacity: function (this: Heatmap, opacity: number) {
    if (isNaN(opacity)) {
      throw new Error("Heatmap opacity cannot be NaN");
    }
    this.options.opacity = Math.min(Math.max(opacity, 0.0), 1.0);
    this._changedFlags.opacity = true;
    return this;
  },

  setColorGradient: function (this: Heatmap, colorGradient: ColorStopArray | ColorStop[] | ColorStopArray[]) {
    this.options.colorGradient = this._loadColorGradient(colorGradient);
    this._changedFlags.colorGradient = true;
    return this;
  },

  setResolution: function (this: Heatmap, resolutionPixels: number) {
    if (isNaN(resolutionPixels)) {
      throw new Error("Heatmap resolutionPixels cannot be NaN");
    }
    this.options.resolutionPixels = Math.max(Math.min(resolutionPixels, RESOLUTION_PIXELS_MAX), RESOLUTION_PIXELS_MIN);

    this._changedFlags.resolution = true;
    return this;
  },

  setDensityStops: function (
    this: Heatmap,
    densityStops: (DensityStop | DensityStopArray) | (DensityStop | DensityStopArray)[]
  ) {
    this.options.densityStops = this._loadDensityStops(densityStops);
    this._changedFlags.densityStops = true;
    return this;
  },

  setUseApproximation: function (this: Heatmap, useApproximation: boolean) {
    this.options.useApproximation = useApproximation ? true : false;
    this._changedFlags.useApproximation = true;
    return this;
  },

  setWeightMin: function (this: Heatmap, weightMin: number) {
    if (isNaN(weightMin)) {
      throw new Error("Heatmap weightMin cannot be NaN");
    }
    this.options.weightMin = weightMin;
    this._changedFlags.data = true;
    return this;
  },

  setWeightMax: function (this: Heatmap, weightMax: number) {
    if (isNaN(weightMax)) {
      throw new Error("Heatmap weightMax cannot be NaN");
    }
    this.options.weightMax = weightMax;
    this._changedFlags.data = true;
    return this;
  },

  setPolygonPoints: function (this: Heatmap, polygonPoints: L.LatLngTuple[] | L.LatLngTuple[][]) {
    this.options.polygonPoints = this._loadPolygonRings(polygonPoints);
    this._changedFlags.polygon = true;
    return this;
  },

  setOptions: function (this: Heatmap, options: HeatmapOptions) {
    // merge options into this.options
    L.setOptions(this, options);

    // only call mutation method (which validates and sets dirty flag) if property exists in param
    if ("indoorMapId" in options || "indooindoorMapFloorIdMapId" in options) {
      this.setIndoorMapWithFloorId(this.options.indoorMapId, this.options.indoorMapFloorId);
    }
    if ("elevation" in options) {
      this.setElevation(this.options.elevation);
    }
    if ("elevationMode" in options) {
      this.setElevationMode(this.options.elevationMode);
    }
    if ("densityBlend" in options) {
      this.setDensityBlend(this.options.densityBlend);
    }
    if ("interpolateDensityByZoom" in options) {
      this.setInterpolateDensityByZoom(this.options.interpolateDensityByZoom);
    }
    if ("zoomMin" in options) {
      this.setZoomMin(this.options.zoomMin);
    }
    if ("zoomMax" in options) {
      this.setZoomMax(this.options.zoomMax);
    }
    if ("intensityBias" in options) {
      this.setIntensityBias(this.options.intensityBias);
    }
    if ("intensityScale" in options) {
      this.setIntensityScale(this.options.intensityScale);
    }
    if ("opacity" in options) {
      this.setOpacity(this.options.opacity);
    }
    if ("colorGradient" in options) {
      this.setColorGradient(this.options.colorGradient);
    }
    if ("resolutionPixels" in options) {
      this.setResolution(this.options.resolutionPixels);
    }
    if ("densityStops" in options) {
      this.setDensityStops(this.options.densityStops);
    }
    if ("useApproximation" in options) {
      this.setUseApproximation(this.options.useApproximation);
    }
    if ("weightMin" in options) {
      this.setWeightMin(this.options.weightMin);
    }
    if ("weightMax" in options) {
      this.setWeightMax(this.options.weightMax);
    }
    if ("polygonPoints" in options) {
      this.setPolygonPoints(this.options.polygonPoints);
    }

    return this;
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _update: function (this: Heatmap) {},

  beforeAdd: function (this: Heatmap) {
    // don't call base, avoid assigning this._renderer
  },

  onAdd: function (this: Heatmap) {
    this._map.heatmaps.addHeatmap(this);
  },

  onRemove: function (this: Heatmap) {
    this._map.heatmaps.removeHeatmap(this);
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  redraw: function (this: Heatmap) {},

  _changedFlags: {
    indoorMap: false,
    elevation: false,
    densityBlend: false,
    interpolateDensityByZoom: false,
    intensityBias: false,
    intensityScale: false,
    opacity: false,
    colorGradient: false,
    occludedStyle: false,
    resolution: false,
    densityStops: false,
    useApproximation: false,
    data: false,
    polygon: false,
  },

  _anyChanged: function (this: Heatmap) {
    return Object.values(this._changedFlags).some(Boolean);
  },

  _getChangedFlags: function (this: Heatmap) {
    return this._changedFlags;
  },

  _clearChangedFlags: function (this: Heatmap) {
    type Key = keyof typeof this._changedFlags;
    (Object.keys(this._changedFlags) as Key[]).forEach((key) => {
      this._changedFlags[key] = false;
    }, this);
  },
});

export const heatmap = factoryFor(Heatmap);
