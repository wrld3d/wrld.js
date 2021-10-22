export class IndoorMapEntrance {
  private _indoorMapId: string;
  private _indoorMapName: string;
  private _latLng: L.LatLng;

  constructor(indoorMapId: string, indoorMapName: string, latLng: L.LatLng) {
    this._indoorMapId = indoorMapId;
    this._indoorMapName = indoorMapName;
    this._latLng = latLng;
  }

  getIndoorMapId(): string {
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
