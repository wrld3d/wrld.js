import type IndoorMapFloorOutlinePolygon from "./indoor_map_floor_outline_polygon";
import type { Map, MapId, MapFloorId } from "../map";
import { factoryFor } from "../../private/factoryFor";

export class IndoorMapFloorOutlineInformation {
  private _nativeId: string | null;
  private _map: Map | null;
  private _indoorMapId: MapId;
  private _indoorMapFloorId: number;
  private _outlinePolygons: IndoorMapFloorOutlinePolygon[];
  private _isLoaded: boolean;

  constructor(indoorMapId: MapId, indoorMapFloorId: MapFloorId) {
    this._nativeId = null;
    this._map = null;
    this._indoorMapId = indoorMapId;
    this._indoorMapFloorId = indoorMapFloorId;
    this._outlinePolygons = [];
    this._isLoaded = false;
  }

  getIndoorMapId(): MapId {
    return this._indoorMapId;
  }

  getIndoorMapFloorId(): MapFloorId {
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

export const indoorMapFloorOutlineInformation = factoryFor(IndoorMapFloorOutlineInformation);
