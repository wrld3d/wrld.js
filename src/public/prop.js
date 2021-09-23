import { ElevationModeType, isValidElevationMode } from "../private/elevation_mode.js";

export function Prop (name, geometryId, location, config) {
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
    var _elevationMode = config["elevationMode"] || ElevationModeType.HEIGHT_ABOVE_GROUND;
    var _elevationModeNeedsChanged = false;
    
    this.getLocation = () => _location;

    this.setLocation = (location) => {
        _location = L.latLng(location);
        _locationNeedsChanged = true;
        return this;
    };

    this.getIndoorMapId = () => _indoorMapId;

    this.getIndoorMapFloorId = () => _indoorMapFloorId;

    this.getHeadingDegrees = () => _headingDegrees;

    this.setHeadingDegrees = (headingDegrees) => {
        _headingDegrees = headingDegrees;
        _headingDegreesNeedsChanged = true;
        return this;
    };

    this.getElevation = () => _elevation;

    this.setElevation = (elevation) => {
        _elevation = elevation;
        _elevationNeedsChanged = true;
        return this;
    };

    this.getElevationMode = () => _elevationMode;

    this.setElevationMode = (elevationModeString) => {
        if (isValidElevationMode(elevationModeString)) {
            _elevationMode = elevationModeString;
            _elevationModeNeedsChanged = true;
        }
        return this;
    };

    this.getGeometryId = () => _geometryId;

    this.setGeometryId = (geometryId) => {
        _geometryId = geometryId;
        _geometryIdNeedsChanged = true;
        return this;
    };

    this.getName = () => _name;

    this._geometryIdNeedsChanged = () => _geometryIdNeedsChanged;

    this._onGeometryIdChanged = () => {
        _geometryIdNeedsChanged = false;
    };

    this._elevationNeedsChanged = () => _elevationNeedsChanged;

    this._onElevationChanged = () => {
        _elevationNeedsChanged = false;
    };

    this._elevationModeNeedsChanged = () => _elevationModeNeedsChanged;

    this._onElevationModeChanged = () => {
        _elevationModeNeedsChanged = false;
    };

    this._headingDegreesNeedsChanged = () => _headingDegreesNeedsChanged;

    this._onHeadingDegreesChanged = () => {
        _headingDegreesNeedsChanged = false;
    };

    this._locationNeedsChanged = () => _locationNeedsChanged;

    this._onLocationChanged = () => {
        _locationNeedsChanged = false;
    };

    this.addTo = (map) => {
        if (_map !== null) {
            this.remove();
        }
        _map = map;
        map.props.addProp(this);
        return this;
    };
	
    this.remove = () => {
        if (_map !== null) {
            _map.props.removeProp(this);
            _map = null;
        }
        return this;
    };
}

export const prop = (name, geometryId, location, config) => new Prop(name, geometryId, location, config || {});
