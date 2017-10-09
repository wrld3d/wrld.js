function EmscriptenHighlightApi(eegeoApiPointer, cwrap, runtime, emscriptenMemory) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _setEntityHighlightsInterop = null;
    var _clearEntityHighlightsInterop = null;
    var _clearAllEntityHighlightsInterop = null;
    var _setEntityClickedCallbackInterop = null;
    
    var _wrapCallback = function(callback) {
        return function(idsPtr) {
            var ids = _emscriptenMemory.stringifyPointer(idsPtr);
            callback(ids);
        };
    };

    var _setEntityHighlights = function(ids, color, indoorMapId) {
        _setEntityHighlightsInterop = _setEntityHighlightsInterop || cwrap("setHighlights", null, ["number", "string", "number", "number", "number"]);

        var interiorId = indoorMapId || 0;
        _emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            _emscriptenMemory.passDoubles(color, function(doubleArray, arraySize) {
                _setEntityHighlightsInterop(_eegeoApiPointer, interiorId, resultStrings, stringArraySize, doubleArray);
            });
        });
    };

    var _clearEntityHighlights = function(ids, indoorMapId) {
        _clearEntityHighlightsInterop = _clearEntityHighlightsInterop || cwrap("clearHighlights", null, ["number", "string", "number", "number"]);

        var interiorId = indoorMapId || 0;
        _emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            _clearEntityHighlightsInterop(_eegeoApiPointer, interiorId, resultStrings, stringArraySize);
        });
    };

    var _clearAllEntityHighlights = function() {
        _clearAllEntityHighlightsInterop = _clearAllEntityHighlightsInterop || cwrap("clearAllHighlights", null, ["number"]);
        _clearAllEntityHighlightsInterop(_eegeoApiPointer);
    };

    this.registerEntityClickedCallback = function(callback) {
        _setEntityClickedCallbackInterop = _setEntityClickedCallbackInterop || cwrap("setEntityPickedCallback", null, ["number", "number"]);
        var wrappedCallback = _wrapCallback(callback);
        _setEntityClickedCallbackInterop(_eegeoApiPointer, runtime.addFunction(wrappedCallback));
    };

    this.setEntityHighlights = function(ids, color, indoorMapId) {
        if (typeof ids === "string") {
            ids = [ids];
        }
        _setEntityHighlights(ids, color, indoorMapId);
    };
    
    this.clearEntityHighlights = function(ids, indoorMapId) {
        if (ids === undefined) {
            _clearAllEntityHighlights();
        }
        else {
            if (typeof ids === "string") {
                ids = [ids];
            }
            _clearEntityHighlights(ids, indoorMapId);
        }
    };
}

module.exports = EmscriptenHighlightApi;
