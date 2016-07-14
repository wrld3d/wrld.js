var IndoorMapFloor = function(floorId, floorIndex, floorName, floorNumber) {

    var _floorId = floorId;
    var _floorIndex = floorIndex;
    var _floorName = floorName;
    var _floorNumber = floorNumber;

    this.getFloorId = function() {
        return _floorId;
    };

    this.getFloorIndex = function() {
        return _floorIndex;
    };

    this.getFloorName = function() {
        return _floorName;
    };

    this.getFloorNumber = function() {
        return _floorNumber;
    };

};

module.exports = IndoorMapFloor;