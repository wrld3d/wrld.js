var space = require("../space");

var BuildingHighlight = function(options) {

    var _options = options;
    var _id = null;
    var _map = null;
    var _color = options.getColor();
    var _buildingInformation = null;

    this.getColor = function() {
        return new space.Vector4(_color);
    };

    this.getOptions = function() {
        return _options;
    };

    this.setColor = function(color) {
        _color = new space.Vector4(color);
        if (_map !== null) {
            _map.buildings._getImpl().notifyBuildingHighlightChanged(this);
        }
        return this;
    };

    this.getId = function() {
        return _id;
    };

    this.addTo = function(map) {
        if (_map !== null) {
            this.remove();
        }
        _map = map;
        _map.buildings._getImpl().addBuildingHighlight(this);
        return this;
    };

    this.remove = function() {
        if (_map !== null) {
            _map.buildings._getImpl().removeBuildingHighlight(this);
            _map = null;
        }
        return this;
    };

    this._setNativeHandle = function(nativeId) {
        _id = nativeId;
    };

    this._setBuildingInformation = function(buildingInformation) {
        _buildingInformation = buildingInformation;
    };

    this.getBuildingInformation = function() {
        return _buildingInformation;
    };
};

var buildingHighlight = function(options) {
    return new BuildingHighlight(options);
};

module.exports = {
    BuildingHighlight: BuildingHighlight,
    buildingHighlight: buildingHighlight
};

