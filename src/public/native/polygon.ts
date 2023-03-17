import L from "leaflet";
import { factoryFor } from "../../private/factoryFor";
import { Color } from "../../types/color";
import { ElevationMode } from "../../types/elevationMode";
import { Map, MapId, MapFloorId } from "./../map";

export type PolygonOptions = L.PolylineOptions & {
  color?: Color;
  elevation?: number;
  elevationMode?: ElevationMode;
  indoorMapId?: MapId;
  indoorMapFloorId?: MapFloorId;
};

declare class PolygonType extends L.Layer
{
  constructor(latLngs: L.LatLngTuple[] | L.LatLngTuple[][], config?: PolygonOptions);
  protected _wrldMap: Map | null;
  protected _outerRing: L.LatLng[];
  protected _holes: L.LatLng[][];
  protected _config: PolygonOptions;
  protected _color: Color;
  protected __colorNeedsChanged: boolean;
  getColor(): Color;
  setColor(color: Color): this;
  addHole(points: Parameters<typeof loadLatLngs>[0]): this;
  getHoles(): L.LatLng[][];
  getPoints(): L.LatLng[];
  onAdd(map: Map): this;
  onRemove(): this;
  beforeAdd(map: L.Map): this;
  protected _getConfig(): PolygonOptions;
  protected _colorNeedsChanged(): boolean;
  protected _onColorChanged(): void;
}

export const Polygon: typeof PolygonType = L.Layer.extend({
  initialize(this: PolygonType, latLngs: L.LatLngTuple[] | L.LatLngTuple[][], config?: PolygonOptions) {
    this._wrldMap = null;
    this._outerRing = [];
    this._holes = [];
    this._config = config || {};

    let arrayDepth = 0;
    let testElement: L.LatLngTuple[][] | L.LatLngTuple[] | L.LatLngTuple | number = latLngs;

    do {
      testElement = testElement[0];
      arrayDepth++;
    } while (Array.isArray(testElement));

    if (arrayDepth === 2) {
      this._outerRing = loadLatLngs(latLngs as L.LatLngTuple[]);
    } else if (arrayDepth === 3) {
      this._outerRing = loadLatLngs(latLngs[0] as L.LatLngTuple[]);
      const holeLatLngs = latLngs.splice(1) as L.LatLngTuple[][];
      holeLatLngs.forEach((holeLatLng) => {
        this._holes.push(loadLatLngs(holeLatLng));
      });
    } else {
      throw new Error("Incorrect array input format.");
    }

    this._color = this._config["color"] || [0, 0, 255, 128];
    this.__colorNeedsChanged = true;
  },

  getColor: function(this: PolygonType): Color {
    return this._color;
  },

  setColor: function(this: PolygonType, color: Color): PolygonType {
    this._color = color;
    this.__colorNeedsChanged = true;
    return this;
  },

  addHole: function(this: PolygonType, points: Parameters<typeof loadLatLngs>[0]): PolygonType {
    this._holes.push(loadLatLngs(points));
    return this;
  },

  getHoles: function(this: PolygonType): L.LatLng[][] {
    return this._holes;
  },

  getPoints: function(this: PolygonType): L.LatLng[] {
    return this._outerRing;
  },

  onAdd: function(this: PolygonType, map: Map): PolygonType {
    if (this._wrldMap !== null) {
      this.onRemove();
    }
    this._wrldMap = map;
    map._polygonModule.addPolygon(this);
    this.__colorNeedsChanged = true;
    return this;
  },

  onRemove: function(this: PolygonType): PolygonType {
    if (this._wrldMap !== null) {
      this._wrldMap._polygonModule.removePolygon(this);
      this._wrldMap = null;
    }
    return this;
  },

  beforeAdd: function(this: PolygonType, map: L.Map) : PolygonType {
    if (!(map instanceof Map)) {
      throw new Error("Wrld.native.Polygon can only be used with Wrld.Map");
    }
    return this;
  },

  /** @internal */
  _getConfig: function(this: PolygonType): PolygonOptions {
    return this._config;
  },

  /** @internal */
  _colorNeedsChanged: function(this: PolygonType): boolean {
    return this.__colorNeedsChanged;
  },

  /** @internal */
  _onColorChanged: function(this: PolygonType): void {
    this.__colorNeedsChanged = false;
  },
});

const loadLatLngs = (coords: Parameters<typeof L.latLng>[0][]): L.LatLng[] => {
  const points: L.LatLng[] = [];
  coords.forEach(function (coord) {
    points.push(L.latLng(coord));
  });
  return points;
};

export type Polygon = PolygonType;
export const polygon = factoryFor(Polygon);
