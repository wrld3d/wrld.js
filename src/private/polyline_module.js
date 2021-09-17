import MapModule from "./map_module";

export function PolylineModule(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _polylineIdToPolyline = {};
    var _pendingPolylines = [];
    var _ready = false;


    var _createPendingPolylines = () => {
        _pendingPolylines.forEach((polyline) => {
                _createAndAdd(polyline);
            });
        _pendingPolylines = [];
    };

    var _createAndAdd = (polyline) => {
        var polylineId = _emscriptenApi.polylineApi.createPolyline(polyline);
        _polylineIdToPolyline[polylineId] = polyline;
        return polylineId;
    };

    this.addPolyline = (polyline) => {
        if (_ready) {
            _createAndAdd(polyline);
        }
        else {
            _pendingPolylines.push(polyline);
        }
    };

    this.removePolyline = (polyline) => {

        if (!_ready) {
            var index = _pendingPolylines.indexOf(polyline);
            if (index > -1) {
                _pendingPolylines.splice(index, 1);
            }
            return;
        }

        var polylineId = Object.keys(_polylineIdToPolyline).find((key) => _polylineIdToPolyline[key] === polyline
        );

        if (polylineId === undefined) {
            return;
        }

        _emscriptenApi.polylineApi.destroyPolyline(polylineId);
        delete _polylineIdToPolyline[polylineId];
    };

    this.onUpdate = () => {
        if (_ready) {
            Object.keys(_polylineIdToPolyline).forEach((polylineId) => {
                    var polyline = _polylineIdToPolyline[polylineId];
                    _emscriptenApi.polylineApi.updateNativeState(polylineId, polyline);
                });
        }
    };

    this.onInitialized = () => {
        _ready = true;
        _createPendingPolylines();
    };
}

PolylineModule.prototype = MapModule;

export default PolylineModule;
