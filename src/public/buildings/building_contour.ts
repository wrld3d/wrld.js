export class BuildingContour {
  private _bottomAltitude: number;
  private _topAltitude: number;
  private _points: L.LatLng[];

  constructor(bottomAltitude: number, topAltitude: number, points: L.LatLng[]) {
    this._bottomAltitude = bottomAltitude;
    this._topAltitude = topAltitude;
    this._points = points;
  }

  getBottomAltitude = (): number => this._bottomAltitude;

  getTopAltitude = (): number => this._topAltitude;

  getPoints = (): L.LatLng[] => this._points;

  toJson = (): { bottom_altitude: number; top_altitude: number; points: L.LatLng[] } => ({
    bottom_altitude: this._bottomAltitude,
    top_altitude: this._topAltitude,
    points: this._points,
  });
}
