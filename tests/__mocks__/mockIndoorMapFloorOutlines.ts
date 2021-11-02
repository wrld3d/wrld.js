import indoorMapFloorOutlines from "../../src/types/indoorMapFloorOutlines";

import IndoorMapFloorOutlinePolygon from "../../src/public/indoorMapFloorOutlines/indoor_map_floor_outline_polygon";
import IndoorMapFloorOutlinePolygonRing from "../../src/public/indoorMapFloorOutlines/indoor_map_floor_outline_polygon_ring";
import L from "leaflet";

export const createMockIndoorMapFloorOutlinePolygon = (): indoorMapFloorOutlines.IndoorMapFloorOutlinePolygon => {
  const outerRing: indoorMapFloorOutlines.IndoorMapFloorOutlinePolygonRing = new IndoorMapFloorOutlinePolygonRing([L.latLng(0, 0)]);
  return new IndoorMapFloorOutlinePolygon(outerRing);
};

export const createMockIndoorMapFloorOutlinePolygonRing = (): indoorMapFloorOutlines.IndoorMapFloorOutlinePolygonRing => {
  return new IndoorMapFloorOutlinePolygonRing([L.latLng(0, 0)]);
};
  