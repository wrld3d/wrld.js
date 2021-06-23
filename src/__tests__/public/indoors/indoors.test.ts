import indoors from "../../../public/indoors/indoors";

describe("indoors namespace", () => {

  /* indoors.IndoorMap */

  describe("indoors.IndoorMap", () => {
    it("is a class", () => {
      expect(typeof indoors.IndoorMap).toBe("function");
    });
  });

  /* indoors.IndoorMapEntrance */

  describe("indoors.IndoorMapEntrance", () => {
    it("is a class", () => {
      expect(typeof indoors.IndoorMapEntrance).toBe("function");
    });
  });

  /* indoors.IndoorMapFloor */

  describe("indoors.IndoorMapFloor", () => {
    it("is a class", () => {
      expect(typeof indoors.IndoorMapFloor).toBe("function");
    });
  });
});