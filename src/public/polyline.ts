import { ElevationModeType, isValidElevationMode } from "../private/elevation_mode";
import L from "leaflet";
import { factoryFor } from "../private/factoryFor";
import { WrldOptions } from "../types/wrldOptions";
import { ElevationMode } from "../types/elevationMode";
import Map from "./map";

export type PolylineOptions = L.PolylineOptions & WrldOptions;

declare class PolylineType extends L.Polyline {
  options: PolylineOptions;
  protected _map: Map;
  constructor(
    latlngs: L.LatLngExpression[] | L.LatLngExpression[][] | L.LatLngExpression[][][],
    options?: PolylineOptions
  );
  getElevation(): number;
  setElevation(elevation: number): this;
  getElevationMode(): ElevationMode;
  setElevationMode(elevationMode: ElevationMode): this;
}

export type Polyline = PolylineType;

export const Polyline: typeof PolylineType = L.Polyline.extend({
  options: {
    elevation: 0,
    elevationMode: ElevationModeType.HEIGHT_ABOVE_GROUND,
  },

  _projectLatlngs: function (this: Polyline, latlngs: L.LatLng[], result: unknown, projectedBounds: L.LatLngBounds[]) {
    if (!this._map._projectLatlngs(this, latlngs, result, projectedBounds)) {
      // @ts-ignore we don't have a type definition for this
      L.Polyline.prototype._projectLatlngs.call(this, latlngs, result, projectedBounds);
    }
  },

  /** Replaces all the points in the polyline with the given array of geographical points. */
  setLatLngs: function (
    this: Polyline,
    latlngs: L.LatLngExpression[] | L.LatLngExpression[][] | L.LatLngExpression[][][]
  ) {
    const redraw = L.Polyline.prototype.setLatLngs.call(this, latlngs);

    if (this._map) {
      this._map._createPointMapping(this);
    }

    return redraw;
  },

  addLatLng: function (this: Polyline, latlng: L.LatLngExpression | L.LatLngExpression[], latlngs?: L.LatLng[]) {
    const redraw = L.Polyline.prototype.addLatLng.call(this, latlng, latlngs);

    if (this._map) {
      this._map._createPointMapping(this);
    }

    return redraw;
  },

  getElevation: function (this: Polyline) {
    return this.options.elevation;
  },

  setElevation: function (this: Polyline, elevation: number) {
    this.options.elevation = elevation;

    if (this._map !== null) {
      this._map._createPointMapping(this);
    }

    return this;
  },

  setElevationMode: function (this: Polyline, mode: ElevationMode) {
    if (isValidElevationMode(mode)) {
      this.options.elevationMode = mode;

      if (this._map !== null) {
        this._map._createPointMapping(this);
      }
    }

    return this;
  },

  getElevationMode: function (this: Polyline) {
    return this.options.elevationMode;
  },
});

export const polyline = factoryFor(Polyline);
