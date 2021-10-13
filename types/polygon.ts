import type L from "leaflet";
import type Map from "./map";
import type Color from "./color";
import type ElevationMode from "./elevationMode";

declare namespace Polygon {
  type Options = {
    color?: Color;
    elevation?: number;
    elevationMode?: ElevationMode;
    indoorMapId?: Map.MapId;
    indoorMapFloorId?: Map.MapFloorId;
  };
}

declare class Polygon extends L.Polygon {
  constructor(latlngs: L.LatLngTuple[] | L.LatLngTuple[][], options?: Polygon.Options);
  addTo(map: Map): this;
  remove(): this;
  getColor(): Color;
  setColor(color: Color): this;
  getPoints(): L.LatLngLiteral[];
  addHole(points: L.LatLngTuple[]): this;
  getHoles(): L.LatLngLiteral[][];
}

export default Polygon;
