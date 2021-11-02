import L from "leaflet";
import { factoryFor } from "../private/factoryFor";
import { ElevationModeType, isValidElevationMode } from "../private/elevation_mode";

import { WrldOptions } from "../types/wrldOptions";
import { ElevationMode } from "../types/elevationMode";
import Map from "./map";

export type RectangleOptions = L.PolylineOptions & WrldOptions;

declare class RectangleType extends L.Rectangle {
  options: RectangleOptions;
  protected _map: Map;
  constructor(latLngBounds: L.LatLngBoundsExpression, options?: RectangleOptions);
  getElevation(): number;
  setElevation(elevation: number): this;
  getElevationMode(): ElevationMode;
  setElevationMode(elevationMode: ElevationMode): this;
}

export type Rectangle = RectangleType;

export const Rectangle: typeof RectangleType = L.Rectangle.extend({
  options: {
    elevation: 0,
    elevationMode: ElevationModeType.HEIGHT_ABOVE_GROUND,
  },

  _projectLatlngs: function (
    this: Rectangle,
    latlngs: L.LatLng[],
    result: undefined,
    projectedBounds: L.LatLngBounds[]
  ) {
    if (!this._map._projectLatlngs(this, latlngs, result, projectedBounds)) {
      // @ts-ignore we don't have a type definition for this
      L.Rectangle.prototype._projectLatlngs.call(this, latlngs, result, projectedBounds);
    }
  },

  // @method setLatLngs(latlngs: LatLng[]): this
  // Replaces all the points in the polyline with the given array of geographical points.
  setLatLngs: function (
    this: Rectangle,
    latlngs: L.LatLngExpression[] | L.LatLngExpression[][] | L.LatLngExpression[][][]
  ) {
    const redraw = L.Rectangle.prototype.setLatLngs.call(this, latlngs);

    if (this._map) {
      this._map._createPointMapping(this);
    }

    return redraw;
  },

  getElevation: function (this: Rectangle) {
    return this.options.elevation;
  },

  setElevation: function (this: Rectangle, elevation: number) {
    this.options.elevation = elevation;

    if (this._map !== null) {
      this._map._createPointMapping(this);
    }

    return this;
  },

  setElevationMode: function (this: Rectangle, mode: ElevationMode) {
    if (isValidElevationMode(mode)) {
      this.options.elevationMode = mode;

      if (this._map !== null) {
        this._map._createPointMapping(this);
      }
    }

    return this;
  },

  getElevationMode: function (this: Rectangle) {
    return this.options.elevationMode;
  },
});

export const rectangle = factoryFor(Rectangle);
