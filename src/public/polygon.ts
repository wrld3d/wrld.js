import L from "leaflet";
import { factoryFor } from "../private/factoryFor";
import { ElevationModeType, isValidElevationMode } from "../private/elevation_mode";
import { WrldOptions } from "../types/wrldOptions";
import { ElevationMode } from "../types/elevationMode";
import Map from "./map";

export type PolygonOptions = L.PolylineOptions & WrldOptions;

declare class PolygonType extends L.Polygon {
  options: PolygonOptions;
  protected _map: Map;
  constructor(
    latlngs: L.LatLngExpression[] | L.LatLngExpression[][] | L.LatLngExpression[][][],
    options?: PolygonOptions
  );
  getElevation(): number;
  setElevation(elevation: number): this;
  getElevationMode(): ElevationMode;
  setElevationMode(elevationMode: ElevationMode): this;
  protected _setLatLngs(latlngs: L.LatLng[]): this;
}

export type Polygon = PolygonType;

export const Polygon: typeof PolygonType = L.Polygon.extend({
  options: {
    elevation: 0,
    elevationMode: ElevationModeType.HEIGHT_ABOVE_GROUND,
  },

  _projectLatlngs: function (this: Polygon, latlngs: L.LatLng[], result: undefined, projectedBounds: L.LatLngBounds[]) {
    if (!this._map._projectLatlngs(this, latlngs, result, projectedBounds)) {
      // @ts-ignore we don't have a type definition for this
      L.Polygon.prototype._projectLatlngs.call(this, latlngs, result, projectedBounds);
    }
  },

  /** Replaces all the points in the polygon with the given array of geographical points. **/
  setLatLngs: function (this: Polygon, latlngs: L.LatLng[]) {
    this._setLatLngs(latlngs);

    if (this._map) {
      this._map._createPointMapping(this);
    }

    return this.redraw();
  },

  _convertLatLngs: function (this: Polygon, latlngs: L.LatLng[]) {
    // @ts-ignore we don't have a type definition for this
    const result = L.Polygon.prototype._convertLatLngs.call(this, latlngs);

    if (this._map) {
      this._map._createPointMapping(this);
    }

    return result;
  },

  getElevation: function (this: Polygon) {
    return this.options.elevation;
  },

  setElevation: function (this: Polygon, elevation: number) {
    this.options.elevation = elevation;

    if (this._map !== null) {
      this._map._createPointMapping(this);
    }

    return this;
  },

  setElevationMode: function (this: Polygon, mode: ElevationMode) {
    if (isValidElevationMode(mode)) {
      this.options.elevationMode = mode;

      if (this._map !== null) {
        this._map._createPointMapping(this);
      }
    }

    return this;
  },

  getElevationMode: function () {
    return this.options.elevationMode;
  },
});

export const polygon = factoryFor(Polygon);
