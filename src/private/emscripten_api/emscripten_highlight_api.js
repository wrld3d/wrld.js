function EmscriptenHighlightApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _highlightApi_SetIndoorEntityPickedCallback = cwrap("highlightApi_SetIndoorEntityPickedCallback", null, ["number", "number"]);
    var _highlightApi_SetHighlights = cwrap("highlightApi_SetHighlights", null, ["number", "string", "number", "number", "number"]);
    var _highlightApi_ClearHighlights = cwrap("highlightApi_ClearHighlights", null, ["number", "string", "number", "number"]);
    var _highlightApi_ClearAllHighlights = cwrap("highlightApi_ClearAllHighlights", null, ["number"]);
    
    var _indoorEntityPickedCallback = null;
    

    var _onIndoorEntityPicked = function(idsPtr) {
        if (_indoorEntityPickedCallback !== null) {
            var ids = _emscriptenMemory.stringifyPointer(idsPtr);
            _indoorEntityPickedCallback(ids);
        }
    };

    var _setHighlights = function(ids, color, indoorMapId) {
        _emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            _emscriptenMemory.passDoubles(color, function(doubleArray, arraySize) {
                _highlightApi_SetHighlights(_emscriptenApiPointer, indoorMapId, resultStrings, stringArraySize, doubleArray);
            });
        });
    };

    var _clearHighlights = function(ids, indoorMapId) {
        _emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            _highlightApi_ClearHighlights(_emscriptenApiPointer, indoorMapId, resultStrings, stringArraySize);
        });
    };

    var _clearAllHighlights = function() {
        _highlightApi_ClearAllHighlights(_emscriptenApiPointer);
    };


    this.onInitialized = function() {
        // register emscripten callbacks
        _highlightApi_SetIndoorEntityPickedCallback(_emscriptenApiPointer, runtime.addFunction(_onIndoorEntityPicked));
    };

    this.registerIndoorEntityPickedCallback = function(callback) {
        _indoorEntityPickedCallback = callback;
    };

    this.setEntityHighlights = function(ids, color, indoorMapId) {
        if (indoorMapId === null || indoorMapId === undefined) {
            return;
        }

        if (typeof ids === "string") {
            ids = [ids];
        }
        _setHighlights(ids, color, indoorMapId);
    };
    
    this.clearEntityHighlights = function(ids, indoorMapId) {
        if (ids === undefined) {
            _clearAllHighlights();
        }
        else {
            if (indoorMapId === null || indoorMapId === undefined) {
                return;
            }

            if (typeof ids === "string") {
                ids = [ids];
            }
            _clearHighlights(ids, indoorMapId);
        }
    };
}

module.exports = EmscriptenHighlightApi;
