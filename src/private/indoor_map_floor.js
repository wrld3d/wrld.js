var IndoorMapFloor = function(floorId, floorName, floorNumber) {

    var _floorId = floorId;
    var _floorName = floorName;
    var _floorNumber = floorNumber;

    this.getFloorId = function() {
        return _floorId;
    };

    this.getFloorName = function() {
        return _floorName;
    };

    this.getFloorNumber = function() {
        return _floorNumber;
    };

};

module.exports = IndoorMapFloor;