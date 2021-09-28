import L from "leaflet";

import { Vector4 } from "../space";

export const BuildingHighlightSelectionType = {
    SELECT_AT_LOCATION: "selectAtLocation",
    SELECT_AT_SCREEN_POINT: "selectAtScreenPoint"
};

export function BuildingHighlightOptions () {
    var _selectionLocationLatLng = L.latLng([0.0, 0.0]);
    var _selectionScreenPoint = L.Point(0.0, 0.0);
    var _selectionMode = "selectAtLocation";
    var _color = [255, 255, 0, 128];
    var _informationOnly = false;

    this.highlightBuildingAtLocation = (latLng) => {
        _selectionMode = BuildingHighlightSelectionType.SELECT_AT_LOCATION;
        _selectionLocationLatLng = L.latLng(latLng);
        return this;
    };

    this.highlightBuildingAtScreenPoint = (screenPoint) => {
        _selectionMode = BuildingHighlightSelectionType.SELECT_AT_SCREEN_POINT;
        _selectionScreenPoint = L.point(screenPoint);
        return this;
    };

    this.color = (color) => {
        _color = color;
        return this;
    };

    this.informationOnly = () => {
        _informationOnly = true;
        return this;
    };

    this.getSelectionMode = () => {
        return _selectionMode;
    };

    this.getSelectionLocation = () => {
        return _selectionLocationLatLng;
    };

    this.getSelectionScreenPoint = () => {
        return _selectionScreenPoint;
    };

    this.getColor = () => {
        return new Vector4(_color);
    };

    this.getIsInformationOnly = () => {
        return _informationOnly;
    };
}

export const buildingHighlightOptions = () => new BuildingHighlightOptions();

