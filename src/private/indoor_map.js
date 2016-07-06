var IndoorMap = function(indoorMapId, indoorMapName, floorCount, exitFunc) {

	var _indoorMapId = indoorMapId;
	var _indoorMapName = indoorMapName;
    var _floorCount = floorCount;

	this.exit = exitFunc;

	this.getIndoorMapId = function() {
		return _indoorMapId;
	};

	this.getIndoorMapName = function() {
		return _indoorMapName;
	};

    this.getFloorCount = function() {
        return _floorCount;
    };
};

module.exports = IndoorMap;