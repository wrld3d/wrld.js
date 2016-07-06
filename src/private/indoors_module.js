var MapModule = require("./map_module");
var CallbackCollection = require("./callback_collection");
var IndoorMap = require("./indoor_map");

var IndoorsModule = function(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _indoorMapEnteredCallbacks = new CallbackCollection();
    var _indoorMapExitedCallbacks = new CallbackCollection();

    var _activeIndoorMap = null;

    var _this = this;

    var _createIndoorMapObject = function() {
        var mapId = _emscriptenApi.indoorsApi.getActiveIndoorMapId();
        var mapName = _emscriptenApi.indoorsApi.getActiveIndoorMapName();
        var floorCount = _emscriptenApi.indoorsApi.getActiveIndoorMapFloorCount();
        var exitFunc = _this.exit;
        var indoorMap = new IndoorMap(mapId, mapName, floorCount, exitFunc);
        return indoorMap;
    };

    var _executeIndoorMapEnteredCallbacks = function() {
        _activeIndoorMap = _createIndoorMapObject();
        _indoorMapEnteredCallbacks.executeCallbacks(_activeIndoorMap);
    };

    var _executeIndoorMapExitedCallbacks = function() {
        _activeIndoorMap = null;
        _indoorMapExitedCallbacks.executeCallbacks(_activeIndoorMap);
    };

    this.onInitialized = function() {
        _emscriptenApi.indoorsApi.registerIndoorMapEnteredCallback(_executeIndoorMapEnteredCallbacks);
        _emscriptenApi.indoorsApi.registerIndoorMapExitedCallback(_executeIndoorMapExitedCallbacks);
    };
    
    this.exit = function() {
        if (_emscriptenApi.ready()) {
            _emscriptenApi.indoorsApi.exitIndoorMap();
        }
    };

    this.addIndoorMapEnteredCallback = function(callback) {
        _indoorMapEnteredCallbacks.addCallback(callback);
    };

    this.removeIndoorMapEnteredCallback = function(callback) {
        _indoorMapEnteredCallbacks.removeCallback(callback);
    };

    this.addIndoorMapExitedCallback = function(callback) {
        _indoorMapExitedCallbacks.addCallback(callback);
    };

    this.removeIndoorMapExitedCallback = function(callback) {
        _indoorMapExitedCallbacks.removeCallback(callback);
    };

    this.isIndoors = function() {
        return _emscriptenApi.indoorsApi.hasActiveIndoorMap();
    };

    this.getActiveIndoorMap = function() {
        return _activeIndoorMap;
    };

    this.getSelectedFloorIndex = function() {
        return _emscriptenApi.indoorsApi.getSelectedFloorIndex();
    };

    this.setSelectedFloorIndex = function(floorIndex) {
        return _emscriptenApi.indoorsApi.setSelectedFloorIndex(floorIndex);
    };

};
IndoorsModule.prototype = MapModule;

module.exports = IndoorsModule;