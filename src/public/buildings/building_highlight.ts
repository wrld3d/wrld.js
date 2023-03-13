import { factoryFor } from "../../private/factoryFor";
import { Vector4 } from "../space";
import { BuildingHighlightOptions, HeightRange, HeightRangeExpression } from "./building_highlight_options";
import type { BuildingInformation } from "./building_information";
import type Map from "../map";
import { ColorArray } from "../../types/color";

export class BuildingHighlight {
  private _options: BuildingHighlightOptions;
  private _id: number | null;
  private _map: Map | null;
  private _color: Vector4;
  private _heightRanges: HeightRange[];
  private _buildingInformation: BuildingInformation | null;

  constructor(options: BuildingHighlightOptions) {
    this._options = options;
    this._id = null;
    this._map = null;
    this._color = options.getColor();
    this._heightRanges = options.getHeightRanges();
    this._buildingInformation = null;
  }

  getColor = (): Vector4 => new Vector4(this._color);

  getHeightRanges = (): HeightRange[] => {
    const copy: HeightRange[] = [];
    this._heightRanges.forEach(heightRange => copy.push(new HeightRange(heightRange)));
    return copy;
  }

  getOptions = (): BuildingHighlightOptions => this._options;

  setColor = (color: ColorArray | Vector4): this => {
    this._color = new Vector4(color as Vector4); // Both types work individually, not sure why the union is not accepted 🤷🏻‍♂️
    if (this._map !== null) {
      this._map.buildings._getImpl().notifyBuildingHighlightChanged(this);
    }
    return this;
  };

  setHeightRanges = (heightRanges: HeightRangeExpression[]): this => {
    this._heightRanges = [];
    heightRanges.forEach(heightRange => this._heightRanges.push(new HeightRange(heightRange)));
    if (this._map !== null) {
      this._map.buildings._getImpl().notifyBuildingHighlightChanged(this);
    }
    return this;
  }

  getId = (): number | null => this._id;

  addTo = (map: Map): this => {
    if (this._map !== null) {
      this.remove();
    }
    this._map = map;
    this._map.buildings._getImpl().addBuildingHighlight(this);
    return this;
  };

  remove = (): this => {
    if (this._map !== null) {
      this._map.buildings._getImpl().removeBuildingHighlight(this);
      this._map = null;
    }
    return this;
  };

  getBuildingInformation = (): BuildingInformation | null => this._buildingInformation;

  /** @internal */
  _setNativeHandle = (nativeId: number | null): void => {
    this._id = nativeId;
  };

  /** @internal */
  _setBuildingInformation = (buildingInformation: BuildingInformation): void => {
    this._buildingInformation = buildingInformation;
  };
}

export const buildingHighlight = factoryFor(BuildingHighlight);
