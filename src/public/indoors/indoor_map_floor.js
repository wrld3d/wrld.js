var IndoorMapFloor = function(floorId, floorIndex, floorName, floorShortName) {
    var _floorId = floorId;
    var _floorIndex = floorIndex;
    var _floorName = floorName;
    var _floorShortName = floorShortName;

    this.getFloorId = function() {
        // retain compat with existing API -- id was exposed as short name
        // whereas it should really be the floorId (a.k.a. z_order)
        return _floorShortName;
    };
    
    this._getFloorId = function() {
        return _floorId;
    };

    this.getFloorIndex = function() {
        return _floorIndex;
    };

    this.getFloorName = function() {
        return _floorName;
    };

    this.getFloorShortName = function() {
        return _floorShortName;
    };

};

module.exports = IndoorMapFloor;