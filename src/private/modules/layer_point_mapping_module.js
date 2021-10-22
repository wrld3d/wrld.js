import L from "leaflet";

import MapModule from "./map_module";
import { getIndoorMapId, getIndoorMapFloorIndex, getIndoorMapFloorId } from "../indoor_map_layer_options";
import { getElevationModeInt } from "../elevation_mode";

var _undefinedPoint = L.point(-100, -100);

function LayerPointMappingModule (emscriptenApi) {
    var _emscriptenApi = emscriptenApi;
    var _spacesApi = null;
    var _ready = false;
    var _layerToLatLngsMapping = {};
    var _pendingMappings = [];

    this.onInitialized = () => {
        _ready = true;
        _spacesApi = _emscriptenApi.spacesApi;
        this._createPendingLayers();
    };       

    // https://stackoverflow.com/a/15030117
    var _flatten = (arr) => arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? _flatten(toFlatten) : toFlatten);
    }, []);

    this._getLayerId = (layer) => L.stamp(layer);

    this._useWrldSdkPointMappingForLayer = (layer) => {
        if (typeof layer.getLatLng !== "function" && typeof layer.getLatLngs !== "function") {
            return false;
        }
        return true;
    };

    this._createAndAdd = (layer) => {
        if (!this._useWrldSdkPointMappingForLayer(layer)) {
            return;
        }

        var id = this._getLayerId(layer);

        if(id in _layerToLatLngsMapping) {
            this.removePointMapping(layer);
        }

        var sourceLatLngArray = typeof layer.getLatLngs === "function" ? layer.getLatLngs() : [ layer.getLatLng() ];
        var latLngsFlatArray = _flatten(sourceLatLngArray);

        var elevation = layer.options.elevation || 0.0;
        
        var elevationModeInt = getElevationModeInt(layer.options.elevationMode);

        var api = _emscriptenApi.layerPointMappingApi;
        
        // due to legacy uses where positions were defined using floor index (poi tool, for example)
        // check to see if we're dealing with a floor index, and use that instead. Floor id & index 
        // have different semantics, so they cannot be used interchangeably.
        var indoorMapId = getIndoorMapId(layer);
        var indoorMapFloorIndex = getIndoorMapFloorIndex(layer);
        var indoorMapWithFloorIndex = indoorMapId !== null && indoorMapFloorIndex !== null;

        if(indoorMapWithFloorIndex === true) {
            api.createPointMappingWithFloorIndex(id, elevation, elevationModeInt, indoorMapId, indoorMapFloorIndex, latLngsFlatArray);
        } else {
            var indoorMapFloorId = getIndoorMapFloorId(layer);
            var indoorOptionsValid = indoorMapId !== null && indoorMapFloorId !== null;            

            // in the case where _either_ the indoor map id or the floor id is invalid, use neither (defaults to outside)
            var sanitisedIndoorMapId = indoorOptionsValid === true ? indoorMapId : "";
            var sanitisedIndoorMapFloorId = indoorOptionsValid === true ? indoorMapFloorId : 0;

            api.createPointMapping(id, elevation, elevationModeInt, sanitisedIndoorMapId, sanitisedIndoorMapFloorId, latLngsFlatArray);
        }
        
        _layerToLatLngsMapping[id] = api.getLatLngsForLayer(id, latLngsFlatArray.length);
    };

    this._createPendingLayers = () => {
        _pendingMappings.forEach((layer) => {
                this._createAndAdd(layer);
            });
        _pendingMappings = [];
    };

    this.createPointMapping = (layer) => {
        if (!this._useWrldSdkPointMappingForLayer(layer)) {
            return;
        }

        if(!_ready) {
            _pendingMappings.push(layer);
            return;
        }

        this._createAndAdd(layer);
    };

    this.removePointMapping = (layer) => {
        if(!_ready) {
            var index = _pendingMappings.indexOf(layer);
            if (index > -1) {
                _pendingMappings.splice(index, 1);
            }

            return;
        }

        var layerId = this._getLayerId(layer);

        // try to remove the mapping for this layer, even if it doesn't follow the rules that
        // would permit a mapping to be created in the first place. This is to guard against a 
        // user mutating the layer options _after_ adding it to the map
        if (layerId in _layerToLatLngsMapping) {
            _emscriptenApi.layerPointMappingApi.removePointMapping(layerId);
            delete _layerToLatLngsMapping[layerId];
        }
    };

    this._updateMappings = () => {
        if (!_ready) {
            return;
        }

        var api = _emscriptenApi.layerPointMappingApi;

        for (var id in _layerToLatLngsMapping) {
            var latLngCount = _layerToLatLngsMapping[id].length;

            _layerToLatLngsMapping[id] = api.getLatLngsForLayer(id, latLngCount);
        }
    };

    this.onDraw = () => {
        if (!_ready) {
            return;
        }

        this._updateMappings();
    };

    this._getDefaultLatLngsFromLayer = (layer) => {
        if (typeof layer.getLatLngs === "function") {
            return layer.getLatLngs();
        }

        if (typeof layer.getLatLng === "function") {
            return [layer.getLatLng()];
        }

        return null;
    };

    this.latLngsForLayer = (layer) => {        
        if(!_ready) {            
            return this._getDefaultLatLngsFromLayer(layer);
        }

        // todo js_loc: this assumes we've called onDraw() at least once to populate contents
        // ... depending on ordering of calls, we may have to gate this & do an update on first tick
        var layerId = this._getLayerId(layer);
    
        if (layerId in _layerToLatLngsMapping) {
            return _layerToLatLngsMapping[layerId];
        }
        
        // fall back to leaflet defaults
        return this._getDefaultLatLngsFromLayer(layer);
    };

    this.projectLatlngs = (layer, latlngs, result, projectedBounds) => {
        if(!_ready) {
            return false;
        }
        
        if(!this._useWrldSdkPointMappingForLayer(layer)) {
            return false;
        }
	
        // the source latlngs are in a jagged array
        // retrieve the latlngs for our flat array containining values passed from C++
        var associatedFlatLatlngArray = this.latLngsForLayer(layer);
    
        if(associatedFlatLatlngArray === null) {
            return false;
        }
         
        var currentFlatIndex = 0;
        this._projectLatlngsRecursive(latlngs, associatedFlatLatlngArray, currentFlatIndex, result, projectedBounds);

        return true;
    };

    this._latLngToLayerPoint = (latlng) => {
        return (_ready) ? _spacesApi.worldToScreen(latlng).toPoint() : _undefinedPoint;
    };

    this._projectLatlngsRecursive = (originalLatlngs, associatedFlatLatlngArray, currentFlatIndex, result, projectedBounds) => {
        var flat = originalLatlngs[0] instanceof L.LatLng,
            len = originalLatlngs.length,
            i, ring;

        if (flat) {
            ring = [];
            for (i = 0; i < len; i++, currentFlatIndex++) {                         
                // the goal here is to do a few things:
                //  1. take the source (raw) leaflet LatLongAlts, and figure out the corresponding C++ IPointOnMap LatLongAlts
                //  2. convert the corresponding LatLongAlt => screen coordinates
                // todo: we end up jumping back to emscripten spaces api after doing this (via latLngToLayerPoint), so it may be a good idea
                // to allow just passing back the screen space positions in the C++ code
                var cppLatLngAlt = associatedFlatLatlngArray[currentFlatIndex];
                ring[i] = this._latLngToLayerPoint(cppLatLngAlt);
                projectedBounds.extend(ring[i]);
            }
            result.push(ring);
        } else {
            for (i = 0; i < len; i++) {
                currentFlatIndex = this._projectLatlngsRecursive(
                    originalLatlngs[i], associatedFlatLatlngArray, currentFlatIndex, result, projectedBounds);
            }
        }

        return currentFlatIndex;
    };
}

LayerPointMappingModule.prototype = MapModule;

export default LayerPointMappingModule;