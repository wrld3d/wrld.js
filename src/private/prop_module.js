var MapModule = require("./map_module");
var IdToObjectMap = require("./id_to_object_map");

var PropModule = function(emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _pendingProps = [];
    var _props = new IdToObjectMap();
    var _hasPendingEnableDisable = false;
    var _pendingEnableDisable = false;
    var _ready = false;

    var _createAndAdd = function(prop) {
        var propId = _emscriptenApi.propsApi.createProp(
            prop.getIndoorMapId(),
            prop.getIndoorMapFloorId(),
            prop.getName(),
            prop.getLocation().lat,
            prop.getLocation().lng,
            prop.getElevation(),
            prop.getElevationMode(),
            prop.getHeadingDegrees(),
            prop.getGeometryId());
        _props.insertObject(propId, prop);
    };

    var _createPendingProps = function() {
        _pendingProps.forEach(function(prop) {
            _createAndAdd(prop);
        });
        _pendingProps = [];
    };

    this.addProp = function(prop) {
        if (_ready) {
            _createAndAdd(prop);
        }
        else {
            _pendingProps.push(prop);
        }
    };

    this.removeProp = function(prop) {
        if (_ready) {
            var propId = _props.idForObject(prop);

            if (propId !== null)
            {
                _emscriptenApi.propsApi.destroyProp(propId);
                _props.removeObjectById(propId);
            }
        }
        else {
            var index = _pendingProps.indexOf(prop);

            if (index > -1) {
                _pendingProps.splice(index, 1);
            }
        }
    };

    this.onInitialized = function() {
        _ready = true;
        _createPendingProps();

        if (_hasPendingEnableDisable) {
            this.setAutomaticIndoorMapPopulationEnabled(_pendingEnableDisable);
        }
    };

    this.onUpdate = function(dt) {
        if (_ready) {

            _props.forEachItem(function(propId, prop) {

                if (prop._locationNeedsChanged()) {
                    _emscriptenApi.propsApi.setLocation(propId, prop.getLocation().lat, prop.getLocation().lng);
                    prop._onLocationChanged();
                }

                if (prop._headingDegreesNeedsChanged()) {
                    _emscriptenApi.propsApi.setHeadingDegrees(propId, prop.getHeadingDegrees());
                    prop._onHeadingDegreesChanged();
                }

                if (prop._elevationNeedsChanged()) {
                    _emscriptenApi.propsApi.setElevation(propId, prop.getElevation());
                    prop._onElevationChanged();
                }

                if (prop._elevationModeNeedsChanged()) {
                    _emscriptenApi.propsApi.setElevationMode(propId, prop.getElevationMode());
                    prop._onElevationModeChanged();
                }

                if (prop._geometryIdNeedsChanged()) {
                    _emscriptenApi.propsApi.setGeometryId(propId, prop.getGeometryId());
                    prop._onGeometryIdChanged();
                }
            });
        }
    };

    this.setAutomaticIndoorMapPopulationEnabled = function(enabled) {
        if (_ready) {
            _emscriptenApi.propsApi.setAutomaticIndoorMapPopulationEnabled(enabled);
        }
        else {
            _pendingEnableDisable = enabled;
            _hasPendingEnableDisable = true;
        }
    };

    this.isAutomaticIndoorMapPopulationEnabled = function() {
        if (_ready) {
            return _emscriptenApi.propsApi.isAutomaticIndoorMapPopulationEnabled();
        }
        else {
            return _pendingEnableDisable;
        }
    };
};

PropModule.prototype = MapModule;
module.exports = PropModule;
