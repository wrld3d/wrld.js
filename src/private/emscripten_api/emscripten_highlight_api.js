var emscriptenMemory = require("./emscripten_memory");

function EmscriptenHighlightApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;
    var _setEntityHighlight = null;
    var _setEntityHighlights = null;

    this.setEntityHighlight = function(id, color) {
        _setEntityHighlight = _setEntityHighlight || cwrap("setEntityHighlight", null, ["number", "string", "number"]);
        emscriptenMemory.passDoubles(color, function(resultArray, arraySize) {
            _setEntityHighlight(_apiPointer, id, resultArray);
        });
    };

    this.setEntityHighlights = function(ids, color) {
        _setEntityHighlights = _setEntityHighlights || cwrap("setEntityHighlights", null, ["number", "number", "number", "number"]);
        emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            emscriptenMemory.passDoubles(color, function(doubleArray, arraySize) {
                _setEntityHighlights(_apiPointer, resultStrings, stringArraySize, doubleArray);
            });
        });
    };

}

module.exports = EmscriptenHighlightApi;
