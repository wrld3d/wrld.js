import L from "leaflet";

import { IndoorMapFloorOutlinePolygonRing } from "../../../src/public/indoorMapFloorOutlines";

describe("IndoorMapFloorOutlinePolygonRing class", () => {
  let indoorMapFloorOutlinePolygonRing: IndoorMapFloorOutlinePolygonRing;
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
