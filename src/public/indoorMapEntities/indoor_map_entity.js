var IndoorMapEntity = function(indoorMapEntityId, indoorMapFloorId, position) {
    var _indoorMapEntityId = indoorMapEntityId;
    var _indoorMapFloorId = indoorMapFloorId;
    var _position = position;

    this.getIndoorMapEntityId = function() {
        return _indoorMapEntityId;
    };

    this.getIndoorMapFloorId = function() {
        return _indoorMapFloorId;
    };

    this.getPosition = function() {
        return _position;
    };

};

module.exports = IndoorMapEntity;