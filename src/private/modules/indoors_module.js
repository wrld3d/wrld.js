import L from "leaflet";
import MapModule from "./map_module";
import { IndoorMap, IndoorMapFloor, IndoorMapEntrance } from "../../public/indoors";
import IndoorWatermarkController from "../indoor_watermark_controller";

function IndoorsModule (emscriptenApi, mapController, mapId, indoorId, floorIndex, center, headingDegrees, zoom, showWrldWatermark, backgroundColor) {

    var _emscriptenApi = emscriptenApi;
    var _mapController = mapController;

    var _activeIndoorMap = null;
    var _entrances = {};

    var _ready = false;
    var _pendingEnterTransition = null;
    var _transitioningToIndoorMap = false;

    var _indoorWatermarkController = new IndoorWatermarkController(mapId, showWrldWatermark);

    var _startingIndoorId = indoorId;
    var _startingFloorIndex = floorIndex;
    var _center = center;
    var _headingDegrees = headingDegrees;
    var _zoom = zoom;
    var _backgroundColor = backgroundColor;

    

    var _createIndoorMapObject = () => {
        var mapId = _emscriptenApi.indoorsApi.getActiveIndoorMapId();
        var mapName = _emscriptenApi.indoorsApi.getActiveIndoorMapName();
        var sourceVendor = _emscriptenApi.indoorsApi.getActiveIndoorMapSourceVendor();
        var floorCount = _emscriptenApi.indoorsApi.getActiveIndoorMapFloorCount();
        var floors = _createFloorsArray(floorCount);
        var searchTags = _createSearchTagsArray();
        var exitFunc = this.exit;
        var indoorMap = new IndoorMap(mapId, mapName, sourceVendor, floorCount, floors, searchTags, exitFunc);
        return indoorMap;
    };

    var _createFloorsArray = (floorCount) => {
        var floors = [];
        for (var i = 0; i < floorCount; ++i) {
            var floorIndex = i;
            var floorName = _emscriptenApi.indoorsApi.getFloorName(i);
            var floorShortName = _emscriptenApi.indoorsApi.getFloorShortName(i);
            var floorNumber = _emscriptenApi.indoorsApi.getFloorNumber(i);

            var floorId = floorNumber;

            var floor = new IndoorMapFloor(floorId, floorIndex, floorName, floorShortName);
            floors.push(floor);
        }
        return floors;
    };

    var _createSearchTagsArray = () => {
        var userData;
        try {
            userData = JSON.parse(_emscriptenApi.indoorsApi.getActiveIndoorMapUserData());
        }
        catch (e) {
            return [];
        }

        if (typeof userData.search_menu_items !== "object") { return []; }
        if (!(userData.search_menu_items.items instanceof Array)) { return []; }

        var searchTags = [];
        userData.search_menu_items.items.forEach((item) => {
                searchTags.push({
                    name: item.name,
                    search_tag: item.search_tag,
                    icon_key: item.icon_key
                });
            });
        return searchTags;
    };

    var _executeIndoorMapEnteredCallbacks = () => {
        _activeIndoorMap = _createIndoorMapObject();
        this.fire("indoormapenter", { indoorMap: _activeIndoorMap });
    };

    var _executeIndoorMapEnterFailedCallbacks = () => {
        this.fire("indoormapenterfailed", {});
    };

    var _executeIndoorMapExitedCallbacks = () => {
        var indoorMap = _activeIndoorMap;
        _activeIndoorMap = null;
        _indoorWatermarkController.hideWatermark();
        this.fire("indoormapexit", { indoorMap: indoorMap });
    };

    var _executeIndoorMapFloorChangedCallbacks = () => {
        this.fire("indoormapfloorchange", { floor: this.getFloor() });
    };

    var _executeIndoorMapEntranceAddedCallbacks = (indoorMapId, indoorMapName, indoorMapLatLng) => {
        // discard the altitude, as we're going to use the SDK IPointOnMap positioning to snap it to the terrain (this is now default)
        // alternative is to use the altitude, but use "elevationMode: heightAboveSeaLevel" when creating the indoor entrance marker
        var entrance = new IndoorMapEntrance(indoorMapId, indoorMapName, L.latLng([indoorMapLatLng.lat, indoorMapLatLng.lng]));
        _entrances[entrance.getIndoorMapId()] = entrance;
        this.fire("indoorentranceadd", { entrance: entrance });
    };

    var _executeIndoorMapEntranceRemovedCallbacks = (indoorMapId, indoorMapName, indoorMapLatLng) => {
        var entrance = new IndoorMapEntrance(indoorMapId, indoorMapName, indoorMapLatLng);
        delete _entrances[entrance.getIndoorMapId()];
        this.fire("indoorentranceremove", { entrance: entrance });
    };

    var _executeIndoorMapLoadedCallbacks = (indoorMapId) => {
        this.fire("indoormapload", { indoorMapId: indoorMapId });
    };

    var _executeIndoorMapUnloadedCallbacks = (indoorMapId) => {
        this.fire("indoormapunload", { indoorMapId: indoorMapId });
    };

    var _executeEntityClickedCallbacks = (ids) => {
        var idArray = ids.split("|");
        this.fire("indoorentityclick", { ids: idArray });
    };

    var _onCollapseStart = () => {
        this.fire("collapsestart");
    };

    var _onCollapse = () => {
        this.fire("collapse");
    };

    var _onCollapseEnd = () => {
        this.fire("collapseend");
    };

    var _onExpandStart = () => {
        this.fire("expandstart");
    };

    var _onExpand = () => {
        this.fire("expand");
    };

    var _onExpandEnd = () => {
        this.fire("expandend");
    };

    var _enterIndoorMap = (indoorMapId) => {
        this.fire("indoormapenterrequested");
        _emscriptenApi.indoorsApi.enterIndoorMap(indoorMapId);
    };

    var _transitionToIndoorMap = (config) => {

        _transitioningToIndoorMap = true;

        if (!_ready) {
            _pendingEnterTransition = config;
            return;
        }
        var animated = "animate" in config ? config["animate"] : true;
        _emscriptenApi.cameraApi.setView({ location: config.latLng, distance: config.distance, allowInterruption: false, headingDegrees: config.orientation, animate: animated });
        _mapController._setIndoorTransitionCompleteEventListener(function () { _enterIndoorMap(config.indoorMapId); });

        this.once("indoormapenter", () => {
                _transitioningToIndoorMap = false;
                var vendorKey = _activeIndoorMap.getIndoorMapSourceVendor();
                _indoorWatermarkController.showWatermarkForVendor(vendorKey);
            });
        this.once("indoormapenterfailed", () => {
                _transitioningToIndoorMap = false;
            });
    };

    this.onInitialized = () => {
        _emscriptenApi.indoorsApi.onInitialized();

        _emscriptenApi.indoorsApi.setNotificationCallbacks(
            _executeIndoorMapEnteredCallbacks,
            _executeIndoorMapEnterFailedCallbacks,
            _executeIndoorMapExitedCallbacks,
            _executeIndoorMapFloorChangedCallbacks,
            _executeIndoorMapEntranceAddedCallbacks,
            _executeIndoorMapEntranceRemovedCallbacks,
            _executeIndoorMapLoadedCallbacks,
            _executeIndoorMapUnloadedCallbacks
        );

        _emscriptenApi.indoorEntityApi.onInitialized();
        _emscriptenApi.indoorEntityApi.registerIndoorEntityPickedCallback(_executeEntityClickedCallbacks);

        _emscriptenApi.expandFloorsApi.setCollapseStartCallback(_onCollapseStart);
        _emscriptenApi.expandFloorsApi.setCollapseCallback(_onCollapse);
        _emscriptenApi.expandFloorsApi.setCollapseEndCallback(_onCollapseEnd);
        _emscriptenApi.expandFloorsApi.setExpandStartCallback(_onExpandStart);
        _emscriptenApi.expandFloorsApi.setExpandCallback(_onExpand);
        _emscriptenApi.expandFloorsApi.setExpandEndCallback(_onExpandEnd);


        _emscriptenApi.indoorsApi.setBackgroundColor(_backgroundColor);
    };

    this.onInitialStreamingCompleted = () => {
        _ready = true;

        if (_startingIndoorId) {
            var config = {
                latLng: _center,
                zoom: _zoom,
                indoorMapId: _startingIndoorId,
                orientation: _headingDegrees
            };
            this.enter(_startingIndoorId, config);

            if (_startingFloorIndex) {
                this.once("indoormapenter", function() { this.setFloor(Number(_startingFloorIndex)); });
            }
        }

        if (_pendingEnterTransition !== null) {
            _transitionToIndoorMap(_pendingEnterTransition);
            _pendingEnterTransition = null;
        }
    };

    this.exit = () => {
        if (_emscriptenApi.ready()) {
            _emscriptenApi.indoorsApi.exitIndoorMap();
            _indoorWatermarkController.hideWatermark();
        }
        _pendingEnterTransition = null;
        _transitioningToIndoorMap = false;
        return this;
    };

    this.isIndoors = () => _activeIndoorMap !== null;

    this.getActiveIndoorMap = () => _activeIndoorMap;

    this.getFloor = () => {
        if (this.isIndoors()) {
            var index = _emscriptenApi.indoorsApi.getSelectedFloorIndex();
            return _activeIndoorMap.getFloors()[index];
        }
        return null;
    };

    this.setFloor = (floor) => {
        if (!this.isIndoors()) {
            return false;
        }

        var index = null;
        var floors = _activeIndoorMap.getFloors();

        if (typeof floor === "number") {
            index = floor;
        }
        else if (typeof floor === "object") {
            var floorIndex = floors.indexOf(floor);
            index = (floorIndex >= 0) ? floorIndex : null;
        }
        else if (typeof floor === "string") {
            for (var i = 0; i < floors.length; ++i) {
                if (floors[i].getFloorShortName() === floor) {
                    index = i;
                    break;
                }
            }
        }

        if (index !== null) {
            return _emscriptenApi.indoorsApi.setSelectedFloorIndex(index);
        }

        return false;
    };

    this.moveUp = (numberOfFloors) => {
        var delta = (typeof numberOfFloors === "undefined") ? 1 : numberOfFloors;
        var thisFloor = this.getFloor();
        if (thisFloor === null) {
            return false;
        }
        return this.setFloor(thisFloor.getFloorIndex() + delta);
    };

    this.moveDown = (numberOfFloors) => {
        var delta = (typeof numberOfFloors === "undefined") ? -1 : -numberOfFloors;
        return this.moveUp(delta);
    };

    this.enter = (indoorMap, config) => {
        if (this.isIndoors() || _transitioningToIndoorMap) {
            return false;
        }

        var indoorMapId = null;
        if (typeof indoorMap === "object" && "getIndoorMapId" in indoorMap && typeof indoorMap["getIndoorMapId"] === "function") {
            indoorMapId = indoorMap.getIndoorMapId();
        }
        else if (typeof indoorMap === "string") {
            indoorMapId = indoorMap;
        }

        var entrance = _entrances[indoorMapId] || null;

        var latLng = null;
        if (entrance !== null) {
            latLng = entrance.getLatLng();
        }
        else if (config && config.latLng) {
            latLng = config.latLng;
        }

        if (latLng === null) {
            if (!_ready) {
                return false;
            }

            _enterIndoorMap(indoorMapId);
            return true;
        }

        var distance = 400;

        var defaultConfig = {
            latLng: latLng,
            distance: distance,
            indoorMapId: indoorMapId,
            orientation: 0
        };

        _transitionToIndoorMap(Object.assign(defaultConfig, config));

        return true;
    };

    this.getFloorInterpolation = () => {
        if (_activeIndoorMap !== null) {
            var floorParam = _emscriptenApi.expandFloorsApi.getFloorParam();
            var normalizedValue = floorParam / _activeIndoorMap.getFloorCount();
            return normalizedValue;
        }
        return 0;
    };

    this.getFloorHeightAboveSeaLevel = (floorIndex) => {
        if (this.isIndoors() &&
            floorIndex >= 0 &&
            floorIndex < _activeIndoorMap.getFloorCount()) {
            return _emscriptenApi.indoorsApi.getFloorHeightAboveSeaLevel(floorIndex);
        }

        return null;
    };

    this.tryGetReadableName = (indoorMapId) => {
        if (_emscriptenApi.ready()) {
            return _emscriptenApi.indoorsApi.tryGetReadableName(indoorMapId);
        }
        return null;
    };

    this.tryGetFloorReadableName = (indoorMapId, indoorMapFloorId) => {
        if (_emscriptenApi.ready()) {
            return _emscriptenApi.indoorsApi.tryGetFloorReadableName(indoorMapId, indoorMapFloorId);
        }
        return null;
    };

    this.tryGetFloorShortName = (indoorMapId, indoorMapFloorId) => {
        if (_emscriptenApi.ready()) {
            return _emscriptenApi.indoorsApi.tryGetFloorShortName(indoorMapId, indoorMapFloorId);
        }
        return null;
    };

    this.setFloorInterpolation = (value) => {
        if (_activeIndoorMap !== null) {
            var floorParam = value * _activeIndoorMap.getFloorCount();
            _emscriptenApi.expandFloorsApi.setFloorParam(floorParam);
        }
        return this;
    };

    this.setFloorFromInterpolation = (interpolationParam) => {
        if (_activeIndoorMap === null) {
            return false;
        }

        var t = (typeof interpolationParam === "undefined") ? this.getFloorInterpolation() : interpolationParam;
        var floorIndex = Math.round(t * _activeIndoorMap.getFloorCount());
        return this.setFloor(floorIndex);
    };

    this.expand = () => {
        _emscriptenApi.expandFloorsApi.expandIndoorMap();
        return this;
    };

    this.collapse = () => {
        _emscriptenApi.expandFloorsApi.collapseIndoorMap();
        return this;
    };

    this.setEntityHighlights = (ids, highlightColor, indoorMapId, highlightBorderThickness) => {
        if (!_ready) return;

        indoorMapId = _indoorMapIdOrDefault(indoorMapId);
        highlightBorderThickness = _borderThicknessOrDefault(highlightBorderThickness);
        _emscriptenApi.indoorEntityApi.setHighlights(ids, highlightColor, indoorMapId, highlightBorderThickness);
    };

    this.clearEntityHighlights = (ids, indoorMapId) => {
        if (!_ready) return;

        indoorMapId = _indoorMapIdOrDefault(indoorMapId);
        _emscriptenApi.indoorEntityApi.clearHighlights(ids, indoorMapId);
    };

    var _borderThicknessOrDefault = (borderThickness) => {
        if (borderThickness === undefined || borderThickness === null) {
            borderThickness = 0.5;
        }

        return borderThickness;
    };

    var _indoorMapIdOrDefault = (indoorMapId) => {
        if (indoorMapId === undefined || indoorMapId === null) {
            if (_activeIndoorMap !== null) {
                indoorMapId = _activeIndoorMap.getIndoorMapId();
            }
        }

        return indoorMapId;
    };

    this.setBackgroundColor = (color) => {
        _backgroundColor = color;
        if (!_ready) return;

        _emscriptenApi.indoorsApi.setBackgroundColor(color);
    };

    this.hideLabelsForEntity = (entityName) => {
        return this.hideLabelsForEntities([entityName]);
    };

    this.hideLabelsForEntities = (entityNames) => {
        if (_emscriptenApi.ready()) {
            _emscriptenApi.indoorsApi.hideLabelsForEntities(entityNames);
        }

        return this;
    };
    
    this.showLabelsForEntity = (entityName) => {
        return this.showLabelsForEntities([entityName]);
    };

    this.showLabelsForEntities = (entityNames) => {
        if (_emscriptenApi.ready()) {
            _emscriptenApi.indoorsApi.showLabelsForEntities(entityNames);
        }

        return this;
    };

    this.showAllLabels = () => {
        if (_emscriptenApi.ready()) {
            _emscriptenApi.indoorsApi.showAllLabels();
        }

        return this;
    };

}

var IndoorsPrototype = L.extend({}, MapModule, L.Mixin.Events);

IndoorsModule.prototype = IndoorsPrototype;

export default IndoorsModule;
