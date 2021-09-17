export function IndoorMapEntitySetProp (
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
    
    this.getIndoorMapId = () => _indoorMapId;
    
    this.getIndoorMapFloorId = () => _floorId;
    
    this.getName = () => _name;
    
    this.getGeometryId = () => _geometryId;
    
    this.getLocation = () => _location;
    
    this.getElevation = () => _elevation;
    
    this.getElevationMode = () => _elevationMode;
    
    this.getHeadingDegrees = () => _headingDegrees;
}

export const indoorMapEntitySetProp = (
  indoorMapId,
  floorId,
  name,
  geometryId,
  location,
  elevation,
  elevationMode,
  headingDegrees
) =>
  new IndoorMapEntitySetProp(
    indoorMapId,
    floorId,
    name,
    geometryId,
    location,
    elevation,
    elevationMode,
    headingDegrees
  );

