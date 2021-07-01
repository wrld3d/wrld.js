import Wrld from "../../../../types";

import IndoorMapFloor from "../../../public/indoors/indoor_map_floor";

describe("IndoorMapFloor class", () => {
  let floor: Wrld.indoors.IndoorMapFloor;
  const floorZOrder = 1;
  const floorIndex = 0;
  const floorName = "Ground Floor";
  const floorShortName = "G";

  beforeEach(() => {
    floor = new IndoorMapFloor(floorZOrder, floorIndex, floorName, floorShortName);
  });

  /* deprecated IndoorMapEntrance.getFloorId */

  describe("IndoorMapEntrance.getFloorId", () => {
    it("is a function", () => {
      expect(typeof floor.getFloorId).toBe("function");
    });

    it("returns the floor short name", () => {
      const value = floor.getFloorId();
      expect(value).toBe(floorShortName);
    });
  });

  /* deprecated internal IndoorMapEntrance._getFloorId */

  describe("IndoorMapEntrance._getFloorId", () => {
    it("is a function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(typeof (floor as any)._getFloorId).toBe("function");
    });

    it("returns the floor z order", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (floor as any)._getFloorId();
      expect(value).toBe(floorZOrder);
    });
  });

  /* IndoorMapEntrance.getFloorZOrder */

  describe("IndoorMapEntrance.getFloorZOrder", () => {
    it("is a function", () => {
      expect(typeof floor.getFloorZOrder).toBe("function");
    });

    it("returns the floor z order", () => {
      const value = floor.getFloorZOrder();
      expect(value).toBe(floorZOrder);
    });
  });

  /* IndoorMapEntrance.getFloorIndex */

  describe("IndoorMapEntrance.getFloorIndex", () => {
    it("is a function", () => {
      expect(typeof floor.getFloorIndex).toBe("function");
    });

    it("returns the floor index", () => {
      const value = floor.getFloorIndex();
      expect(value).toBe(floorIndex);
    });
  });

  /* IndoorMapEntrance.getFloorName */

  describe("IndoorMapEntrance.getFloorName", () => {
    it("is a function", () => {
      expect(typeof floor.getFloorName).toBe("function");
    });

    it("returns the floor name", () => {
      const value = floor.getFloorName();
      expect(value).toBe(floorName);
    });
  });

  /* IndoorMapEntrance.getFloorShortName */

  describe("IndoorMapEntrance.getFloorShortName", () => {
    it("is a function", () => {
      expect(typeof floor.getFloorShortName).toBe("function");
    });

    it("returns the floor short name", () => {
      const value = floor.getFloorShortName();
      expect(value).toBe(floorShortName);
    });
  });
});
