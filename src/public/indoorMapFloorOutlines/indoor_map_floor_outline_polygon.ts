import type IndoorMapFloorOutlinePolygonRing from "./indoor_map_floor_outline_polygon_ring";

export class IndoorMapFloorOutlinePolygon {
  private _outerRing: IndoorMapFloorOutlinePolygonRing;
  private _innerRings: IndoorMapFloorOutlinePolygonRing[];

  constructor(outerRing: IndoorMapFloorOutlinePolygonRing, innerRings: IndoorMapFloorOutlinePolygonRing[]) {
    this._outerRing = outerRing;
    this._innerRings = innerRings;
  }

  getOuterRing(): IndoorMapFloorOutlinePolygonRing {
    return this._outerRing;
  }
  getInnerRings(): IndoorMapFloorOutlinePolygonRing[] {
    return this._innerRings;
  }
}

export default IndoorMapFloorOutlinePolygon;
