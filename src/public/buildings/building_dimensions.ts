export class BuildingDimensions {
  private _baseAltitude: number;
  private _topAltitude: number;
  private _centroid: L.LatLng;

  constructor(baseAltitude: number, topAltitude: number, centroid: L.LatLng) {
    this._baseAltitude = baseAltitude;
    this._topAltitude = topAltitude;
    this._centroid = centroid;
  }

  getBaseAltitude = (): number => this._baseAltitude;

  getTopAltitude = (): number => this._topAltitude;

  getCentroid = (): L.LatLng => this._centroid;

  toJson = (): { base_altitude: number; top_altitude: number; centroid: L.LatLng } => ({
    base_altitude: this._baseAltitude,
    top_altitude: this._topAltitude,
    centroid: this._centroid,
  });
}
