function EmscriptenExpandFloorsApi(eegeoApiPointer, cwrap, emscriptenModule) {

    var _eegeoApiPointer = eegeoApiPointer;
    
    var _getFloorParam = null;
    var _setFloorParam = null;
    var _expandIndoorMap = null;
    var _collapseIndoorMap = null;
    var _setCollapseStartCallback = null;
    var _setCollapseCallback = null;
    var _setCollapseEndCallback = null;
    var _setExpandStartCallback = null;
    var _setExpandCallback = null;
    var _setExpandEndCallback = null;

    this.expandIndoorMap = function() {
        _expandIndoorMap = _expandIndoorMap || cwrap("expandIndoorMap", "number", ["number"]);
        return _expandIndoorMap(_eegeoApiPointer);
    };

    this.collapseIndoorMap = function() {
        _collapseIndoorMap = _collapseIndoorMap || cwrap("collapseIndoorMap", null, ["number"]);
        return _collapseIndoorMap(_eegeoApiPointer);
    };

    this.getFloorParam = function() {
        _getFloorParam = _getFloorParam || cwrap("getFloorParam", null, ["number"]);
        return _getFloorParam(_eegeoApiPointer);
    };

    this.setFloorParam = function(value) {
        _setFloorParam = _setFloorParam || cwrap("setFloorParam", null, ["number", "number"]);
        return _setFloorParam(_eegeoApiPointer, value);
    };

    this.setCollapseStartCallback = function(callback) {
        _setCollapseStartCallback = _setCollapseStartCallback || cwrap("setCollapseStartCallback", null, ["number", "number"]);
        _setCollapseStartCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback));
    };

    this.setCollapseCallback = function(callback) {
        _setCollapseCallback = _setCollapseCallback || cwrap("setCollapseCallback", null, ["number", "number"]);
        _setCollapseCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback));
    };

    this.setCollapseEndCallback = function(callback) {
        _setCollapseEndCallback = _setCollapseEndCallback || cwrap("setCollapseEndCallback", null, ["number", "number"]);
        _setCollapseEndCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback));
    };

    this.setExpandStartCallback = function(callback) {
        _setExpandStartCallback = _setExpandStartCallback || cwrap("setExpandStartCallback", null, ["number", "number"]);
        _setExpandStartCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback));
    };

    this.setExpandCallback = function(callback) {
        _setExpandCallback = _setExpandCallback || cwrap("setExpandCallback", null, ["number", "number"]);
        _setExpandCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback));
    };

    this.setExpandEndCallback = function(callback) {
        _setExpandEndCallback = _setExpandEndCallback || cwrap("setExpandEndCallback", null, ["number", "number"]);
        _setExpandEndCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback));
    };
}

module.exports = EmscriptenExpandFloorsApi;