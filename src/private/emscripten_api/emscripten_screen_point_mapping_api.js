var emscriptenMemory = require("./emscripten_memory");

function EmscriptenScreenPointMappingApi(apiPointer, cwrap, runtime) {
    var _apiPointer = apiPointer;
    var _createAnnotation = null;
    var _moveAnnotation = null;
    var _removeAnnotation = null;
    var _getAnnotationScreenPosition = null;

    this.createScreenPointMapping = function(mappingId, annotation) {
        _createAnnotation = _createAnnotation || cwrap("createAnnotation", null, ["number", "number", "number", "number", "number"]);
        
        var latLng = annotation.getLatLng();
        _createAnnotation(_apiPointer, mappingId, latLng.lat, latLng.lng, annotation.getElevation());
    };

    this.updateScreenPointMapping = function(mappingId, annotation) {
        _moveAnnotation = _moveAnnotation || cwrap("moveAnnotation", null, ["number", "number", "number", "number", "number"]);
        
        var latLng = annotation.getLatLng();
        _moveAnnotation(_apiPointer, mappingId, latLng.lat, latLng.lng, annotation.getElevation());
    };

    this.removeScreenPointMapping = function(mappingId) {
        _removeAnnotation = _removeAnnotation || cwrap("removeAnnotation", null, ["number", "number"]);

        _removeAnnotation(_apiPointer, mappingId);
    };

    this.getScreenPosition = function(mappingId) {
        _getAnnotationScreenPosition = _getAnnotationScreenPosition || cwrap("getAnnotationScreenPosition", "number", ["number", "number"]);

        var doublePointer = _getAnnotationScreenPosition(_apiPointer, mappingId);
        var screenPos = emscriptenMemory.readDoubles(doublePointer, 3);
        return screenPos;
    };
}

module.exports = EmscriptenScreenPointMappingApi;