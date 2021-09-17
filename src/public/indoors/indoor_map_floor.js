export function IndoorMapFloor (floorId, floorIndex, floorName, floorShortName) {
    var _floorId = floorId;
    var _floorIndex = floorIndex;
    var _floorName = floorName;
    var _floorShortName = floorShortName;

    /**
     * Note: this is for compatibility with the existing API – the short name was exposed as id. The actual id property in the submission json is not accessible through this API.
     *
     * @deprecated use {@link IndoorMapFloor.getFloorShortName} instead.
     * @returns {string} the short name of the floor.
     */
    this.getFloorId = () => _floorShortName;

    /**
     * Note: this is for compatibility with the existing API. The actual id property in the submission json is not accessible through this API.
     * 
     * @deprecated use {@link IndoorMapFloor.getFloorZOrder}
     * @returns {number} the z_order of the floor, as defined in the json submission.
     */
    this._getFloorId = () => _floorId;

    /**
     * @returns {number} the z_order of the floor, as defined in the json submission.
     */
    this.getFloorZOrder = () => _floorId;

    /**
     * @returns {number} the index of this floor in the array.
     */
    this.getFloorIndex = () => _floorIndex;

    this.getFloorName = () => _floorName;

    this.getFloorShortName = () => _floorShortName;
}

export default IndoorMapFloor;