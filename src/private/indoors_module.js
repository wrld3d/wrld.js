var MapModule = require("./map_module");
var CallbackCollection = require("./callback_collection");
var IndoorMap = require("./indoor_map");
var IndoorMapFloor = require("./indoor_map_floor");
var IndoorMapEntrance = require("./indoor_map_entrance");

var IndoorsModule = function(emscriptenApi, mapController) {

    var _emscriptenApi = emscriptenApi;
    var _mapController = mapController;

    var _activeIndoorMap = null;
    var _entrances = {};

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

    var _this = this;

    var _executeIndoorMapEnteredCallbacks = function() {
        _activeIndoorMap = _createIndoorMapObject();
        _this.fire("indoormapenter", {indoorMap: _activeIndoorMap});
    };

    var _executeIndoorMapExitedCallbacks = function() {
        var indoorMap = _activeIndoorMap;
        _activeIndoorMap = null;
        _this.fire("indoormapexit", {indoorMap: indoorMap});
    };

    var _executeIndoorMapEntranceAddedCallbacks = function(indoorMapId, indoorMapName, indoorMapLatLng) {
        var entrance = new IndoorMapEntrance(indoorMapId, indoorMapName, indoorMapLatLng);
        _entrances[entrance.getIndoorMapId()] = entrance;
        _this.fire("indoorentranceadd", {entrance: entrance});
    };

    var _executeIndoorMapEntranceRemovedCallbacks = function(indoorMapId, indoorMapName, indoorMapLatLng) {
        var entrance = new IndoorMapEntrance(indoorMapId, indoorMapName, indoorMapLatLng);
        delete _entrances[entrance.getIndoorMapId()];
        _this.fire("indoorentranceremove", {entrance: entrance});
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

    // Deprecated
    this.addIndoorMapEnteredCallback = function(callback) {
        this.on("indoormapenter", callback);
    };

    // Deprecated
    this.removeIndoorMapEnteredCallback = function(callback) {
        this.off("indoormapenter", callback);
    };

    // Deprecated
    this.addIndoorMapExitedCallback = function(callback) {
        this.on("indoormapexit", callback);
    };

    // Deprecated
    this.removeIndoorMapExitedCallback = function(callback) {
        this.off("indoormapexit", callback);
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

    this.enter = function(indoorMap) {
        var indoorMapId = null;
        if (typeof indoorMap === "object" && "getIndoorMapId" in indoorMap && typeof indoorMap["getIndoorMapId"] === "function") {
            indoorMapId = indoorMap.getIndoorMapId();
        }
        else if (typeof indoorMap === "string") {
            indoorMapId = indoorMap;
        }

        var entrance = _entrances[indoorMapId] || null;
        if (entrance === null) {
            return false;
        }

        var latLng = entrance.getLatLng();
        var distance = 400;

        _emscriptenApi.cameraApi.setView({location: latLng, distance: distance, allowInterruption: false});
        _mapController._setIndoorTransitionCompleteEventListener(function() { _emscriptenApi.indoorsApi.enterIndoorMap(indoorMapId); });
        return true;
    };

    this.getFloorParam = function() {
        return _emscriptenApi.indoorsApi.getFloorParam();
    };

    this.setFloorParam = function(value) {
        _emscriptenApi.indoorsApi.setFloorParam(value);
        return this;
    };

    this.expand = function() {
        _emscriptenApi.indoorsApi.expandIndoorMap();
        return this;
    };

    this.collapse = function() {
        _emscriptenApi.indoorsApi.collapseIndoorMap();
        return this;
    };
};

var IndoorsPrototype = L.extend({}, MapModule, L.Mixin.Events); 

IndoorsModule.prototype = IndoorsPrototype;

module.exports = IndoorsModule;