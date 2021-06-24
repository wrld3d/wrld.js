import Wrld from "../../../../types";

import IndoorMap from "../../../public/indoors/indoor_map";
import IndoorMapFloor from "../../../public/indoors/indoor_map_floor";

describe("IndoorMap class", () => {
  let entrance: Wrld.indoors.IndoorMap;
  const indoorMapId = "testId";
  const indoorMapName = "testName";
  const indoorMapSourceVendor = "testSourceVendor";
  // Floor creation logic is buried in the indoors module and can't make use of it here
  const floorCount = 2;
  const floors: Wrld.indoors.IndoorMapFloor[] = [];
  for (let i = 0; i < floorCount; ++i) {
    floors.push(new IndoorMapFloor(i, i, `Floor ${i}`, i.toString()));
  }
  const searchTags: Wrld.indoors.SearchTag[] = [
    {
      name: "name",
      search_tag: "search_tag",
      icon_key: "icon_key"
    }
  ];
  const exitFunc = jest.fn();

  beforeEach(() => {
    entrance = new IndoorMap(indoorMapId, indoorMapName, indoorMapSourceVendor, floorCount, floors, searchTags, exitFunc);
  });

  /* IndoorMap.exit */

  describe("IndoorMap.exit", () => {
    it("is a function", () => {
      expect(typeof entrance.exit).toBe("function");
    });

    it("calls the exit fucntion", () => {
      entrance.exit();
      expect(exitFunc).toHaveBeenCalled();
    });
  });

  /* IndoorMap.getIndoorMapId */

  describe("IndoorMap.getIndoorMapId", () => {
    it("is a function", () => {
      expect(typeof entrance.getIndoorMapId).toBe("function");
    });

    it("returns the indoor map Id", () => {
      const value = entrance.getIndoorMapId();
      expect(value).toBe(indoorMapId);
    });
  });

  /* IndoorMap.getIndoorMapName */

  describe("IndoorMap.getIndoorMapName", () => {
    it("is a function", () => {
      expect(typeof entrance.getIndoorMapName).toBe("function");
    });

    it("returns the indoor map name", () => {
      const value = entrance.getIndoorMapName();
      expect(value).toBe(indoorMapName);
    });
  });

  /* IndoorMap.getFloorCount */

  describe("IndoorMap.getFloorCount", () => {
    it("is a function", () => {
      expect(typeof entrance.getFloorCount).toBe("function");
    });

    it("returns the floor count", () => {
      const value = entrance.getFloorCount();
      expect(value).toBe(floorCount);
    });
  });

  /* IndoorMap.getFloors */

  describe("IndoorMap.getFloors", () => {
    it("is a function", () => {
      expect(typeof entrance.getFloors).toBe("function");
    });

    it("returns the array of floors", () => {
      const value = entrance.getFloors();
      expect(value).toBe(floors);
      expect(Array.isArray(value)).toBe(true);
      expect(value.length).toBe(floorCount);
      expect(value.length).toBe(floors.length);
    });
  });

  /* IndoorMap.getSearchTags */

  describe("IndoorMap.getSearchTags", () => {
    it("is a function", () => {
      expect(typeof entrance.getSearchTags).toBe("function");
    });

    it("returns the array of search tags", () => {
      const value = entrance.getSearchTags();
      expect(value).toBe(searchTags);
      expect(Array.isArray(value)).toBe(true);
      expect(value.length).toBe(searchTags.length);
    });
  });
});
