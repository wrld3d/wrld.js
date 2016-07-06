var IndoorMapEntrance = function(indoorMapId, indoorMapName, latLng) {

    var _indoorMapId = indoorMapId;
    var _indoorMapName = indoorMapName;
    var _latLng = latLng;

    this.getIndoorMapId = function() {
        return _indoorMapId;
    };

    this.getIndoorMapName = function() {
        return _indoorMapName;
    };

    this.getLatLng = function() {
        return _latLng;
    };
};

module.exports = IndoorMapEntrance;