import { Map, MapOptions } from "../../types";

import Wrld from "../wrld";

describe("Wrld.map", () => {
  let map: Map | null;
  const elementId = "map";
  let element: HTMLElement | null;
  const apiKey = "testApiKey";
  let options: MapOptions;

  beforeEach(() => {
    map = null;
    element = null;
  });

  it("is a function", () => {
    expect(typeof Wrld.map).toBe("function");
  });

  describe("when no container element is passed", () => {
    it("throws an error", () => {
      expect(() => Wrld.map(null, apiKey, options)).toThrowError("No map container found");
    });
  });

  // TODO
  describe("when passing a container element that is NOT on the DOM", () => {
    it("creates an instance of the map", () => {
      element = document.createElement("div");
      map = Wrld.map(element, apiKey, options);
      expect(map).toBeTruthy();
    });
  });

  // TODO
  describe("when passing a container element id for an element that is NOT on the DOM", () => {
    it("creates an instance of the map", () => {
      element = document.createElement("div");
      element.setAttribute("id", elementId);
      expect(() => Wrld.map(elementId, apiKey, options)).toThrowError("No map container found");
    });
  });

  // TODO
  describe("when passing a container element that is on the DOM", () => {
    it("creates an instance of the map", () => {
      element = document.createElement("div");
      map = Wrld.map(element, apiKey, options);
      expect(map).toBeTruthy();
    });
  });

  // TODO
  describe("when passing a container element id for an element that is on the DOM", () => {
    it("creates an instance of the map", () => {
      element = document.createElement("div");
      element.setAttribute("id", elementId);
      expect(() => Wrld.map(elementId, apiKey, options)).toThrowError("No map container found");
    });
  });
});