export function BuildingContour(bottomAltitude, topAltitude, points) {
  var _bottomAltitude = bottomAltitude;
  var _topAltitude = topAltitude;
  var _points = points;

  this.getBottomAltitude = () => _bottomAltitude;

  this.getTopAltitude = () => _topAltitude;

  this.getPoints = () => _points;

  this.toJson = () => ({
    bottom_altitude: _bottomAltitude,
    top_altitude: _topAltitude,
    points: _points,
  });
}
