import L from "leaflet";
import { factoryFor } from "../../private/factoryFor";
import { ColorArray } from "../../types/color";
import { Vector4 } from "../space";

export enum BuildingHighlightSelectionType {
  SELECT_AT_LOCATION = "selectAtLocation",
  SELECT_AT_SCREEN_POINT = "selectAtScreenPoint",
}

export class HeightRange {
  bottom: number;
  top: number;

  constructor();
  constructor(bottom: number, top: number);
  constructor(range: number[]);
  constructor(heightRange: HeightRange);
  constructor(heightRange: HeightRangeExpression);
  constructor(bottomOrRange?: number | HeightRangeExpression, top?: number)
  {
    if (typeof bottomOrRange === "undefined") {
      this.bottom = Number.NEGATIVE_INFINITY;
      this.top = Number.POSITIVE_INFINITY;
    } else if (bottomOrRange instanceof HeightRange) {
      this.bottom = bottomOrRange.bottom;
      this.top = bottomOrRange.top;
    } else if (bottomOrRange instanceof Array) {
      this.bottom = bottomOrRange[0];
      this.top = bottomOrRange[1];
    } else if (typeof top !== "undefined") {
      this.bottom = bottomOrRange;
      this.top = top;
    } else {
      throw Error("Unexpected types passed to HeightRange constructor");
    }
  }
}

export type HeightRangeExpression = HeightRange | number[];

export class BuildingHighlightOptions {
  private _selectionLocationLatLng: L.LatLng;
  private _selectionScreenPoint: L.Point;
  private _selectionMode: BuildingHighlightSelectionType;
  private _color: ColorArray;
  private _heightRanges: HeightRange[];
  private _informationOnly: boolean;

  constructor() {
    this._selectionLocationLatLng = L.latLng([0.0, 0.0]);
    this._selectionScreenPoint = L.point(0.0, 0.0);
    this._selectionMode = BuildingHighlightSelectionType.SELECT_AT_LOCATION;
    this._color = [255, 255, 0, 128];
    this._heightRanges = [new HeightRange()];
    this._informationOnly = false;
  }

  highlightBuildingAtLocation = (latLng: L.LatLng): this => {
    this._selectionMode = BuildingHighlightSelectionType.SELECT_AT_LOCATION;
    this._selectionLocationLatLng = L.latLng(latLng);
    return this;
  };

  highlightBuildingAtScreenPoint = (screenPoint: L.Point): this => {
    this._selectionMode = BuildingHighlightSelectionType.SELECT_AT_SCREEN_POINT;
    this._selectionScreenPoint = L.point(screenPoint);
    return this;
  };

  color = (color: ColorArray): this => {
    this._color = color;
    return this;
  };

  heightRanges = (heightRanges: HeightRangeExpression[]): this => {
    this._heightRanges = [];
    heightRanges.forEach((heightRange) => {
      if (heightRange instanceof HeightRange) {
        this._heightRanges.push(heightRange);
      } else {
        this._heightRanges.push(new HeightRange(heightRange));
      }
    });
    return this;
  }

  informationOnly = (): this => {
    this._informationOnly = true;
    return this;
  };

  getSelectionMode = (): BuildingHighlightSelectionType => {
    return this._selectionMode;
  };

  getSelectionLocation = (): L.LatLng => {
    return this._selectionLocationLatLng;
  };

  getSelectionScreenPoint = (): L.Point => {
    return this._selectionScreenPoint;
  };

  getColor = (): Vector4 => {
    return new Vector4(this._color);
  };

  getHeightRanges = (): HeightRange[] => {
    const copy:HeightRange[] = [];
    this._heightRanges.forEach(heightRange => copy.push(new HeightRange(heightRange)));
    return copy;
  }

  getIsInformationOnly = (): boolean => {
    return this._informationOnly;
  };
}

export const buildingHighlightOptions = factoryFor(BuildingHighlightOptions);
