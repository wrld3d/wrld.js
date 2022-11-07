export function EmscriptenExpandFloorsApi(eegeoApiPointer, cwrap, emscriptenModule) {

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

    this.expandIndoorMap = () => {
        _expandIndoorMap = _expandIndoorMap || cwrap("expandIndoorMap", "number", ["number"]);
        return _expandIndoorMap(_eegeoApiPointer);
    };

    this.collapseIndoorMap = () => {
        _collapseIndoorMap = _collapseIndoorMap || cwrap("collapseIndoorMap", null, ["number"]);
        return _collapseIndoorMap(_eegeoApiPointer);
    };

    this.getFloorParam = () => {
        _getFloorParam = _getFloorParam || cwrap("getFloorParam", null, ["number"]);
        return _getFloorParam(_eegeoApiPointer);
    };

    this.setFloorParam = (value) => {
        _setFloorParam = _setFloorParam || cwrap("setFloorParam", null, ["number", "number"]);
        return _setFloorParam(_eegeoApiPointer, value);
    };

    this.setCollapseStartCallback = (callback) => {
        _setCollapseStartCallback = _setCollapseStartCallback || cwrap("setCollapseStartCallback", null, ["number", "number"]);
        _setCollapseStartCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback, "v"));
    };

    this.setCollapseCallback = (callback) => {
        _setCollapseCallback = _setCollapseCallback || cwrap("setCollapseCallback", null, ["number", "number"]);
        _setCollapseCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback, "v"));
    };

    this.setCollapseEndCallback = (callback) => {
        _setCollapseEndCallback = _setCollapseEndCallback || cwrap("setCollapseEndCallback", null, ["number", "number"]);
        _setCollapseEndCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback, "v"));
    };

    this.setExpandStartCallback = (callback) => {
        _setExpandStartCallback = _setExpandStartCallback || cwrap("setExpandStartCallback", null, ["number", "number"]);
        _setExpandStartCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback, "v"));
    };

    this.setExpandCallback = (callback) => {
        _setExpandCallback = _setExpandCallback || cwrap("setExpandCallback", null, ["number", "number"]);
        _setExpandCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback, "v"));
    };

    this.setExpandEndCallback = (callback) => {
        _setExpandEndCallback = _setExpandEndCallback || cwrap("setExpandEndCallback", null, ["number", "number"]);
        _setExpandEndCallback(_eegeoApiPointer, emscriptenModule.addFunction(callback, "v"));
    };
}

export default EmscriptenExpandFloorsApi;
