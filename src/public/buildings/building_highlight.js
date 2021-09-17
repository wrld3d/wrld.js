import { Vector4 } from "../space";

export function BuildingHighlight (options) {
    var _options = options;
    var _id = null;
    var _map = null;
    var _color = options.getColor();
    var _buildingInformation = null;

    this.getColor = () => new Vector4(_color);

    this.getOptions = () => _options;

    this.setColor = (color) => {
        _color = new Vector4(color);
        if (_map !== null) {
            _map.buildings._getImpl().notifyBuildingHighlightChanged(this);
        }
        return this;
    };

    this.getId = () => _id;

    this.addTo = (map) => {
        if (_map !== null) {
            this.remove();
        }
        _map = map;
        _map.buildings._getImpl().addBuildingHighlight(this);
        return this;
    };

    this.remove = () => {
        if (_map !== null) {
            _map.buildings._getImpl().removeBuildingHighlight(this);
            _map = null;
        }
        return this;
    };

    this._setNativeHandle = (nativeId) => {
        _id = nativeId;
    };

    this._setBuildingInformation = (buildingInformation) => {
        _buildingInformation = buildingInformation;
    };

    this.getBuildingInformation = () => _buildingInformation;
}

export const buildingHighlight = (options) => new BuildingHighlight(options);
