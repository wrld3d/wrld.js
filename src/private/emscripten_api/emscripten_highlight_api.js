function EmscriptenHighlightApi(eegeoApiPointer, cwrap, runtime, emscriptenMemory) {

    var _eegeoApiPointer = eegeoApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _setEntityHighlights = null;
    var _clearEntityHighlights = null;
    var _addAreaHighlight = null;
    var _clearAreaHighlight = null;

    this.setEntityHighlights = function(ids, color) {
        _setEntityHighlights = _setEntityHighlights || cwrap("setEntityHighlights", null, ["number", "number", "number", "number"]);
        _emscriptenMemory.passStrings(ids, function(resultStrings, stringArraySize){
            _emscriptenMemory.passDoubles(color, function(doubleArray, arraySize) {
                _setEntityHighlights(_eegeoApiPointer, resultStrings, stringArraySize, doubleArray);
            });
        });
    };

    this.clearEntityHighlights = function() {
        _clearEntityHighlights = _clearEntityHighlights || cwrap("clearEntityHighlights", null, ["number"]);
        _clearEntityHighlights(_eegeoApiPointer);
    };

    this.addAreaHighlight = function(id, color) {
        _addAreaHighlight = _addAreaHighlight || cwrap("addAreaHighlight", null, ["number", "string", "number"]);
        _emscriptenMemory.passDoubles(color, function(resultArray, arraySize) {
            _addAreaHighlight(_eegeoApiPointer, id, resultArray);
        });
    };

    this.clearAreaHighlight = function(id) {
        _clearAreaHighlight = _clearAreaHighlight || cwrap("clearAreaHighlight", null, ["number", "string"]);
        _clearAreaHighlight(_eegeoApiPointer, id);
    };
}

module.exports = EmscriptenHighlightApi;
