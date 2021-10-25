import { factoryFor } from "../../private/factoryFor";
import type Map from "../map";
import { MapId } from "../map";
import type { IndoorMapEntity } from "./indoor_map_entity";

enum IndoorMapEntityInformationLoadStateType {
  NONE = "None",
  PARTIAL = "Partial",
  COMPLETE = "Complete",
}

export class IndoorMapEntityInformation {
  private _nativeId: number | null;
  private _map: Map | null;
  private _indoorMapId: MapId;
  private _indoorMapEntities: IndoorMapEntity[];
  private _loadState: IndoorMapEntityInformationLoadStateType;

  constructor(indoorMapId: MapId) {
    this._nativeId = null;
    this._map = null;
    this._indoorMapId = indoorMapId;
    this._indoorMapEntities = [];
    this._loadState = IndoorMapEntityInformationLoadStateType.NONE;
  }

  getIndoorMapId = (): string => this._indoorMapId;

  getIndoorMapEntities = (): IndoorMapEntity[] => this._indoorMapEntities;

  getLoadState = (): IndoorMapEntityInformationLoadStateType => this._loadState;

  /**
   * Returns the auto-incrementing unique id of this IndoorMapEntityInformation object.
   */
  getId = (): number | null => this._nativeId;

  /**
   * Returns the auto-incrementing unique id of this IndoorMapEntityInformation object.
   * @deprecated use {@link IndoorMapEntityInformation.getId}
   * @returns {number}
   */
  getNativeId = (): number | null => this._nativeId;

  addTo = (map: Map): this => {
    if (this._map !== null) {
      this.remove();
    }
    this._map = map;
    this._map.indoorMapEntities._getImpl().addIndoorMapEntityInformation(this);
    return this;
  };

  remove = (): this => {
    if (this._map !== null) {
      this._map.indoorMapEntities._getImpl().removeIndoorMapEntityInformation(this);
      this._map = null;
    }
    return this;
  };

  /** @internal */
  _setNativeHandle = (nativeId: number): void => {
    this._nativeId = nativeId;
  };

  /** @internal */
  _setData = (data: { IndoorMapEntities: IndoorMapEntity[]; LoadState: 0 | 1 | 2 }): void => {
    this._indoorMapEntities = data.IndoorMapEntities;

    switch (data.LoadState) {
      case 0:
        this._loadState = IndoorMapEntityInformationLoadStateType.NONE;
        break;
      case 1:
        this._loadState = IndoorMapEntityInformationLoadStateType.PARTIAL;
        break;
      case 2:
        this._loadState = IndoorMapEntityInformationLoadStateType.COMPLETE;
        break;
    }
  };
}

export const indoorMapEntityInformation = factoryFor(IndoorMapEntityInformation);
