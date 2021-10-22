import { constructorFor } from "../private/constructorFor";
import elevationMode, { ElevationMode } from "../types/elevationMode";

export class IndoorMapEntitySetProp {
  private _indoorMapId: string;
  private _floorId: number;
  private _name: string;
  private _geometryId: string;
  private _location: L.LatLng;
  private _elevation: number;
  private _elevationMode: elevationMode;
  private _headingDegrees: number;

  constructor(
    indoorMapId: string,
    floorId: number,
    name: string,
    geometryId: string,
    location: L.LatLng,
    elevation: number,
    elevationMode: ElevationMode,
    headingDegrees: number
  ) {
    this._indoorMapId = indoorMapId;
    this._floorId = floorId;
    this._name = name;
    this._geometryId = geometryId;
    this._location = location;
    this._elevation = elevation;
    this._elevationMode = elevationMode;
    this._headingDegrees = headingDegrees;
  }

  getIndoorMapId(): string {
    return this._indoorMapId;
  }

  getIndoorMapFloorId(): number {
    return this._floorId;
  }

  getName(): string {
    return this._name;
  }

  getGeometryId(): string {
    return this._geometryId;
  }

  getLocation(): import("/home/vittorio/projects/wrld/wrld-js-development/wrld.js/src/wrld").LatLng {
    return this._location;
  }

  getElevation(): number {
    return this._elevation;
  }

  getElevationMode(): elevationMode {
    return this._elevationMode;
  }

  getHeadingDegrees(): number {
    return this._headingDegrees;
  }
}

export const indoorMapEntitySetProp = constructorFor(IndoorMapEntitySetProp);
