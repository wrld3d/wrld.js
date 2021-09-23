export function BuildingDimensions(baseAltitude, topAltitude, centroid) {
  var _baseAltitude = baseAltitude;
  var _topAltitude = topAltitude;
  var _centroid = centroid;

  this.getBaseAltitude = () => _baseAltitude;

  this.getTopAltitude = () => _topAltitude;

  this.getCentroid = () => _centroid;

  this.toJson = () => ({
    base_altitude: _baseAltitude,
    top_altitude: _topAltitude,
    centroid: _centroid,
  });
}
