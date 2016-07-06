var MapModule = require("./map_module");
var CallbackCollection = require("./callback_collection");
var IndoorMap = require("./indoor_map");
var IndoorMapFloor = require("./indoor_map_floor");

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
        var floors = _createFloorsArray(floorCount);
        var exitFunc = _this.exit;
        var indoorMap = new IndoorMap(mapId, mapName, floorCount, floors, exitFunc);
        return indoorMap;
    };

    var _createFloorsArray = function(floorCount) {
        var floors = [];
        for (var i=0; i<floorCount; ++i) {
            var floorId = _emscriptenApi.indoorsApi.getFloorId(i);
            var floorName = _emscriptenApi.indoorsApi.getFloorName(i);
            var floorNumber = _emscriptenApi.indoorsApi.getFloorNumber(i);
            var floor = new IndoorMapFloor(floorId, floorName, floorNumber);
            floors.push(floor);
        }
        return floors;
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