function EmscriptenHighlightApi(apiPointer, cwrap, runtime, emscriptenMemory) {

    var _apiPointer = apiPointer;
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

    var _setEntityHighlights = function(ids, color) {
        _setEntityHighlightsInterop = _setEntityHighlightsInterop || cwrap("setHighlights", null, ["number", "number", "number", "number"]);
        _emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            _emscriptenMemory.passDoubles(color, function(doubleArray, arraySize) {
                _setEntityHighlightsInterop(_apiPointer, resultStrings, stringArraySize, doubleArray);
            });
        });
    };

    var _clearEntityHighlights = function(ids) {
        _clearEntityHighlightsInterop = _clearEntityHighlightsInterop || cwrap("clearHighlights", null, ["number", "number", "number"]);
        _emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            _clearEntityHighlightsInterop(_apiPointer, resultStrings, stringArraySize);
        });
    };

    var _clearAllEntityHighlights = function() {
        _clearAllEntityHighlightsInterop = _clearAllEntityHighlightsInterop || cwrap("clearAllHighlights", null, ["number"]);
        _clearAllEntityHighlightsInterop(_apiPointer);
    };

    this.registerEntityClickedCallback = function(callback) {
        _setEntityClickedCallbackInterop = _setEntityClickedCallbackInterop || cwrap("setEntityPickedCallback", null, ["number", "number"]);
        var wrappedCallback = _wrapCallback(callback);
        _setEntityClickedCallbackInterop(_apiPointer, runtime.addFunction(wrappedCallback));
    };

    this.setEntityHighlights = function(ids, color) {
        if (typeof ids === "string") {
            ids = [ids];
        }
        _setEntityHighlights(ids, color);
    };
    
    this.clearEntityHighlights = function(ids) {
        if (ids === undefined) {
            _clearAllEntityHighlights();
        }
        else {
            if (typeof ids === "string") {
                ids = [ids];
            }
            _clearEntityHighlights(ids);
        }
    };
}

module.exports = EmscriptenHighlightApi;
