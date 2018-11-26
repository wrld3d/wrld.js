var L = require("leaflet");

var Prop = function (config) {
    var _config = config;
    var _map = null;
    var _location = config["location"] || L.latLng([0.0, 0.0]);
    var _locationNeedsChanged = false;
    var _name = config["name"] || "";
    var _indoorMapId = config["indoorMapId"] || "";
    var _indoorMapFloorId = config["indoorMapFloorId"] || 0;
    var _headingDegrees = config["headingDegrees"] || 0.0;
    var _headingDegreesNeedsChanged = false;
    var _heightOffset = config["heightOffset"] || 0.0;
    var _heightOffsetNeedsChanged = false;
    var _geometryId = config["geometryId"] || "";
    var _geometryIdNeedsChanged = false;

    this.getLocation = function() {
        return _location;
    };

    this.setLocation = function (location) {
        _location = location;
        _locationNeedsChanged = true;
    };

    this.getIndoorMapId = function () {
        return _indoorMapId;
    };

    this.getIndoorMapFloorId = function () {
        return _indoorMapFloorId;
    };

    this.getHeadingDegrees = function () {
        return _headingDegrees;
    };

    this.setHeadingDegrees = function (headingDegrees) {
        _headingDegrees = headingDegrees;
        _headingDegreesNeedsChanged = true;
    };

    this.getHeightOffset = function () {
        return _heightOffset;
    };

    this.setHeightOffset = function (heightOffset) {
        _heightOffset = heightOffset;
        _heightOffsetNeedsChanged = true;
    };

    this.getGeometryId = function () {
        return _geometryId;
    };

    this.setGeometryId = function (geometryId) {
        _geometryId = geometryId;
        _geometryIdNeedsChanged = true;
    };

    this.getName = function () {
        return _name;
    };

    this._geometryIdNeedsChanged = function () {
        return _geometryIdNeedsChanged;
    };

    this._onGeometryIdChanged = function () {
        _geometryIdNeedsChanged = false;
    };

    this._heightOffsetNeedsChanged = function () {
        return _heightOffsetNeedsChanged;
    };

    this._onHeightOffsetChanged = function () {
        _heightOffsetNeedsChanged = false;
    };

    this._headingDegreesNeedsChanged = function () {
        return _headingDegreesNeedsChanged;
    };

    this._onHeadingDegreesChanged = function () {
        _headingDegreesNeedsChanged = false;
    };

    this._locationNeedsChanged = function () {
        return _locationNeedsChanged;
    };

    this._onLocationChanged = function () {
        _locationNeedsChanged = false;
    };

    this.addTo = function(map) {
        if (_map !== null) {
            this.remove();
        }
        _map = map;
        map._propModule.addProp(this);
        return this;
    };
	
    this.remove = function() {
        if (_map !== null) {
            _map._propModule.removeProp(this);
            _map = null;
        }
        return this;
    };

  this._getConfig = function() {
    return _config;
  };
};

var prop = function(config) {
    return new Prop(config || {});
};

module.exports = {
    Prop: Prop,
    prop: prop
};