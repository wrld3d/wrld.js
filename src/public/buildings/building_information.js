export function BuildingInformation(
  buildingId,
  buildingDimensions,
  buildingContours
) {
  var _buildingId = buildingId;
  var _buildingDimensions = buildingDimensions;
  var _buildingContours = buildingContours;

  this.getBuildingId = () => _buildingId;

  this.getBuildingDimensions = () => _buildingDimensions;

  this.getBuildingContours = () => _buildingContours;

  this.toJson = () => ({
    building_id: _buildingId,
    building_dimensions: _buildingDimensions.toJson(),
    building_contours: _buildingContours.map((_x) => _x.toJson()),
  });
}
