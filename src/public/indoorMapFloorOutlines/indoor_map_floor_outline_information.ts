import type IndoorMapFloorOutlinePolygon from "./indoor_map_floor_outline_polygon";
import type Map from "../map";
import { constructorFor } from "../../private/constructorFor";

export class IndoorMapFloorOutlineInformation {
  private _nativeId: string | null;
  private _map: Map | null;
  private _indoorMapId: string;
  private _indoorMapFloorId: number;
  private _outlinePolygons: IndoorMapFloorOutlinePolygon[];
  private _isLoaded: boolean;

  constructor(indoorMapId: string, indoorMapFloorId: number) {
    this._nativeId = null;
    this._map = null;
    this._indoorMapId = indoorMapId;
    this._indoorMapFloorId = indoorMapFloorId;
    this._outlinePolygons = [];
    this._isLoaded = false;
  }

  getIndoorMapId(): string {
    return this._indoorMapId;
  }

  getIndoorMapFloorId(): number {
    return this._indoorMapFloorId;
  }

  getIndoorMapFloorOutlinePolygons(): IndoorMapFloorOutlinePolygon[] {
    return this._outlinePolygons;
  }

  getIsLoaded(): boolean {
    return this._isLoaded;
  }

  getId(): string | null {
    return this._nativeId;
  }

  addTo(map: Map): this {
    if (this._map !== null) {
      this.remove();
    }
    this._map = map;
    this._map.indoorMapFloorOutlines._getImpl().addIndoorMapFloorOutlineInformation(this);
    return this;
  }

  remove = (): this => {
    if (this._map !== null) {
      this._map.indoorMapFloorOutlines._getImpl().removeIndoorMapFloorOutlineInformation(this);
      this._map = null;
    }
    return this;
  };

  /** @internal */
  _setNativeHandle = (nativeId: string): void => {
    this._nativeId = nativeId;
  };

  /** @internal */
  _setData = (data: IndoorMapFloorOutlinePolygon[]): void => {
    this._outlinePolygons = data;
    this._isLoaded = true;
  };
}

export const indoorMapFloorOutlineInformation = constructorFor(IndoorMapFloorOutlineInformation);
