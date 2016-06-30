var space = require("../public/space");

var ScreenPointMapping = function(layer) {
    this._map = null;
    var _layer = layer;
    var _canvasPosition = null;

    this.hasValidPosition = function() {
        return (_canvasPosition !== null && _canvasPosition.z >= 0.0 && _canvasPosition.z <= 1.0);
    };

    this.setCanvasPos = function(pos) {
        _canvasPosition = new space.Vector3(pos);
    };

    this.getCanvasPos = function() {
        return _canvasPosition;
    };

    this.getLatLng = function() {
        return _layer.getLatLng();
    };

    this.getElevation = function() {
        return _layer.getElevation();
    };
};

module.exports = ScreenPointMapping;