import IndoorMapFloor from "./indoor_map_floor";
import type { MapId } from "../map";

export type SearchTag = {
  name: string;
  search_tag: string;
  icon_key: string;
};

export class IndoorMap {
  private _indoorMapId: MapId;
  private _indoorMapName: string;
  private _indoorMapSourceVendor: string;
  private _floorCount: number;
  private _floors: IndoorMapFloor[];
  private _searchTags: SearchTag[];
  public exit: () => void;

  constructor(
    indoorMapId: MapId,
    indoorMapName: string,
    indoorMapSourceVendor: string,
    floorCount: number,
    floors: IndoorMapFloor[],
    searchTags: SearchTag[],
    exitFunc: () => void
  ) {
    this._indoorMapId = indoorMapId;
    this._indoorMapName = indoorMapName;
    this._indoorMapSourceVendor = indoorMapSourceVendor;
    this._floorCount = floorCount;
    this._floors = floors;
    this._searchTags = searchTags;
    this.exit = exitFunc;
  }

  getIndoorMapId(): MapId {
    return this._indoorMapId;
  }

  getIndoorMapName(): string {
    return this._indoorMapName;
  }

  getIndoorMapSourceVendor(): string {
    return this._indoorMapSourceVendor;
  }

  getFloorCount(): number {
    return this._floorCount;
  }

  getFloors(): IndoorMapFloor[] {
    return this._floors;
  }

  getSearchTags(): SearchTag[] {
    return this._searchTags;
  }
}

export default IndoorMap;
