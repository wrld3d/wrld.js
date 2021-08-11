import type L from "leaflet";
import type ElevationMode from "./elevationMode";
import type Map from "./map";

declare class Marker extends L.Marker {
  constructor(latlng: L.LatLngExpression, options?: Marker.Options);
  getElevation(): number;
  setElevation(elevation : number): this;
  getElevationMode(): ElevationMode;
  setElevationMode(elevationMode: ElevationMode): this;
  setIndoorMapWithFloorId(indoorMapId: Map.MapId, indoorMapFloorId: Map.MapFloorId): this;
  setIndoorMapWithFloorIndex(indoorMapId: Map.MapId, indoorMapFloorIndex: Map.MapFloorIndex): this;
  setOutdoor(): this;
}

declare namespace Marker {
  export type Options = L.MarkerOptions & {
    elevation?: number;
    elevationMode?: ElevationMode;
    indoorMapId?: Map.MapId;
    indoorMapFloorId?: Map.MapFloorId;
  };
}

export default Marker;
