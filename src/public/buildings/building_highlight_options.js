var space = require("../space");

var BuildingHighlightSelectionType = {
    SELECT_AT_LOCATION: "selectAtLocation",
    SELECT_AT_SCEEN_POINT: "selectAtScreenPoint"
};


var BuildingHighlightOptions = function() {


    var _selectionLocationLatLng = L.latLng([0.0, 0.0]);
    var _selectionScreenPoint = L.Point(0.0, 0.0);
    var _selectionMode = "selectAtLocation";
    var _color = [255, 255, 0, 128];
    var _informationOnly = false;

    this.highlightBuildingAtLocation = function(latLng) {
        _selectionMode = BuildingHighlightSelectionType.SELECT_AT_LOCATION;
        _selectionLocationLatLng = L.latLng(latLng);
        return this;
    };

    this.highlightBuildingAtScreenPoint = function(screenPoint) {
        _selectionMode = BuildingHighlightSelectionType.SELECT_AT_SCREEN_POINT;
        _selectionScreenPoint = L.point(screenPoint);
        return this;
    };

    this.color = function(color) {
        _color = color;
        return this;
    };

    this.informationOnly = function() {
        _informationOnly = true;
        return this;
    };

    this.getSelectionMode = function() {
        return _selectionMode;
    };

    this.getSelectionLocation = function() {
        return _selectionLocationLatLng;
    };

    this.getSelectionScreenPoint = function() {
        return _selectionScreenPoint;
    };

    this.getColor = function() {
        return new space.Vector4(_color);
    };

    this.getIsInformationOnly = function() {
        return _informationOnly;
    };

};

var buildingHighlightOptions = function() {
    return new BuildingHighlightOptions();
};

module.exports = {
    BuildingHighlightOptions: BuildingHighlightOptions,
    buildingHighlightOptions: buildingHighlightOptions,
    BuildingHighlightSelectionType: BuildingHighlightSelectionType
};

