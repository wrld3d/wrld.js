var BuildingContour = function(
    bottomAltitude,
    topAltitude,
    points
    ) {
    var _bottomAltitude = bottomAltitude;
    var _topAltitude = topAltitude;
    var _points = points;

    this.getBottomAltitude = function() {
        return _bottomAltitude;
    };

    this.getTopAltitude = function() {
        return _topAltitude;
    };

    this.getPoints = function() {
        return _points;
    };

    this.toJson = function() {
        return {
            bottom_altitude: _bottomAltitude,
            top_altitude: _topAltitude,
            points: _points
        };
    };
};

module.exports = BuildingContour;

