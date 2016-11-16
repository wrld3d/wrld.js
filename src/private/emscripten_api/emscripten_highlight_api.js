var emscriptenMemory = require("./emscripten_memory");

function EmscriptenHighlightApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;
    var _setEntityHighlights = null;
    var _clearEntityHighlights = null;
    var _addRoomHighlight = null;
    var _clearRoomHighlight = null;

    this.setEntityHighlights = function(ids, color) {
        _setEntityHighlights = _setEntityHighlights || cwrap("setEntityHighlights", null, ["number", "number", "number", "number"]);
        emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            emscriptenMemory.passDoubles(color, function(doubleArray, arraySize) {
                _setEntityHighlights(_apiPointer, resultStrings, stringArraySize, doubleArray);
            });
        });
    };

    this.clearEntityHighlights = function() {
        _clearEntityHighlights = _clearEntityHighlights || cwrap("clearEntityHighlights", null, ["number"]);
        _clearEntityHighlights(_apiPointer);
    };

    this.addRoomHighlight = function(id, color) {
        _addRoomHighlight = _addRoomHighlight || cwrap("addRoomHighlight", null, ["number", "string", "number"]);
        emscriptenMemory.passDoubles(color, function(resultArray, arraySize) {
            _addRoomHighlight(_apiPointer, id, resultArray);
        });
    };

    this.clearRoomHighlight = function(id) {
        _clearRoomHighlight = _clearRoomHighlight || cwrap("clearRoomHighlight", null, ["number", "string"]);
        _clearRoomHighlight(_apiPointer, id);
    };
}

module.exports = EmscriptenHighlightApi;
