var IndoorMapEntity = function(indoorMapEntityId, indoorMapFloorId, position, outlines) {
    var _indoorMapEntityId = indoorMapEntityId;
    var _indoorMapFloorId = indoorMapFloorId;
    var _position = position;
    var _outlines = outlines;

    this.getIndoorMapEntityId = function() {
        return _indoorMapEntityId;
    };

    this.getIndoorMapFloorId = function() {
        return _indoorMapFloorId;
    };

    this.getPosition = function() {
        return _position;
    };

    this.getOutlines = function(){
        return _outlines;
    };

    this.hasOutlines = function(){
        return (_outlines.length > 0);
    };
};

module.exports = IndoorMapEntity;