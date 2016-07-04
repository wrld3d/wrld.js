var MapModule = require("./map_module");
var ProxiedObjectCollection = require("./id_to_object_map");

function PolygonsModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _polygons = new ProxiedObjectCollection();
    var _ready = false;


    var _createPolygons = function() {
        var api = _emscriptenApi.geofenceApi;

        _polygons.forEachItem(function(polygonId, polygon) {
            api.createGeofence(polygonId, polygon.getPoints());
        });
    };

    this.addPolygon = function(polygon) {
        var polygonId = _polygons.insertObject(polygon);

        if (_ready) {
        	_emscriptenApi.geofenceApi.createGeofence(polygonId, polygon.getPoints());
    	}
    };

    this.removePolygon = function(polygon) {
        var polygonId = _polygons.idForObject(polygon);
        if (polygonId === null) {
            return;
        }

        _polygons.removeObjectById(polygonId);

        if (_ready) {
            _emscriptenApi.geofenceApi.removeGeofence(polygonId);
        }
    };

    this.onUpdate = function() {
        if (_ready) {
            var api = _emscriptenApi.geofenceApi;

            _polygons.forEachItem(function(polygonId, polygon) {
                if (polygon.colorNeedsChanged()) {
                    api.setGeofenceColor(polygonId, polygon.getColor());
                    polygon.onColorChanged();
                }
            });
		}
    };

    this.onInitialized = function() {
        _ready = true;
        _createPolygons();
    };
}
PolygonsModule.prototype = MapModule;

module.exports = PolygonsModule;
