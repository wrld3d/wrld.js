import type L from "leaflet";
import type Map from "./map";
import type ElevationMode from "./elevationMode";
import type DisplayOption from "./displayOption";

declare namespace Rectangle {
  type Options = L.PolylineOptions & {
    elevation?: number;
    elevationMode?: ElevationMode;
    indoorMapId?: Map.MapId;
    indoorMapFloorId?: Map.MapFloorId;
    displayOption?: DisplayOption;
  };
}

declare class Rectangle extends L.Rectangle {
  constructor(latLngBounds: L.LatLngBoundsExpression, options?: Rectangle.Options);
  getElevation(): number;
  setElevation(elevation: number): this;
  getElevationMode(): ElevationMode;
  setElevationMode(elevationMode: ElevationMode): this;
}

export default Rectangle;
