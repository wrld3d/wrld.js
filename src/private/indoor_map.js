var IndoorMap = function(indoorMapId, indoorMapName, exitFunc) {

	var _indoorMapId = indoorMapId;
	var _indoorMapName = indoorMapName;

	this.exit = exitFunc;

	this.getIndoorMapId = function() {
		return _indoorMapId;
	};

	this.getIndoorMapName = function() {
		return _indoorMapName;
	};
};

module.exports = IndoorMap;