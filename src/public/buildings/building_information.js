var BuildingInformation = function(
    buildingId,
    buildingDimensions,
    buildingContours
    ) {
    var _buildingId = buildingId;
    var _buildingDimensions = buildingDimensions;
    var _buildingContours = buildingContours;

    this.getBuildingId = function() {
        return _buildingId;
    };

    this.getBuildingDimensions = function() {
        return _buildingDimensions;
    };

    this.getBuildingContours = function() {
        return _buildingContours;
    };

    this.toJson = function() {
        return {
            building_id: _buildingId,
            building_dimensions: _buildingDimensions.toJson(),
            building_contours:_buildingContours.map(function(_x) { return _x.toJson();})
        };
    };

};

module.exports = BuildingInformation;

