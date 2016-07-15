function EmscriptenExpandFloorsApi(apiPointer, cwrap) {

    var _apiPointer = apiPointer;
    
    var _getFloorParam = cwrap("getFloorParam", "number", ["number"]);
    var _setFloorParam = cwrap("setFloorParam", null, ["number", "number"]);
    var _expandIndoorMap = cwrap("expandIndoorMap", null, ["number"]);
    var _collapseIndoorMap = cwrap("collapseIndoorMap", null, ["number"]);

    var _setCollapseStartCallback = cwrap("setCollapseStartCallback", null, ["number", "number"]);
    var _setCollapseCallback = cwrap("setCollapseCallback", null, ["number", "number"]);
    var _setCollapseEndCallback = cwrap("setCollapseEndCallback", null, ["number", "number"]);
    var _setExpandStartCallback = cwrap("setExpandStartCallback", null, ["number", "number"]);
    var _setExpandCallback = cwrap("setExpandCallback", null, ["number", "number"]);
    var _setExpandEndCallback = cwrap("setExpandEndCallback", null, ["number", "number"]);

    this.expandIndoorMap = function() {
        return _expandIndoorMap(_apiPointer);
    };

    this.collapseIndoorMap = function() {
        return _collapseIndoorMap(_apiPointer);
    };

    this.getFloorParam = function() {
        return _getFloorParam(_apiPointer);
    };

    this.setFloorParam = function(value) {
        return _setFloorParam(_apiPointer, value);
    };

    this.setCollapseStartCallback = function(callback) {
        _setCollapseStartCallback(_apiPointer, Runtime.addFunction(callback));
    };

    this.setCollapseCallback = function(callback) {
        _setCollapseCallback(_apiPointer, Runtime.addFunction(callback));
    };

    this.setCollapseEndCallback = function(callback) {
        _setCollapseEndCallback(_apiPointer, Runtime.addFunction(callback));
    };

    this.setExpandStartCallback = function(callback) {
        _setExpandStartCallback(_apiPointer, Runtime.addFunction(callback));
    };

    this.setExpandCallback = function(callback) {
        _setExpandCallback(_apiPointer, Runtime.addFunction(callback));
    };

    this.setExpandEndCallback = function(callback) {
        _setExpandEndCallback(_apiPointer, Runtime.addFunction(callback));
    };

}

module.exports = EmscriptenExpandFloorsApi;