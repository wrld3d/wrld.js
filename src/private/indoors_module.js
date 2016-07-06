var MapModule = require("./map_module");
var CallbackCollection = require("./callback_collection");
var IndoorMap = require("./indoor_map");
var IndoorMapFloor = require("./indoor_map_floor");
var IndoorMapEntrance = require("./indoor_map_entrance");

var IndoorsModule = function(emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _indoorMapEnteredCallbacks = new CallbackCollection();
    var _indoorMapExitedCallbacks = new CallbackCollection();
    var _indoorMapEntranceAddedCallbacks = new CallbackCollection();
    var _indoorMapEntranceRemovedCallbacks = new CallbackCollection();

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

    var _executeIndoorMapEntranceAddedCallbacks = function(indoorMapId, indoorMapName, indoorMapLatLng) {
        var entrance = new IndoorMapEntrance(indoorMapId, indoorMapName, indoorMapLatLng);
        _indoorMapEntranceAddedCallbacks.executeCallbacks(entrance);
    };

    var _executeIndoorMapEntranceRemovedCallbacks = function(indoorMapId, indoorMapName, indoorMapLatLng) {
        var entrance = new IndoorMapEntrance(indoorMapId, indoorMapName, indoorMapLatLng);
        _indoorMapEntranceRemovedCallbacks.executeCallbacks(entrance);
    };

    this.onInitialized = function() {
        _emscriptenApi.indoorsApi.registerIndoorMapEnteredCallback(_executeIndoorMapEnteredCallbacks);
        _emscriptenApi.indoorsApi.registerIndoorMapExitedCallback(_executeIndoorMapExitedCallbacks);
        _emscriptenApi.indoorsApi.registerIndoorMapMarkerAddedCallback(_executeIndoorMapEntranceAddedCallbacks);
        _emscriptenApi.indoorsApi.registerIndoorMapMarkerRemovedCallback(_executeIndoorMapEntranceRemovedCallbacks);
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

    this.addIndoorMapEntranceAddedCallback = function(callback) {
        _indoorMapEntranceAddedCallbacks.addCallback(callback);
    };

    this.removeIndoorMapEntranceAddedCallback = function(callback) {
        _indoorMapEntranceAddedCallbacks.removeCallback(callback);
    };

    this.addIndoorMapEntranceRemovedCallback = function(callback) {
        _indoorMapEntranceRemovedCallbacks.addCallback(callback);
    };

    this.removeIndoorMapEntranceRemovedCallback = function(callback) {
        _indoorMapEntranceRemovedCallbacks.removeCallback(callback);
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