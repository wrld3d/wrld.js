import type L from "leaflet";
import type Map from "./map";
import type Color from "./color";
import type ElevationMode from "./elevationMode";
import type DisplayOption from "./displayOption";

declare namespace Polyline {
  type Options = {
    color?: Color;
    elevation?: number;
    elevationMode?: ElevationMode;
    indoorMapId?: Map.MapId;
    indoorMapFloorId?: Map.MapFloorId;
    weight?: number;
    miterLimit?: number;
    displayOption?: DisplayOption;
  };
}

declare class Polyline extends L.Polyline {
  constructor(latlngs: L.LatLngExpression[], options?: Polyline.Options);
  getPoints(): L.LatLng[];
  getIndoorMapId(): Map.MapId;
  getIndoorMapFloorId(): Map.MapFloorId;
  setIndoorMapWithFloorId(indoorMapId: Map.MapId, indoorMapFloorId: Map.MapFloorId): this;
  getElevation(): number;
  setElevation(elevation : number): this;
  getElevationMode(): ElevationMode;
  setElevationMode(elevationMode: ElevationMode): this;
  getWidth(): number;
  getColor(): Color;
  getMiterLimit(): number;
  setOptions(options: Polyline.Options): this;
  setStyle(options: Polyline.Options): this;
}

export default Polyline;
