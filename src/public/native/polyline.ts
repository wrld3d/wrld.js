import L from "leaflet";
import { factoryFor } from "../../private/factoryFor";
import { ElevationModeType, isValidElevationMode } from "../../private/elevation_mode";
import { Color } from "../../types/color";
import { ElevationMode } from "../../types/elevationMode";
import { MapId, MapFloorId } from "../map";
import { WrldOptions } from "../../types/wrldOptions";

export type PolylineOptions = WrldOptions & {
  color?: Color;
  weight?: number;
  miterLimit?: number;
};

export declare class PolylineType extends L.Polyline {
  constructor(latlngs: L.LatLngExpression[], options?: PolylineOptions);
  getPoints(): L.LatLng[];
  getIndoorMapId(): MapId;
  getIndoorMapFloorId(): MapFloorId;
  setIndoorMapWithFloorId(indoorMapId: MapId, indoorMapFloorId: MapFloorId): this;
  getElevation(): number;
  setElevation(elevation: number): this;
  getElevationMode(): ElevationMode;
  setElevationMode(elevationMode: ElevationMode): this;
  getWidth(): number;
  getColor(): Color;
  getMiterLimit(): number;
  setOptions(options: PolylineOptions): this;
  setStyle(options: PolylineOptions): this;
}

export type Polyline = PolylineType;

export const Polyline: typeof PolylineType = L.Polyline.extend({
  initialize: function (latLngs: L.LatLngExpression[], options?: PolylineOptions) {
    L.Polyline.prototype.initialize.call(this, latLngs, options || {});
  },

  options: {
    elevation: 0.0,
    elevationMode: ElevationModeType.HEIGHT_ABOVE_GROUND,
    indoorMapId: "",
    indoorMapFloorId: 0,
    weight: 3.0,
    miterLimit: 10.0,
  },

  getPoints: function () {
    return this.getLatLngs();
  },

  getIndoorMapId: function () {
    return this.options.indoorMapId;
  },

  getIndoorMapFloorId: function () {
    return this.options.indoorMapFloorId;
  },

  getElevation: function () {
    return this.options.elevation;
  },

  getElevationMode: function () {
    return this.options.elevationMode;
  },

  getWidth: function () {
    return this.options.weight;
  },

  getColor: function () {
    return this.options.color;
  },

  getMiterLimit: function () {
    return this.options.miterLimit;
  },

  setIndoorMapWithFloorId: function (indoorMapId: MapId, indoorMapFloorId: MapFloorId) {
    this.options.indoorMapId = indoorMapId;
    this.options.indoorMapFloorId = indoorMapFloorId;
    this._needsNativeUpdate = true;
    return this;
  },

  setElevation: function (elevation: ElevationMode) {
    this.options.elevation = elevation;
    this._needsNativeUpdate = true;
    return this;
  },

  setElevationMode: function (mode: ElevationMode) {
    if (isValidElevationMode(mode)) {
      this.options.elevationMode = mode;
    }
    this._needsNativeUpdate = true;
    return this;
  },

  setOptions: function (options: PolylineOptions) {
    return this.setStyle(options);
  },

  setStyle: function (style: L.PathOptions) {
    L.Polyline.prototype.setStyle.call(this, style);
    this._needsNativeUpdate = true;
    return this;
  },

  // dirty flag, for polyline_module use
  _needsNativeUpdate: false,

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _update: function () {},

  beforeAdd: function () {
    // don't call base, avoid assigning this._renderer
  },

  onAdd: function () {
    this._map._polylineModule.addPolyline(this);
  },

  onRemove: function () {
    this._map._polylineModule.removePolyline(this);
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  redraw: function () {},
});

export const polyline = factoryFor(Polyline);
