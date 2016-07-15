var MapModule = require("./map_module");
var ProxiedObjectCollection = require("./id_to_object_map");

function PolylinesModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _polylines = new ProxiedObjectCollection();
    var _ready = false;


    var _createPolylines = function() {
        var api = _emscriptenApi.routesApi;

        _polylines.forEachItem(function(polylineId, polyline) {
            api.createRoute(polylineId, polyline.getPoints());
        });
    };

    this.addPolyline = function(polyline) {
        var polylineId = _polylines.insertObject(polyline);

        if (_ready) {
        	_emscriptenApi.routesApi.createRoute(polylineId, polyline.getPoints());
    	}
    };

    this.removePolyline = function(polyline) {
        var polylineId = _polylines.idForObject(polyline);
        if (polylineId === null) {
            return;
        }

        _polylines.removeObjectById(polylineId);

        if (_ready) {
            _emscriptenApi.routesApi.removeRoute(polylineId);
        }
    };

    this.onUpdate = function() {
    };

    this.onInitialized = function() {
        _ready = true;
        _createPolylines();
    };
}
PolylinesModule.prototype = MapModule;

module.exports = PolylinesModule;
