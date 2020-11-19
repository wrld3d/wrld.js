var elevationMode = require("../private/elevation_mode.js");

var Prop = function (name, geometryId, location, config) {
    var _map = null;
    var _name = name;
    var _geometryId = geometryId;
    var _geometryIdNeedsChanged = false;
    var _location = L.latLng(location);
    var _locationNeedsChanged = false;    
    var _indoorMapId = config["indoorMapId"] || "";
    var _indoorMapFloorId = config["indoorMapFloorId"] || 0;
    var _headingDegrees = config["headingDegrees"] || 0.0;
    var _headingDegreesNeedsChanged = false;
    var _elevation = config["elevation"] || 0.0;
    var _elevationNeedsChanged = false;
    var _elevationMode = config["elevationMode"] || elevationMode.ElevationModeType.HEIGHT_ABOVE_GROUND;
    var _elevationModeNeedsChanged = false;
    
    this.getLocation = function() {
        return _location;
    };

    this.setLocation = function (location) {
        _location = L.latLng(location);
        _locationNeedsChanged = true;
        return this;
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
        return this;
    };

    this.getElevation = function () {
        return _elevation;
    };

    this.setElevation = function (elevation) {
        _elevation = elevation;
        _elevationNeedsChanged = true;
        return this;
    };

    this.getElevationMode = function () {
        return _elevationMode;
    };

    this.setElevationMode = function (elevationModeString) {
        if (elevationMode.isValidElevationMode(elevationModeString)) {
            _elevationMode = elevationModeString;
            _elevationModeNeedsChanged = true;
        }
        return this;
    };

    this.getGeometryId = function () {
        return _geometryId;
    };

    this.setGeometryId = function (geometryId) {
        _geometryId = geometryId;
        _geometryIdNeedsChanged = true;
        return this;
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

    this._elevationNeedsChanged = function () {
        return _elevationNeedsChanged;
    };

    this._onElevationChanged = function () {
        _elevationNeedsChanged = false;
    };

    this._elevationModeNeedsChanged = function () {
        return _elevationModeNeedsChanged;
    };

    this._onElevationModeChanged = function () {
        _elevationModeNeedsChanged = false;
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
        map.props.addProp(this);
        return this;
    };
	
    this.remove = function() {
        if (_map !== null) {
            _map.props.removeProp(this);
            _map = null;
        }
        return this;
    };
};

var prop = function(name, geometryId, location, config) {
    return new Prop(name, geometryId, location, config || {});
};

module.exports = {
    Prop: Prop,
    prop: prop
};