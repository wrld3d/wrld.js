function EmscriptenIndoorEntityApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _indoorEntityApi_SetIndoorEntityPickedCallback = cwrap("indoorEntityApi_SetIndoorEntityPickedCallback", null, ["number", "number"]);
    var _indoorEntityApi_SetHighlights = cwrap("indoorEntityApi_SetHighlights", null, ["number", "string", "number", "number", "number"]);
    var _indoorEntityApi_ClearHighlights = cwrap("indoorEntityApi_ClearHighlights", null, ["number", "string", "number", "number"]);
    var _indoorEntityApi_ClearAllHighlights = cwrap("indoorEntityApi_ClearAllHighlights", null, ["number"]);
    
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
                _indoorEntityApi_SetHighlights(_emscriptenApiPointer, indoorMapId, resultStrings, stringArraySize, doubleArray);
            });
        });
    };

    var _clearHighlights = function(ids, indoorMapId) {
        _emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            _indoorEntityApi_ClearHighlights(_emscriptenApiPointer, indoorMapId, resultStrings, stringArraySize);
        });
    };

    var _clearAllHighlights = function() {
        _indoorEntityApi_ClearAllHighlights(_emscriptenApiPointer);
    };


    this.onInitialized = function() {
        // register emscripten callbacks
        _indoorEntityApi_SetIndoorEntityPickedCallback(_emscriptenApiPointer, runtime.addFunction(_onIndoorEntityPicked));
    };

    this.registerIndoorEntityPickedCallback = function(callback) {
        _indoorEntityPickedCallback = callback;
    };

    this.setHighlights = function(ids, color, indoorMapId) {
        if (indoorMapId === null || indoorMapId === undefined) {
            return;
        }

        if (typeof ids === "string") {
            ids = [ids];
        }
        _setHighlights(ids, color, indoorMapId);
    };
    
    this.clearHighlights = function(ids, indoorMapId) {
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

module.exports = EmscriptenIndoorEntityApi;
