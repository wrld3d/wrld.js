import { factoryFor } from "../private/factoryFor";
import elevationMode, { ElevationMode } from "../types/elevationMode";
import type { MapId, MapFloorId } from "./map";

export class IndoorMapEntitySetProp {
  private _indoorMapId: MapId;
  private _floorId: MapFloorId;
  private _name: string;
  private _geometryId: string;
  private _location: L.LatLng;
  private _elevation: number;
  private _elevationMode: elevationMode;
  private _headingDegrees: number;

  constructor(
    indoorMapId: MapId,
    floorId: MapFloorId,
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

  getIndoorMapId(): MapId {
    return this._indoorMapId;
  }

  getIndoorMapFloorId(): MapFloorId {
    return this._floorId;
  }

  getName(): string {
    return this._name;
  }

  getGeometryId(): string {
    return this._geometryId;
  }

  getLocation(): L.LatLng {
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

export const indoorMapEntitySetProp = factoryFor(IndoorMapEntitySetProp);
