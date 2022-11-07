export function EmscriptenIndoorEntityApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _indoorEntityApi_SetIndoorEntityPickedCallback = cwrap("indoorEntityApi_SetIndoorEntityPickedCallback", null, ["number", "number"]);
    var _indoorEntityApi_SetHighlightsWithBorderThickness = cwrap("indoorEntityApi_SetHighlightsWithBorderThickness", null, ["number", "string", "number", "number", "number", "number"]);
    var _indoorEntityApi_ClearHighlights = cwrap("indoorEntityApi_ClearHighlights", null, ["number", "string", "number", "number"]);
    var _indoorEntityApi_ClearAllHighlights = cwrap("indoorEntityApi_ClearAllHighlights", null, ["number"]);
    
    var _indoorEntityPickedCallback = null;
    

    var _onIndoorEntityPicked = (idsPtr) => {
        if (_indoorEntityPickedCallback !== null) {
            var ids = _emscriptenMemory.stringifyPointer(idsPtr);
            _indoorEntityPickedCallback(ids);
        }
    };

    var _setHighlights = (ids, color, indoorMapId, borderThickness) => {
        _emscriptenMemory.passStrings(ids, (resultStrings, stringArraySize) => {
        _emscriptenMemory.passDoubles(color, (doubleArray, arraySize) => {
                _indoorEntityApi_SetHighlightsWithBorderThickness(_emscriptenApiPointer, indoorMapId, resultStrings, stringArraySize, doubleArray, borderThickness);
            });
        });
    };

    var _clearHighlights = (ids, indoorMapId) => {
        _emscriptenMemory.passStrings(ids, (resultStrings, stringArraySize) => {
            _indoorEntityApi_ClearHighlights(_emscriptenApiPointer, indoorMapId, resultStrings, stringArraySize);
        });
    };

    var _clearAllHighlights = () => {
        _indoorEntityApi_ClearAllHighlights(_emscriptenApiPointer);
    };


    this.onInitialized = () => {
        // register emscripten callbacks
        _indoorEntityApi_SetIndoorEntityPickedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(_onIndoorEntityPicked, "vi"));
    };

    this.registerIndoorEntityPickedCallback = (callback) => {
        _indoorEntityPickedCallback = callback;
    };

    this.setHighlights = (ids, color, indoorMapId, borderThickness) => {
        if (indoorMapId === null || indoorMapId === undefined) {
            return;
        }

        if (typeof ids === "string") {
            ids = [ids];
        }
        _setHighlights(ids, color, indoorMapId, borderThickness);
    };
    
    this.clearHighlights = (ids, indoorMapId) => {
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

export default EmscriptenIndoorEntityApi;
