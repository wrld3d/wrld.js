var IndoorMapFloor = function(floorId, floorIndex, floorName, floorShortName) {

    var _floorId = floorId;
    var _floorIndex = floorIndex;
    var _floorName = floorName;
    var _floorShortName = floorShortName;

    this.getFloorId = function() {
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