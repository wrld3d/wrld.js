import L from "leaflet";

import MapModule from "./map_module";
import IdToObjectMap from "./id_to_object_map";

export function PropModule (emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _pendingProps = [];
    var _props = new IdToObjectMap();
    var _hasPendingEnableDisable = false;
    var _pendingEnableDisable = false;
    var _pendingServiceUrl = "";
    var _hasPendingServiceUrl = false;
    var _ready = false;

    var _createAndAdd = (prop) => {
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

    var _createAndAddArray = (propArray) => {
        var indoorMapIds = [];
        var indoorMapFloorIds = [];
        var names = [];
        var latitudes = [];
        var longitudes = [];
        var elevations = [];
        var elevationModes = [];
        var headings = [];
        var geometryIds = [];

        for (var propIndex = 0; propIndex < propArray.length; ++propIndex) {
            var prop = propArray[propIndex];
            indoorMapIds.push(prop.getIndoorMapId());
            indoorMapFloorIds.push(prop.getIndoorMapFloorId());
            names.push(prop.getName());
            latitudes.push(prop.getLocation().lat);
            longitudes.push(prop.getLocation().lng);
            elevations.push(prop.getElevation());
            elevationModes.push(prop.getElevationMode());
            headings.push(prop.getHeadingDegrees());
            geometryIds.push(prop.getGeometryId());
        }

        var propIds = _emscriptenApi.propsApi.createProps(indoorMapIds, indoorMapFloorIds, names, latitudes, longitudes, elevations, elevationModes, headings, geometryIds);

        for (propIndex = 0; propIndex < propIds.length; ++propIndex) {
            var propId = propIds[propIndex];
            _props.insertObject(propId, propArray[propIndex]);
        }
    };

    var _createPendingProps = () => {
        if (_pendingProps.length === 0) {
            return;
        }
        _createAndAddArray(_pendingProps);
        _pendingProps = [];
    };

    var _executeIndoorMapEntitySetPropsLoadedCallbacks = (indoorMapId, floorId) => {
        this.fire("indoormapentitysetpropsloaded", {indoorMapId: indoorMapId, floorId: floorId});
    };

    var _executeIndoorMapPopulationRequestCompletedCallbacks = (succeeded, httpStatusCode) => {
        this.fire("indoormappopulationrequestcomplete", {
            succeeded: (succeeded === 0 ? false : true),
            httpStatusCode: httpStatusCode
        });
    };

    this.addProp = (prop) => {
        if (_ready) {
            _createAndAdd(prop);
        }
        else {
            _pendingProps.push(prop);
        }
    };

    this.addProps = (propArray) => {
        if (_ready) {
            _createAndAddArray(propArray);
        }
        else {
            _pendingProps = _pendingProps.concat(propArray);
        }
    };

    this.removeProp = (prop) => {
        if (_ready && _pendingProps.length === 0) {
            var propId = _props.idForObject(prop);

            if (propId !== null) {
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

    this.removeProps = (propArray) => {
        var propIndex = 0;

        if (_ready && _pendingProps.length === 0) {
            var propIds = [];

            for (; propIndex < propArray.length; ++propIndex) {
                var propId = _props.idForObject(propArray[propIndex]);
                _props.removeObjectById(propId);
                propIds.push(parseInt(propId));
            }

            _emscriptenApi.propsApi.destroyProps(propIds);
        }
        else {
            for (; propIndex < propArray.length; ++propIndex) {
                var index = _pendingProps.indexOf(propArray[propIndex]);

                if (index > -1) {
                    _pendingProps.splice(index, 1);
                }
            }
        }
    };

    this.onInitialized = () => {
        _ready = true;
        _createPendingProps();

        if (_hasPendingEnableDisable) {
            this.setAutomaticIndoorMapPopulationEnabled(_pendingEnableDisable);
        }
        if (_hasPendingServiceUrl) {
            this.setIndoorMapPopulationServiceUrl(_pendingServiceUrl);
        }

        _emscriptenApi.propsApi.setIndoorMapEntitySetPropsLoadedCallback(_executeIndoorMapEntitySetPropsLoadedCallbacks);
        _emscriptenApi.propsApi.setIndoorMapPopulationRequestCompletedCallback(_executeIndoorMapPopulationRequestCompletedCallbacks);
        _emscriptenApi.propsApi.onInitialized();
    };

    this.onUpdate = (dt) => {
        if (_ready) {

            _props.forEachItem((propId, prop) => {
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

    this.setAutomaticIndoorMapPopulationEnabled = (enabled) => {
        if (_ready) {
            _emscriptenApi.propsApi.setAutomaticIndoorMapPopulationEnabled(enabled);
        }
        else {
            _pendingEnableDisable = enabled;
            _hasPendingEnableDisable = true;
        }
    };

    this.isAutomaticIndoorMapPopulationEnabled = () => {
        if (_ready) {
            return _emscriptenApi.propsApi.isAutomaticIndoorMapPopulationEnabled();
        }
        else {
            return _pendingEnableDisable;
        }
    };

    this.setIndoorMapPopulationServiceUrl = (serviceUrl) => {
        if (_ready) {
            return _emscriptenApi.propsApi.setIndoorMapPopulationServiceUrl(serviceUrl);
        }
        else {
            _pendingServiceUrl = serviceUrl;
            _hasPendingServiceUrl = true;
        }
    };

    this.getIndoorMapEntitySetProps = (indoorMapId, floorId) => {
        if (_ready) {
            return _emscriptenApi.propsApi.tryGetIndoorMapEntitySetProps(indoorMapId, floorId);
        }
        else {
            return null;
        }
    };
}

var PropPrototype = L.extend({}, MapModule, L.Mixin.Events);

PropModule.prototype = PropPrototype;

export default PropModule;
