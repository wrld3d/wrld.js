import Wrld from "../../src";
import L from "leaflet";

describe("constructor", () => {
  it("accepts a [lat, lng] array of arrays", () => {
    const heatmap = Wrld.heatmap([
      [0, 0],
      [1, 1],
    ]);
    expect(heatmap.getData()).toEqual([
      { latLng: L.latLng(0, 0), weight: 1 },
      { latLng: L.latLng(1, 1), weight: 1 },
    ]);
  });

  it("accepts a [lat, lng, weight] array of arrays", () => {
    const heatmap = Wrld.heatmap([
      [0, 0, 0.5],
      [1, 1, 1],
    ]);
    expect(heatmap.getData()).toEqual([
      { latLng: L.latLng(0, 0), weight: 0.5 },
      { latLng: L.latLng(1, 1), weight: 1 },
    ]);
  });

  it("accepts a WeightedPoint array", () => {
    const heatmap = Wrld.heatmap([
      { latLng: L.latLng(0, 0), weight: 0.5 },
      { latLng: L.latLng(1, 1), weight: 1 },
    ]);
    expect(heatmap.getData()).toEqual([
      { latLng: L.latLng(0, 0), weight: 0.5 },
      { latLng: L.latLng(1, 1), weight: 1 },
    ]);
  });

  it("accepts a custom data format", () => {
    const heatmap = Wrld.heatmap(
      [
        { coordinates: L.latLng(0, 0), value: 0.5 },
        { coordinates: L.latLng(1, 1), value: 1 },
      ],
      { dataCoordProperty: "coordinates", dataWeightProperty: "value" }
    );
    expect(heatmap.getData()).toEqual([
      { latLng: L.latLng(0, 0), weight: 0.5 },
      { latLng: L.latLng(1, 1), weight: 1 },
    ]);
  });
});

describe("colorGradient", () => {
  it("does not accept a a single object", () => {
    expect(() => {
      Wrld.heatmap([]).setColorGradient({ color: [255, 255, 255], stop: 1 } as any);
    }).toThrow();
  });

  it("accepts a a single object", () => {
    const heatmap = Wrld.heatmap([]).setColorGradient([0.42, [255, 0, 255]]);
    expect(heatmap.getColorGradient()).toEqual([
      {
        stop: 0.42,
        color: [255, 0, 255],
      },
    ]);
  });

  it("can be set as an array of objects", () => {
    const heatmap = Wrld.heatmap([]).setColorGradient([{ color: [255, 255, 255], stop: 1 }]);
    expect(heatmap.getColorGradient()).toEqual([
      {
        stop: 1,
        color: [255, 255, 255],
      },
    ]);
  });

  it("can be set as an array of objects", () => {
    const heatmap = Wrld.heatmap([]).setColorGradient([[1, [255, 255, 255]]]);
    expect(heatmap.getColorGradient()).toEqual([
      {
        stop: 1,
        color: [255, 255, 255],
      },
    ]);
  });
});
