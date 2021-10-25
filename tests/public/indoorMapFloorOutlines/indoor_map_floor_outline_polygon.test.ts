import * as indoorMapFloorOutlines from "../../../src/public/indoorMapFloorOutlines";

import { createMockIndoorMapFloorOutlinePolygonRing } from "../../__mocks__/mockIndoorMapFloorOutlines";

describe("IndoorMapFloorOutlinePolygon class", () => {
  let indoorMapFloorOutlinePolygon: indoorMapFloorOutlines.IndoorMapFloorOutlinePolygon;
  const outerRing = createMockIndoorMapFloorOutlinePolygonRing();
  const innerRings = createMockIndoorMapFloorOutlinePolygonRing();

  beforeEach(() => {
    indoorMapFloorOutlinePolygon = new indoorMapFloorOutlines.IndoorMapFloorOutlinePolygon(outerRing, innerRings);
  });

  /* indoorMapFloorOutlines.getOuterRing */

  describe("indoorMapFloorOutlines.getOuterRing", () => {
    it("is a function", () => {
      expect(typeof indoorMapFloorOutlinePolygon.getOuterRing).toBe("function");
    });

    it("returns the outer ring", () => {
      const value = indoorMapFloorOutlinePolygon.getOuterRing();
      expect(value).toBe(outerRing);
    });
  });

  /* indoorMapFloorOutlines.getInnerRings */

  describe("indoorMapFloorOutlines.getInnerRings", () => {
    it("is a function", () => {
      expect(typeof indoorMapFloorOutlinePolygon.getInnerRings).toBe("function");
    });

    it("returns the inner rings", () => {
      const value = indoorMapFloorOutlinePolygon.getInnerRings();
      expect(value).toBe(innerRings);
    });
  });
});
