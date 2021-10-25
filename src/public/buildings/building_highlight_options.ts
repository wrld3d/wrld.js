import L from "leaflet";
import { factoryFor } from "../../private/factoryFor";
import { ColorArray } from "../../types/color";
import { Vector4 } from "../space";

export enum BuildingHighlightSelectionType {
  SELECT_AT_LOCATION = "selectAtLocation",
  SELECT_AT_SCREEN_POINT = "selectAtScreenPoint",
}

export class BuildingHighlightOptions {
  private _selectionLocationLatLng: L.LatLng;
  private _selectionScreenPoint: L.Point;
  private _selectionMode: BuildingHighlightSelectionType;
  private _color: ColorArray;
  private _informationOnly: boolean;

  constructor() {
    this._selectionLocationLatLng = L.latLng([0.0, 0.0]);
    this._selectionScreenPoint = L.point(0.0, 0.0);
    this._selectionMode = BuildingHighlightSelectionType.SELECT_AT_LOCATION;
    this._color = [255, 255, 0, 128];
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

  getIsInformationOnly = (): boolean => {
    return this._informationOnly;
  };
}

export const buildingHighlightOptions = factoryFor(BuildingHighlightOptions);
