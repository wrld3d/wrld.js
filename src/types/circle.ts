import type L from "leaflet";
import type Map from "./map";
import type ElevationMode from "./elevationMode";
import type DisplayOption from "./displayOption";

declare namespace Circle {
  type Options = L.CircleMarkerOptions & {
    elevation?: number;
    elevationMode?: ElevationMode;
    indoorMapId?: Map.MapId;
    indoorMapFloorId?: Map.MapFloorId;
    displayOption?: DisplayOption;
  };
}

declare class Circle extends L.Circle {
  constructor(latLng: L.LatLngExpression, options?: Circle.Options);
  getElevation(): number;
  setElevation(elevation: number): this;
  getElevationMode(): ElevationMode;
  setElevationMode(elevationMode: ElevationMode): this;
}

export default Circle;
