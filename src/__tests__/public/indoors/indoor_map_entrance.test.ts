import Wrld from "../../../../types";
import "wrld.js";

import IndoorMapEntrance from "../../../public/indoors/indoor_map_entrance";

describe("IndoorMapEntrance class", () => {
  let entrance: Wrld.indoors.IndoorMapEntrance;
  const mapId = "testId";
  const mapName = "testName";
  const lat = 56.459233;
  const lng = -2.971255;

  beforeEach(() => {
    entrance = new IndoorMapEntrance(mapId, mapName, new L.LatLng(lat, lng));
  });

  /* IndoorMapEntrance.getIndoorMapId */

  describe("IndoorMapEntrance.getIndoorMapId", () => {
    it("is a function", () => {
      expect(typeof entrance.getIndoorMapId).toBe("function");
    });

    it("returns the indoor map Id", () => {
      const value = entrance.getIndoorMapId();
      expect(value).toBe(mapId);
    });
  });

  /* IndoorMapEntrance.getIndoorMapName */

  describe("IndoorMapEntrance.getIndoorMapName", () => {
    it("is a function", () => {
      expect(typeof entrance.getIndoorMapName).toBe("function");
    });

    it("returns the indoor map name", () => {
      const value = entrance.getIndoorMapName();
      expect(value).toBe(mapName);
    });
  });

  /* IndoorMapEntrance.getLatLng */

  describe("IndoorMapEntrance.getLatLng", () => {
    it("is a function", () => {
      expect(typeof entrance.getLatLng).toBe("function");
    });

    it("returns the latLng", () => {
      const value = entrance.getLatLng();
      expect(value.lat).toBe(lat);
      expect(value.lng).toBe(lng);
    });
  });
});