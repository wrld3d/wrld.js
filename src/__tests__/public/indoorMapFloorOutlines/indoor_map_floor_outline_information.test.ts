import Wrld from "../../../../types";

import { IndoorMapFloorOutlineInformation } from "../../../public/indoorMapFloorOutlines/indoor_map_floor_outline_information";

import { createMockMap } from "../../__mocks__/mockMap";
import { createMockIndoorMapFloorOutlinePolygon } from "../../__mocks__/mockIndoorMapFloorOutlines";

describe("IndoorMapFloorOutlineInformation class", () => {
  let indoorMapFloorOutlineInformation: Wrld.indoorMapFloorOutlines.IndoorMapFloorOutlineInformation;
  const indoorMapId = "testId";
  const floorZOrder = 1;
  const outlinePolygons = [createMockIndoorMapFloorOutlinePolygon()];

  beforeEach(() => {
    indoorMapFloorOutlineInformation = new IndoorMapFloorOutlineInformation(indoorMapId, floorZOrder);
  });

  /* indoorMapFloorOutlines.getIndoorMapId */

  describe("indoorMapFloorOutlines.getIndoorMapId", () => {
    it("is a function", () => {
      expect(typeof indoorMapFloorOutlineInformation.getIndoorMapId).toBe("function");
    });

    it("returns the indoor map Id", () => {
      const value = indoorMapFloorOutlineInformation.getIndoorMapId();
      expect(value).toBe(indoorMapId);
    });
  });

  /* indoorMapFloorOutlines.getIndoorMapFloorId */

  describe("indoorMapFloorOutlines.getIndoorMapFloorId", () => {
    it("is a function", () => {
      expect(typeof indoorMapFloorOutlineInformation.getIndoorMapFloorId).toBe("function");
    });

    it("returns the indoor map floor id which is the z order", () => {
      const value = indoorMapFloorOutlineInformation.getIndoorMapFloorId();
      expect(value).toBe(floorZOrder);
    });
  });

  /* indoorMapFloorOutlines.getIndoorMapFloorOutlinePolygons */

  describe("indoorMapFloorOutlines.getIndoorMapFloorOutlinePolygons", () => {
    it("is a function", () => {
      expect(typeof indoorMapFloorOutlineInformation.getIndoorMapFloorOutlinePolygons).toBe("function");
    });

    it("returns an empty array by default", () => {
      const value = indoorMapFloorOutlineInformation.getIndoorMapFloorOutlinePolygons();
      expect(value).toEqual([]);
    });

    it("returns the outline polygons after setting data", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (indoorMapFloorOutlineInformation as any)._setData(outlinePolygons);
      const value = indoorMapFloorOutlineInformation.getIndoorMapFloorOutlinePolygons();
      expect(value).toEqual(outlinePolygons);
    });
  });

  /* indoorMapFloorOutlines.getIsLoaded */

  describe("indoorMapFloorOutlines.getIsLoaded", () => {
    it("is a function", () => {
      expect(typeof indoorMapFloorOutlineInformation.getIsLoaded).toBe("function");
    });

    it("returns false by default", () => {
      const value = indoorMapFloorOutlineInformation.getIsLoaded();
      expect(value).toBe(false);
    });

    it("returns true after setting data", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (indoorMapFloorOutlineInformation as any)._setData(outlinePolygons);
      const value = indoorMapFloorOutlineInformation.getIsLoaded();
      expect(value).toEqual(true);
    });
  });

  /* indoorMapFloorOutlines.getId */

  describe("indoorMapFloorOutlines.getId", () => {
    it("is a function", () => {
      expect(typeof indoorMapFloorOutlineInformation.getId).toBe("function");
    });

    it("returns null by default", () => {
      const value = indoorMapFloorOutlineInformation.getId();
      expect(value).toBe(null);
    });

    it("returns the id after setting the native handle", () => {
      const id = "testId";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (indoorMapFloorOutlineInformation as any)._setNativeHandle(id);
      const value = indoorMapFloorOutlineInformation.getId();
      expect(value).toEqual(id);
    });
  });

  /* indoorMapFloorOutlines.addTo */

  describe("indoorMapFloorOutlines.addTo", () => {
    it("is a function", () => {
      expect(typeof indoorMapFloorOutlineInformation.addTo).toBe("function");
    });

    it("returns this", () => {
      const map = createMockMap();
      const value = indoorMapFloorOutlineInformation.addTo(map);
      expect(value).toBe(indoorMapFloorOutlineInformation);
    });
  });

  /* indoorMapFloorOutlines.remove */

  describe("indoorMapFloorOutlines.remove", () => {
    it("is a function", () => {
      expect(typeof indoorMapFloorOutlineInformation.remove).toBe("function");
    });

    it("returns this", () => {
      const value = indoorMapFloorOutlineInformation.remove();
      expect(value).toBe(indoorMapFloorOutlineInformation);
    });
  });
});
