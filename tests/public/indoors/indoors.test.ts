import { IndoorMap, IndoorMapEntrance, IndoorMapFloor } from "../../../src/public/indoors";

describe("indoors namespace", () => {

  /* indoors.IndoorMap */

  describe("indoors.IndoorMap", () => {
    it("is a function", () => {
      expect(typeof IndoorMap).toBe("function");
    });
  });

  /* indoors.IndoorMapEntrance */

  describe("indoors.IndoorMapEntrance", () => {
    it("is a function", () => {
      expect(typeof IndoorMapEntrance).toBe("function");
    });
  });

  /* indoors.IndoorMapFloor */

  describe("indoors.IndoorMapFloor", () => {
    it("is a function", () => {
      expect(typeof IndoorMapFloor).toBe("function");
    });
  });
});