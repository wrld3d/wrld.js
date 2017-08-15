function EmscriptenHighlightApi(apiPointer, cwrap, runtime, emscriptenMemory) {

    var _apiPointer = apiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _setHighlightsInterop = null;
    var _clearHighlightsInterop = null;
    var _clearAllHighlightsInterop = null;
    var _setHighlightClickedCallbackInterop = null;
    
    var _wrapCallback = function(callback) {
        return function(idsPtr) {
            var ids = _emscriptenMemory.stringifyPointer(idsPtr);
            callback(ids);
        };
    };

    var _setHighlights = function(ids, color) {
        _setHighlightsInterop = _setHighlightsInterop || cwrap("setHighlights", null, ["number", "number", "number", "number"]);
        _emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            _emscriptenMemory.passDoubles(color, function(doubleArray, arraySize) {
                _setHighlightsInterop(_apiPointer, resultStrings, stringArraySize, doubleArray);
            });
        });
    };

    var _clearHighlights = function(ids) {
        _clearHighlightsInterop = _clearHighlightsInterop || cwrap("clearHighlights", null, ["number", "number", "number"]);
        _emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            _clearHighlightsInterop(_apiPointer, resultStrings, stringArraySize);
        });
    };

    var _clearAllHighlights = function() {
        _clearAllHighlightsInterop = _clearAllHighlightsInterop || cwrap("clearAllHighlights", null, ["number"]);
        _clearAllHighlightsInterop(_apiPointer);
    };

    this.registerHighlightClickedCallback = function(callback) {
        _setHighlightClickedCallbackInterop = _setHighlightClickedCallbackInterop || cwrap("setHighlightPickedCallback", null, ["number", "number"]);
        var wrappedCallback = _wrapCallback(callback);
        _setHighlightClickedCallbackInterop(_apiPointer, runtime.addFunction(wrappedCallback));
    };

    this.setHighlights = function(ids, color) {
        if (typeof ids === "string") {
            ids = [ids];
        }
        _setHighlights(ids, color);
    };
    
    this.clearHighlights = function(ids) {
        if (ids === undefined) {
            _clearAllHighlights();
        }
        else {
            if (typeof ids === "string") {
                ids = [ids];
            }
            _clearHighlights(ids);
        }
    };
}

module.exports = EmscriptenHighlightApi;
