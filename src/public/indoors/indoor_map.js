var IndoorMap = function(indoorMapId, indoorMapName, indoorMapSourceVendor, floorCount, floors, searchTags, exitFunc) {

	var _indoorMapId = indoorMapId;
	var _indoorMapName = indoorMapName;
  var _indoorMapSourceVendor = indoorMapSourceVendor;
  var _floorCount = floorCount;
  var _floors = floors;
	var _searchTags = searchTags;

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

	this.getSearchTags = function() {
		return _searchTags;
	};
};

module.exports = IndoorMap;