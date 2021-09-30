import type L from "leaflet";
import type Map from "./map";
import type Color from "./color";
import type ElevationMode from "./elevationMode";

declare namespace Heatmap {
  type PointData = [number, number] | [number, number, number] | {
      latLng?: L.LatLngExpression;
      weight?: number;
  } | {
      [property: string]: L.LatLngExpression | number;
  };

  type DensityStop = {
      stop: number;
      radius: number;
      gain: number;
  };

  type ColorStop = {
      stop: number;
      color: Color;
  };

  type OcclusionMapFeature = "ground" | "buildings" | "trees" | "transport";

  type Options = {
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
    indoorMapId?: Map.MapId;
    indoorMapFloorId?: Map.MapFloorId;
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

  type Heatmaps = {
    addHeatmap: (heatmap: Heatmap) => void;
    removeHeatmap: (heatmap: Heatmap) => void;
  }
}

declare class Heatmap extends L.Layer {
  constructor(pointData: Heatmap.PointData[], options?: Heatmap.Options);

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
  getIndoorMapId(): Map.MapId;
  getIndoorMapFloorId(): Map.MapFloorId;
  getElevation(): number;
  getElevationMode(): ElevationMode;
  getOccludedMapFeatures(): Heatmap.OcclusionMapFeature[];
  getOccludedAlpha(): number;
  getOccludedSaturation(): number;
  getOccludedBrightness(): number;
  getPolygonPoints(): L.LatLngTuple;
  getTextureBorderPercent(): number;
  getUseApproximation(): boolean;

  setOptions(options: Heatmap.Options): this;
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
  setIndoorMapWithFloorId(indoorMapId: Map.MapId, indoorMapFloorId: Map.MapFloorId): this;
  setElevation(elevation: number): this;
  setElevationMode(mode: ElevationMode): this;
  setPolygonPoints(polygonPoints: L.LatLngTuple): this;
  setUseApproximation(useApproximation: boolean): this;
}

export default Heatmap;
