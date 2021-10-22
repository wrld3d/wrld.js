import L from "leaflet";
import { factoryFor } from "../../private/factoryFor";
import { Color } from "../../types/color";
import { ElevationMode } from "../../types/elevationMode";
import { Map, MapId, MapFloorId } from "./../map";
import { Vector4 } from "../space";

export type PolygonOptions = L.PolylineOptions & {
  color?: Color;
  elevation?: number;
  elevationMode?: ElevationMode;
  indoorMapId?: MapId;
  indoorMapFloorId?: MapFloorId;
};

export class Polygon {
  private _map: Map | null;
  private _outerRing: L.LatLng[];
  private _holes: L.LatLng[][];
  private _config: PolygonOptions;
  private _color: Color;
  private __colorNeedsChanged: boolean;

  constructor(latLngs: L.LatLngTuple[] | L.LatLngTuple[][], config?: PolygonOptions) {
    this._map = null;
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

    this._color = this._config["color"] || new Vector4(0, 0, 255, 128);
    this.__colorNeedsChanged = true;
  }

  getColor = (): Color => this._color;

  setColor = (color: Color): this => {
    this._color = color;
    this.__colorNeedsChanged = true;
    return this;
  };

  addHole = (points: Parameters<typeof loadLatLngs>[0]): this => {
    this._holes.push(loadLatLngs(points));
    return this;
  };

  getHoles = (): L.LatLng[][] => this._holes;

  getPoints = (): L.LatLng[] => this._outerRing;

  addTo = (map: Map): this => {
    if (this._map !== null) {
      this.remove();
    }
    this._map = map;
    map._polygonModule.addPolygon(this);
    return this;
  };

  remove = (): this => {
    if (this._map !== null) {
      this._map._polygonModule.removePolygon(this);
      this._map = null;
    }
    return this;
  };

  /** @internal */
  _getConfig = (): PolygonOptions => this._config;

  /** @internal */
  _colorNeedsChanged = (): boolean => this.__colorNeedsChanged;

  /** @internal */
  _onColorChanged = (): void => {
    this.__colorNeedsChanged = false;
  };
}

const loadLatLngs = (coords: Parameters<typeof L.latLng>[0][]): L.LatLng[] => {
  const points: L.LatLng[] = [];
  coords.forEach(function (coord) {
    points.push(L.latLng(coord));
  });
  return points;
};

export const polygon = factoryFor(Polygon);
