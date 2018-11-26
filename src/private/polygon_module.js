var MapModule = require("./map_module");

function PolygonsModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _polygonIdToPolygons = {};
    var _pendingPolygons = [];
    var _ready = false;


    var _createPendingPolygons = function() {
        _pendingPolygons.forEach(function(polygon) {
            _createAndAdd(polygon);
        });
        _pendingPolygons = [];
    };

    var _createAndAdd = function(polygon) {
        var polygonId = _emscriptenApi.geofenceApi.createGeofence(polygon.getPoints(), polygon.getHoles(), polygon._getConfig());
        _polygonIdToPolygons[polygonId] = polygon;
        return polygonId;
    };

    this.addPolygon = function(polygon) {
        if (_ready) {
            _createAndAdd(polygon);
    	}
        else {
            _pendingPolygons.push(polygon);
        }
    };

    this.removePolygon = function(polygon) {

        if (!_ready) {
            var index = _pendingPolygons.indexOf(polygon);
            if (index > -1) {
                _pendingPolygons.splice(index, 1);
            }
            return; 
        }

        var polygonId = Object.keys(_polygonIdToPolygons).find(function(key) { 
                return _polygonIdToPolygons[key] === polygon;
            }
        );
        
        if (polygonId === undefined) {
            return;
        }

        _emscriptenApi.geofenceApi.removeGeofence(polygonId);
        delete _polygonIdToPolygons[polygonId];
    };

    this.onUpdate = function() {
        if (_ready) {

            Object.keys(_polygonIdToPolygons).forEach(function(polygonId) {
                var polygon = _polygonIdToPolygons[polygonId];
                if (polygon._colorNeedsChanged()) {
                    _emscriptenApi.geofenceApi.setGeofenceColor(polygonId, polygon.getColor());
                    polygon._onColorChanged();
                }
            });
		}
    };

    this.onInitialized = function() {
        _ready = true;
        _createPendingPolygons();
    };
}
PolygonsModule.prototype = MapModule;

module.exports = PolygonsModule;
