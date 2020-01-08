var indoorMapEntities = require("../../public/indoorMapEntities/indoorMapEntities");

function EmscriptenIndoorMapEntityInformationApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {
    
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _indoorEntityInformationApi_IndoorMapEntityInformationChangedCallback = cwrap("indoorEntityInformationApi_IndoorMapEntityInformationChangedCallback", null, ["number", "number"]);
    var _indoorEntityInformationApi_CreateIndoorMapEntityInformation = cwrap("indoorMapEntityInformation_CreateIndoorMapEntityInformation", "number", ["number","string"]);
    var _indoorEntityInformationApi_DestroyIndoorMapEntityInformation = cwrap("indoorMapEntityInformation_DestroyIndoorMapEntityInformation", null, ["number","number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityCountBuffer = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityCountBuffer", "number", ["number","number","number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityInformationLoadState = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityInformationLoadState", "number", ["number","number", "number"]);
    
    var _indoorEntityInformationApi_TryGetIndoorMapEntityBuffersSize = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityBuffersSize", "number",  ["number", "number", "number", "number", "number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityModels = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityModels", "number" , ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]);

    this.registerIndoorMapEntityInformationChangedCallback = function(callback) {
        _indoorEntityInformationApi_IndoorMapEntityInformationChangedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback));
    };

    this.createIndoorMapEntityInformation = function(indoorEntityInformation) {
        var indoorEntityInformationId = 0;

        var indoorMapId = indoorEntityInformation.getIndoorMapId();

        indoorEntityInformationId = _indoorEntityInformationApi_CreateIndoorMapEntityInformation(
            _emscriptenApiPointer,
            indoorMapId);

        return indoorEntityInformationId;
    };

    this.destroyIndoorMapEntityInformation = function(IndoorMapEntityInformationId) {
        _indoorEntityInformationApi_DestroyIndoorMapEntityInformation(_emscriptenApiPointer, IndoorMapEntityInformationId);
    };

    this.tryGetIndoorMapEntityInformation = function(IndoorMapEntityInformationId) {

        //Get Current Load State
        var loadStateBuf = _emscriptenMemory.createInt32Buffer(1);

        var success = _indoorEntityInformationApi_TryGetIndoorMapEntityInformationLoadState(
            _emscriptenApiPointer,
            IndoorMapEntityInformationId,
            loadStateBuf.ptr
        );

        var indoorMapEntityInformationLoadState = _emscriptenMemory.consumeBufferToArray(loadStateBuf);

        if (!success) {
            return null;
        }

        //Get Count of IndoorMapEntities
        var indoorMapEntitiesCountBuf = _emscriptenMemory.createInt32Buffer(1);

        success = _indoorEntityInformationApi_TryGetIndoorMapEntityCountBuffer(
            _emscriptenApiPointer,
            IndoorMapEntityInformationId,
            indoorMapEntitiesCountBuf.ptr
        );

        var indoorMapEntityCount = _emscriptenMemory.consumeBufferToArray(indoorMapEntitiesCountBuf)[0];

        if (!success) {
            return null;
        }

        var indoorMapEntityBufferSizesBuf = _emscriptenMemory.createInt32Buffer(3);
        var indoorMapEntityIdsSizesBuf = _emscriptenMemory.createInt32Buffer(indoorMapEntityCount);
        
        success = _indoorEntityInformationApi_TryGetIndoorMapEntityBuffersSize(
            _emscriptenApiPointer,
            IndoorMapEntityInformationId,
            indoorMapEntityCount,
            indoorMapEntityIdsSizesBuf.ptr,
            indoorMapEntityBufferSizesBuf.ptr);
            
        var indoorMapEntityBufferSize = _emscriptenMemory.consumeBufferToArray(indoorMapEntityBufferSizesBuf);
        var indoorMapEntityStringIdSizes = _emscriptenMemory.consumeBufferToArray(indoorMapEntityIdsSizesBuf);
        
        var indoorMapEntityIdsTotalSize = indoorMapEntityBufferSize[0];
        var latLngsPerContourSize = indoorMapEntityBufferSize[1];
        var latLngsSize = indoorMapEntityBufferSize[2];
        
        if (!success) {
            return null;
        }
        
        var indoorMapEntityStringIdsBuf = _emscriptenMemory.createInt8Buffer(indoorMapEntityIdsTotalSize);
        
        var indoorMapFloorIdBuf = _emscriptenMemory.createInt32Buffer(indoorMapEntityCount);
        var positionLatLngBuf= _emscriptenMemory.createDoubleBuffer(indoorMapEntityCount * 2);

        var contoursPerPolygonBuf = _emscriptenMemory.createInt32Buffer(indoorMapEntityCount);
        var latLngsPerContourBuf = _emscriptenMemory.createInt32Buffer(latLngsPerContourSize);
        var latLngsBuf = _emscriptenMemory.createDoubleBuffer(latLngsSize);
        
        success = _indoorEntityInformationApi_TryGetIndoorMapEntityModels(
            _emscriptenApiPointer,
            IndoorMapEntityInformationId,
            indoorMapEntityCount,
            indoorMapEntityStringIdsBuf.ptr,
            indoorMapEntityIdsTotalSize,
            indoorMapFloorIdBuf.ptr,
            positionLatLngBuf.ptr,
            contoursPerPolygonBuf.ptr,
            latLngsPerContourBuf.ptr,
            latLngsPerContourSize,
            latLngsBuf.ptr,
            latLngsSize
        );
            
        var indoorMapEntityStringIds = _emscriptenMemory.consumeUtf8BufferToString(indoorMapEntityStringIdsBuf);
        var indoorMapEntityFloorIds = _emscriptenMemory.consumeBufferToArray(indoorMapFloorIdBuf);
        var positionLatLng = _emscriptenMemory.consumeBufferToArray(positionLatLngBuf);
        var contoursPerPolygon = _emscriptenMemory.consumeBufferToArray(contoursPerPolygonBuf);
        var latLngsPerContour = _emscriptenMemory.consumeBufferToArray(latLngsPerContourBuf);
        var latLngsDegrees = _emscriptenMemory.consumeBufferToArray(latLngsBuf);
        
        if (!success)
        {
            return null;
        }
        
        var indoorMapEntitiesList = [];

        var idBufferHead = 0;
        var latLngsPerContourHead = 0;
        var latLngsDegreesHead = 0;
        for (var i = 0; i < indoorMapEntityCount; i++) {
            var numCharsInId = indoorMapEntityStringIdSizes[i];
            var idBufferEnd = idBufferHead + numCharsInId;
            var indoorMapEntityId = indoorMapEntityStringIds.slice(idBufferHead, idBufferEnd);
            idBufferHead = idBufferEnd;

            var indoorMapEntityFloorId = indoorMapEntityFloorIds[i];

            var posLat = positionLatLng[2*i];
            var posLng = positionLatLng[2*i + 1];
            var position = L.latLng(posLat, posLng);

            var contourCount = contoursPerPolygon[i];
            var polygonPoints = [];

            var  latLngsPerContourEndIndex = latLngsPerContourHead + contourCount;
            for (var latLngsPerContourIndex = latLngsPerContourHead; latLngsPerContourIndex < latLngsPerContourEndIndex;  latLngsPerContourIndex++)
            {
                var contourPoints = [];
                
                var latLngsDegreesCount = latLngsPerContour[latLngsPerContourIndex];
                var latLngsDegreesEndIndex = latLngsDegreesHead + latLngsDegreesCount;

                for(var pointIndex = latLngsDegreesHead; pointIndex < latLngsDegreesEndIndex; pointIndex++)
                {
                    var lat = latLngsDegrees[(pointIndex * 2)];
                    var lng = latLngsDegrees[(pointIndex * 2) + 1];
                    contourPoints.push(L.latLng(lat, lng));

                    latLngsDegreesHead++;
                }                
                polygonPoints.push(contourPoints);

                latLngsPerContourHead++;
            }

            var entity = new indoorMapEntities.IndoorMapEntity(indoorMapEntityId, indoorMapEntityFloorId, position, polygonPoints);
            indoorMapEntitiesList.push(entity);
        }

        var output = {
            LoadState: indoorMapEntityInformationLoadState[0],
            IndoorMapEntities: indoorMapEntitiesList
        };

        return output;
    };
}

module.exports = EmscriptenIndoorMapEntityInformationApi;