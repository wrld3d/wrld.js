var IndoorMapFloor = function (floorId, floorIndex, floorName, floorShortName) {
    var _floorId = floorId;
    var _floorIndex = floorIndex;
    var _floorName = floorName;
    var _floorShortName = floorShortName;

    /**
     * Returns the short name of the floor.
     *
     * Retain compat with existing API – id was exposed as short name,
     * whereas it should really be the floorId (a.k.a. z_order).
     *
     * @deprecated use {@link IndoorMapFloor#getFloorShortName} instead.
     */
    this.getFloorId = function () {
        return _floorShortName;
    };

    /**
     * Returns the floor id, which matches the z_order in the json submission.
     * 
     *  @deprecated use {@link IndoorMapFloor#getFloorZOrder} 
     */
    this._getFloorId = function () {
        return _floorId;
    };

    /**
     * Returns the floor id, which matches with the z_order in the json submission.
     */
    this.getFloorZOrder = function () {
        return _floorId;
    };

    /**
     * Returns the index of the floor array.
     */
    this.getFloorIndex = function () {
        return _floorIndex;
    };

    this.getFloorName = function () {
        return _floorName;
    };

    this.getFloorShortName = function () {
        return _floorShortName;
    };
};

module.exports = IndoorMapFloor;
