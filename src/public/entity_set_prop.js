var IndoorMapEntitySetProp = function(
        indoorMapId,
        floorId,
        name,
        geometryId,
        location,
        elevation,
        elevationMode,
        headingDegrees) 
    {
    
    var _indoorMapId = indoorMapId;
    var _floorId = floorId;
    var _name = name;
    var _geometryId = geometryId;
    var _location = location;
    var _elevation = elevation;
    var _elevationMode = elevationMode;
    var _headingDegrees = headingDegrees;
    
    this.getIndoorMapId = function() {
        return _indoorMapId;
    };
    
    this.getIndoorMapFloorId = function() {
        return _floorId;
    };
    
    this.getName = function() {
        return _name;
    };
    
    this.getGeometryId = function() {
        return _geometryId;
    };
    
    this.getLocation = function() {
        return _location;
    };
    
    this.getElevation = function() {
        return _elevation;
    };
    
    this.getElevationMode = function() {
        return _elevationMode;
    };
    
    this.getHeadingDegrees = function() {
        return _headingDegrees;
    };
};

var indoorMapEntitySetProp = function(indoorMapId,
                                      floorId,
                                      name,
                                      geometryId,
                                      location,
                                      elevation,
                                      elevationMode,
                                      headingDegrees) {

    return new IndoorMapEntitySetProp(indoorMapId,
                                      floorId,
                                      name,
                                      geometryId,
                                      location,
                                      elevation,
                                      elevationMode,
                                      headingDegrees);
};

module.exports = {
    IndoorMapEntitySetProp: IndoorMapEntitySetProp,
    indoorMapEntitySetProp: indoorMapEntitySetProp
};