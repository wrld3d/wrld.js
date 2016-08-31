var emscriptenMemory = require("./emscripten_memory");

function EmscriptenScreenPointMappingApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;
    var _createAnnotation = cwrap("createAnnotation", null, ["number", "number", "number", "number", "number"]);
    var _moveAnnotation = cwrap("moveAnnotation", null, ["number", "number", "number", "number", "number"]);
    var _removeAnnotation = cwrap("removeAnnotation", null, ["number", "number"]);
    var _getAnnotationScreenPosition = cwrap("getAnnotationScreenPosition", "number", ["number", "number"]);


    this.createScreenPointMapping = function(mappingId, annotation) {
        var latLng = annotation.getLatLng();
        _createAnnotation(_apiPointer, mappingId, latLng.lat, latLng.lng, annotation.getElevation());
    };

    this.updateScreenPointMapping = function(mappingId, annotation) {
        var latLng = annotation.getLatLng();
        _moveAnnotation(_apiPointer, mappingId, latLng.lat, latLng.lng, annotation.getElevation());
    };

    this.removeScreenPointMapping = function(mappingId) {
        _removeAnnotation(_apiPointer, mappingId);
    };

    this.getScreenPosition = function(mappingId) {
        var doublePointer = _getAnnotationScreenPosition(_apiPointer, mappingId);
        var screenPos = emscriptenMemory.readDoubles(doublePointer, 3);
        return screenPos;
    };
}

module.exports = EmscriptenScreenPointMappingApi;