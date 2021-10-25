import L from "leaflet";

import * as indoorMapFloorOutlines from "../../../src/public/indoorMapFloorOutlines";

describe("IndoorMapFloorOutlinePolygonRing class", () => {
  let indoorMapFloorOutlinePolygonRing: indoorMapFloorOutlines.IndoorMapFloorOutlinePolygonRing;
  const latLngPoints = [L.latLng(0, 0)];

  beforeEach(() => {
    indoorMapFloorOutlinePolygonRing = new indoorMapFloorOutlines.IndoorMapFloorOutlinePolygonRing(latLngPoints);
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
