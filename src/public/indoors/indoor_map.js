export function IndoorMap(indoorMapId, indoorMapName, indoorMapSourceVendor, floorCount, floors, searchTags, exitFunc) {
	var _indoorMapId = indoorMapId;
	var _indoorMapName = indoorMapName;
  var _indoorMapSourceVendor = indoorMapSourceVendor;
  var _floorCount = floorCount;
  var _floors = floors;
	var _searchTags = searchTags;

	this.exit = exitFunc;

	this.getIndoorMapId = () => _indoorMapId;

	this.getIndoorMapName = () => _indoorMapName;

  this.getIndoorMapSourceVendor = () => _indoorMapSourceVendor;  

  this.getFloorCount = () => _floorCount;

  this.getFloors = () => _floors;

	this.getSearchTags = () => _searchTags;
}

export default IndoorMap;
