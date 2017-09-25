var BuildingDimensions = function(
    baseAltitude,
    topAltitude,
    centroid
    ) {
    var _baseAltitude = baseAltitude;
    var _topAltitude = topAltitude;
    var _centroid = centroid;

    this.getBaseAltitude = function() {
        return _baseAltitude;
    };

    this.getTopAltitude = function() {
        return _topAltitude;
    };

    this.getCentroid = function() {
        return _centroid;
    };

    this.toJson = function() {
        return {
            base_altitude: _baseAltitude,
            top_altitude: _topAltitude,
            centroid: _centroid
        };
    };

};

module.exports = BuildingDimensions;

