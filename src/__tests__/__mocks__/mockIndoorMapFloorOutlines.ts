import { indoorMapFloorOutlines } from "../../../types";

import IndoorMapFloorOutlinePolygon from "../../public/indoorMapFloorOutlines/indoor_map_floor_outline_polygon";
import IndoorMapFloorOutlinePolygonRing from "../../public/indoorMapFloorOutlines/indoor_map_floor_outline_polygon_ring";

export const createMockIndoorMapFloorOutlinePolygon = (): indoorMapFloorOutlines.IndoorMapFloorOutlinePolygon => {
  const outerRing: indoorMapFloorOutlines.IndoorMapFloorOutlinePolygonRing = new IndoorMapFloorOutlinePolygonRing([L.latLng(0, 0)]);
  return new IndoorMapFloorOutlinePolygon(outerRing);
};

export const createMockIndoorMapFloorOutlinePolygonRing = (): indoorMapFloorOutlines.IndoorMapFloorOutlinePolygonRing => {
  return new IndoorMapFloorOutlinePolygonRing([L.latLng(0, 0)]);
};
  