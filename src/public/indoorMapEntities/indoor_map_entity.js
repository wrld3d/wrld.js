var IndoorMapEntity = function(indoorMapEntityId, indoorMapFloorId, position, outline) {
    var _indoorMapEntityId = indoorMapEntityId;
    var _indoorMapFloorId = indoorMapFloorId;
    var _position = position;
    var _outline = outline;

    this.getIndoorMapEntityId = function() {
        return _indoorMapEntityId;
    };

    this.getIndoorMapFloorId = function() {
        return _indoorMapFloorId;
    };

    this.getPosition = function() {
        return _position;
    };

    this.getOutline = function(){
        return _outline;
    };

};

module.exports = IndoorMapEntity;