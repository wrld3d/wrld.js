import Wrld from "../../../../types";
import "wrld.js";

import IndoorMapFloorOutlinePolygonRing from "../../../public/indoorMapFloorOutlines/indoor_map_floor_outline_polygon_ring";

describe("IndoorMapFloorOutlinePolygonRing class", () => {
  let indoorMapFloorOutlinePolygonRing: Wrld.indoorMapFloorOutlines.IndoorMapFloorOutlinePolygonRing;
  const latLngPoints = [L.latLng(0, 0)];

  beforeEach(() => {
    indoorMapFloorOutlinePolygonRing = new IndoorMapFloorOutlinePolygonRing(latLngPoints);
  });

  /* indoorMapFloorOutlines.getLatLngPoints */

  describe("indoorMapFloorOutlines.getLatLngPoints", () => {
    it("is a function", () => {
      expect(typeof indoorMapFloorOutlinePolygonRing.getLatLngPoints).toBe("function");
    });

    it("returns the latLngPoints", () => {
      const value = indoorMapFloorOutlinePolygonRing.getLatLngPoints();
      expect(value).toBe(latLngPoints);
    });
  });
});
