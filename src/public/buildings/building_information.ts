import type { BuildingContour } from "./building_contour";
import type { BuildingDimensions } from "./building_dimensions";

export class BuildingInformation {
  private _buildingId: string;
  private _buildingDimensions: BuildingDimensions;
  private _buildingContours: BuildingContour[];

  constructor(buildingId: string, buildingDimensions: BuildingDimensions, buildingContours: BuildingContour[]) {
    this._buildingId = buildingId;
    this._buildingDimensions = buildingDimensions;
    this._buildingContours = buildingContours;
  }

  getBuildingId = (): string => this._buildingId;

  getBuildingDimensions = (): BuildingDimensions => this._buildingDimensions;

  getBuildingContours = (): BuildingContour[] => this._buildingContours;

  toJson = (): {
    building_id: string;
    building_dimensions: ReturnType<BuildingDimensions["toJson"]>;
    building_contours: ReturnType<BuildingContour["toJson"]>[];
  } => ({
    building_id: this._buildingId,
    building_dimensions: this._buildingDimensions.toJson(),
    building_contours: this._buildingContours.map((_x) => _x.toJson()),
  });
}
