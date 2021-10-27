import L from "leaflet";
import { factoryFor } from "../private/factoryFor";
import { ElevationModeType, isValidElevationMode } from "../private/elevation_mode";
import { ElevationMode } from "../types/elevationMode";
import { WrldOptions } from "../types/wrldOptions";

export type CircleOptions = L.CircleMarkerOptions & WrldOptions;

export declare class CircleType extends L.Circle {
  options: CircleOptions;
  constructor(latLng: L.LatLngExpression, options?: CircleOptions);
  getElevation(): number;
  setElevation(elevation: number): this;
  getElevationMode(): ElevationMode;
  setElevationMode(elevationMode: ElevationMode): this;
}

export type Circle = CircleType;

export const Circle: typeof CircleType = L.Circle.extend({
  options: {
    elevation: 0,
    elevationMode: ElevationModeType.HEIGHT_ABOVE_GROUND,
  },

  _project: function () {
    // Circles are defined as a single LatLng, and consequently won't scale correctly when indoor maps are expanded
    // (other prims like polygons 'just work', as all LatLngs are transformed on the C++ side).
    // To fix this, we'd need to adjust the calculations below to take into account a scale transform, or similar
    // (this is not currently exposed in the api).
    const latLng = this._map.latLngsForLayer(this)[0];
    const lat = latLng.lat;
    const lng = latLng.lng;
    const alt = latLng.alt || 0.0;

    const map = this._map,
      degToRad = Math.PI / 180,
      earthRadius = 6378100;

    const latR = this._mRadius / earthRadius / degToRad;
    const a = Math.sin(lat * degToRad);
    const b = Math.cos(lat * degToRad);
    let lngR = Math.acos((Math.cos(latR * degToRad) - a * a) / (b * b)) / degToRad;

    if (isNaN(lngR) || lngR === 0) {
      lngR = latR / Math.cos(lat * degToRad);
    }

    const heading = map.getCameraHeadingDegrees() * degToRad;
    const forwardLatLng = [lat + latR * Math.cos(heading), lng + lngR * Math.sin(heading), alt];
    const rightLatLng = [lat - latR * Math.sin(heading), lng + lngR * Math.cos(heading), alt];
    this._point = map.latLngToLayerPoint([lat, lng, alt]);
    this._radius = isNaN(lngR)
      ? 0
      : Math.max(Math.round(this._point.distanceTo(map.latLngToLayerPoint(rightLatLng))), 1);
    this._radiusY = Math.max(Math.round(this._point.distanceTo(map.latLngToLayerPoint(forwardLatLng))), 1);

    this._updateBounds();
  },

  getElevation: function () {
    return this.options.elevation;
  },

  setElevation: function (elevation: number) {
    this.options.elevation = elevation;

    if (this._map !== null) {
      this._map._createPointMapping(this);
    }

    return this;
  },

  setElevationMode: function (mode: ElevationMode) {
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

export const circle = factoryFor(Circle);
