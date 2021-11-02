export class IndoorMapFloor {
  private _floorId: number;
  private _floorIndex: number;
  private _floorName: string;
  private _floorShortName: string;

  constructor(floorId: number, floorIndex: number, floorName: string, floorShortName: string) {
    this._floorId = floorId;
    this._floorIndex = floorIndex;
    this._floorName = floorName;
    this._floorShortName = floorShortName;
  }

  /**
   * Note: this is for compatibility with the existing API – the short name was exposed as id. The actual id property in the submission json is not accessible through this API.
   *
   * @deprecated use {@link IndoorMapFloor.getFloorShortName} instead.
   * @returns {string} the short name of the floor.
   */
  getFloorId(): string {
    return this._floorShortName;
  }

  /**
   * Note: this is for compatibility with the existing API. The actual id property in the submission json is not accessible through this API.
   *
   * @deprecated use {@link IndoorMapFloor.getFloorZOrder}
   * @returns {number} the z_order of the floor, as defined in the json submission.
   */
  _getFloorId(): number {
    return this._floorId;
  }

  /**
   * @returns {number} the z_order of the floor, as defined in the json submission.
   */
  getFloorZOrder(): number {
    return this._floorId;
  }

  /**
   * @returns {number} the index of this floor in the array.
   */
  getFloorIndex(): number {
    return this._floorIndex;
  }

  getFloorName(): string {
    return this._floorName;
  }

  getFloorShortName(): string {
    return this._floorShortName;
  }
}

export default IndoorMapFloor;
