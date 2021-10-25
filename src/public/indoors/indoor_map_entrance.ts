import type { MapId } from "../map";

export class IndoorMapEntrance {
  private _indoorMapId: MapId;
  private _indoorMapName: string;
  private _latLng: L.LatLng;

  constructor(indoorMapId: MapId, indoorMapName: string, latLng: L.LatLng) {
    this._indoorMapId = indoorMapId;
    this._indoorMapName = indoorMapName;
    this._latLng = latLng;
  }

  getIndoorMapId(): MapId {
    return this._indoorMapId;
  }

  getIndoorMapName(): string {
    return this._indoorMapName;
  }

  getLatLng(): L.LatLng {
    return this._latLng;
  }
}

export default IndoorMapEntrance;
