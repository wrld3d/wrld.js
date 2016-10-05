var IndoorMap = function(indoorMapId, indoorMapName, indoorMapSourceVendor, floorCount, floors, exitFunc) {

	var _indoorMapId = indoorMapId;
	var _indoorMapName = indoorMapName;
    var _floorCount = floorCount;
    var _floors = floors;
  var _indoorMapSourceVendor = indoorMapSourceVendor;

	this.exit = exitFunc;

	this.getIndoorMapId = function() {
		return _indoorMapId;
	};

	this.getIndoorMapName = function() {
		return _indoorMapName;
	};

  this.getIndoorMapSourceVendor = function() {
    return _indoorMapSourceVendor;
  };  

    this.getFloorCount = function() {
        return _floorCount;
    };

    this.getFloors = function() {
        return _floors;
    };
};

module.exports = IndoorMap;