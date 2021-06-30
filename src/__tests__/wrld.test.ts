import { MapOptions } from "../../types";

import Wrld from "../wrld";

describe("Wrld.map", () => {
  const elementId = "map";
  let element: HTMLElement | null;
  const apiKey = "testApiKey";
  let options: MapOptions;

  beforeEach(() => {
    element = null;
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
      expect(() => Wrld.map(false, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when true is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(true, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when a falsy number is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(0, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when a truthy number is passed as the container element", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(1, apiKey, options)).toThrowError("No map container found");
    });
  });

  describe("when passing a container element that is NOT on the DOM", () => {
    it("does not throw an error", () => {
      element = document.createElement("div");
      expect(() => Wrld.map(element, apiKey, options)).not.toThrow();
    });
  });

  describe("when passing a container element id for an element that is NOT on the DOM", () => {
    it("throws an error", () => {
      element = document.createElement("div");
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
      element = document.createElement("div");
      element.setAttribute("id", elementId);
      document.body.appendChild(element);
      expect(() => Wrld.map(elementId, apiKey, options)).not.toThrow();
    });
  });
});
