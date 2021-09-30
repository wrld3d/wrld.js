import type Map from "../src/types/map";
import Wrld from "../src/wrld";

describe("Wrld.map", () => {
  const elementId = "map";
  let element: HTMLElement;
  const apiKey = "testApiKey";
  let options: Map.Options;

  beforeEach(() => {
    element = document.createElement("div");
  });

  it("is a function", () => {
    expect(typeof Wrld.map).toBe("function");
  });

  describe("when null is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(null as any, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when undefined is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(undefined as any, apiKey, options)).toThrowError("No map container found");
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
      element = document.createElement("div");
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
