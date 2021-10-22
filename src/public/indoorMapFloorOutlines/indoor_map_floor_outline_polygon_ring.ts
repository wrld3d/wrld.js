export class IndoorMapFloorOutlinePolygonRing {
  private _latLngPoints: L.LatLng[];

  constructor(latLngPoints: L.LatLng[]) {
    this._latLngPoints = latLngPoints;
  }

  getLatLngPoints(): L.LatLng[] {
    return this._latLngPoints;
  }
}

export default IndoorMapFloorOutlinePolygonRing;
