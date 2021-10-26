import L from "leaflet";
import Wrld from "../src";

describe("Wrld.map", () => {
  const elementId = "map";
  let element: HTMLElement;
  const apiKey = "testApiKey";
  let options: Wrld.MapOptions;

  beforeEach(() => {
    element = document.createElement("div");
  });

  it("is a function", () => {
    expect(typeof Wrld.map).toBe("function");
  });

  describe("when null is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(null, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when undefined is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(undefined, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when false is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(false as any, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when true is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(true as any, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when a falsy number is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(0 as any, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when a truthy number is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(1 as any, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when passing a container element that is NOT on the DOM", () => {
    it("does not throw an error", () => {
      expect(() => Wrld.map(element, apiKey, options)).not.toThrow();
    });
  });

  describe("when passing a container element id for an element that is NOT on the DOM", () => {
    it("throws an error", () => {
      element.setAttribute("id", elementId);
      expect(() => Wrld.map(elementId, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when passing a container element that is on the DOM", () => {
    it("does not throw an error", () => {
      document.body.appendChild(element);
      expect(() => Wrld.map(element, apiKey, options)).not.toThrow();
    });
  });

  describe("when passing a container element id for an element that is on the DOM", () => {
    it("does not throw an error", () => {
      element.setAttribute("id", elementId);
      document.body.appendChild(element);
      expect(() => Wrld.map(elementId, apiKey, options)).not.toThrow();
    });
  });
});

describe("Wrld.Map", () => {
  it("is a function", () => {
    expect(Wrld.Map).toBeInstanceOf(Function);
  })
})

describe("Wrld vs L", () => {
  describe("L", () => {
    test("L.map has two parameters", () => {
      expect(L.map.length).toBe(2);
    });

    test("L.marker does not have elevation", () => {
      const marker = L.marker([0, 0]);
      expect(marker.options["elevation"]).toBeUndefined();
    });
  });

  test("Wrld.map has three parameters", () => {
    expect(Wrld.map.length).toBe(3);
  });

  test("Wrld.marker has elevation", () => {
    const marker = Wrld.marker([0, 0]);
    expect(marker.options.elevation).toBe(0);
  });

  test("Wrld.circle has elevation", () => {
    const circle = Wrld.circle([0, 0]);
    expect(circle.options.elevation).toBe(0);
  });

  test("Wrld.popup has elevation", () => {
    const popup = Wrld.popup({elevation: 0});
    expect(popup.options.elevation).toBe(0);
  });

  test("Wrld.polygon has elevation", () => {
    const polygon = Wrld.polygon([[0, 0]]);
    expect(polygon.options.elevation).toBe(0);
  });

  test("Wrld.polyline has elevation", () => {
    const polyline = Wrld.polyline([[0, 0]]);
    expect(polyline.options.elevation).toBe(0);
    expect(polyline.getElevation()).toBe(0);
    expect(polyline.getElevationMode()).toBe("heightAboveGround");
  });

  test("Wrld.rectangle has elevation", () => {
    const rectangle = Wrld.rectangle([[0, 0], [0, 0], [0, 0], [0, 0]]);
    expect(rectangle.options.elevation).toBe(0);
  });

  describe("Wrld.native", () => {
    it("exists", () => {
      expect(Wrld.native.polygon).toBeInstanceOf(Function);
      expect(Wrld.native.Polygon).toBeInstanceOf(Function);
    });

    it("instantiates correctly", () => {
      const polyline = Wrld.native.polyline([[0, 0]]);
      const element = document.createElement("div");
      document.body.appendChild(element);
      const map = Wrld.map(element, "api_key");
      polyline.addTo(map);
      expect(polyline.getPoints()).toEqual([{ lat: 0, lng: 0 }]);
    });
  
    it("cannot be used with L.Map", () => {
      const element = document.createElement("div");
      document.body.appendChild(element);
      const map = L.map(element);
      const poly = Wrld.native.polygon([[0, 0], [0, 0]]);
      expect(() => { poly.addTo(map as Wrld.Map); }).toThrowError();
    });
  });
});

// For compatibility with eeGeoWebGL we need L.Wrld present
describe("window.L", () => {
  it("has the Wrld plugin", () => {
    expect(window.L["Wrld"]).toEqual(Wrld);
  });
});
