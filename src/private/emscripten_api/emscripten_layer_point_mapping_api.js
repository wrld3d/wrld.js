function EmscriptenLayerPointMappingApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    
    var _createPointMapping = null;
    var _createPointMappingWithFloorIndex = null;
    var _removePointMapping = null;
    var _getPointsOnMapForLayer = null;

    this._createLatLngsNumberArray = function(latLngs) {
        var latLngsNumberArray = new Array(latLngs.length * 2);

        for(var i = 0; i < latLngs.length; i++) {
            var latLng = latLngs[i];

            var destBaseIndex = i * 2;
            latLngsNumberArray[destBaseIndex] = latLng.lat;
            latLngsNumberArray[destBaseIndex + 1] = latLng.lng;            
        }

        return latLngsNumberArray;
    };

    this.createPointMapping = function(layerId, elevation, elevationModeInt, indoorMapId, indoorMapFloorId, latLngs) {                
        _createPointMapping = _createPointMapping || cwrap("createLayerMapping", null, ["number", "number", "number", "number", "string", "number", "number", "number", "number"]);
              
        var latLngsNumberArray = this._createLatLngsNumberArray(latLngs);
        
        _emscriptenMemory.passDoubles(latLngsNumberArray, function(resultArray, arraySize) {            
            _createPointMapping(
                _emscriptenApiPointer, layerId, elevation, elevationModeInt, indoorMapId, indoorMapId.length, indoorMapFloorId, resultArray, arraySize);
        });        
    };

    this.createPointMappingWithFloorIndex = function(layerId, elevation, elevationModeInt, indoorMapId, indoorMapFloorIndex, latLngs) {                
        _createPointMappingWithFloorIndex = _createPointMappingWithFloorIndex || 
            cwrap("createLayerMappingWithFloorIndex", null, ["number", "number", "number", "number", "string", "number", "number", "number", "number"]);
              
        var latLngsNumberArray = this._createLatLngsNumberArray(latLngs);
        
        _emscriptenMemory.passDoubles(latLngsNumberArray, function(resultArray, arraySize) {            
            _createPointMappingWithFloorIndex(
                _emscriptenApiPointer, layerId, elevation, elevationModeInt, indoorMapId, indoorMapId.length, indoorMapFloorIndex, resultArray, arraySize);
        });        
    };

    this.removePointMapping = function(layerId) {
        _removePointMapping = _removePointMapping || cwrap("removeLayerMapping", null, ["number", "number"]);

        _removePointMapping(_emscriptenApiPointer, layerId);
    };

    this.getLatLngsForLayer = function(layerId, latLngCount) {                
        _getPointsOnMapForLayer = _getPointsOnMapForLayer || cwrap("getPointsOnMapForLayer", "number", ["number", "number", "number"]);
        var resultLatLngAltDoubles = new Array(latLngCount * 3);

        _emscriptenMemory.passDoubles(resultLatLngAltDoubles, function(resultArray, arraySize) {
            var expectedArrayLength = _getPointsOnMapForLayer(_emscriptenApiPointer, layerId, resultArray);

            if(resultLatLngAltDoubles.length !== expectedArrayLength) {
                throw new Error("_getPointsOnMapForLayer : unexpected array length. Expected '" + expectedArrayLength + "' but was '" + resultLatLngAltDoubles.length + "'.");
            }

            resultLatLngAltDoubles = _emscriptenMemory.readDoubles(resultArray, expectedArrayLength);
        });

        var resultLatLngAlts = new Array(latLngCount);
        var resultIndex = 0;

        for(var i = 0; i < resultLatLngAltDoubles.length; i += 3) {
            var lat = resultLatLngAltDoubles[i];
            var lng = resultLatLngAltDoubles[i + 1];
            var alt = resultLatLngAltDoubles[i + 2];
            
            resultLatLngAlts[resultIndex++] = L.latLng(lat, lng, alt);
        }

        return resultLatLngAlts;
    };    
}

module.exports = EmscriptenLayerPointMappingApi;