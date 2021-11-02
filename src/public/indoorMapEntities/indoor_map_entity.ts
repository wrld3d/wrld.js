import { MapFloorId } from "../map";
export class IndoorMapEntity {
  private _indoorMapEntityId: string;
  private _indoorMapFloorId: number;
  private _position: L.LatLng;
  private _outline: L.LatLngTuple[][];

  constructor(indoorMapEntityId: string, indoorMapFloorId: number, position: L.LatLng, outline: L.LatLngTuple[][]) {
    this._indoorMapEntityId = indoorMapEntityId;
    this._indoorMapFloorId = indoorMapFloorId;
    this._position = position;
    this._outline = outline;
  }

  getIndoorMapEntityId(): string {
    return this._indoorMapEntityId;
  }

  getIndoorMapFloorId(): MapFloorId {
    return this._indoorMapFloorId;
  }

  getPosition(): L.LatLng {
    return this._position;
  }

  getOutline(): L.LatLngTuple[][] {
    return this._outline;
  }
}
