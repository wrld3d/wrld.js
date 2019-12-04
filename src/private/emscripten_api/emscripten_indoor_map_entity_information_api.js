var indoorMapEntities = require("../../public/indoorMapEntities/indoorMapEntities");

function EmscriptenIndoorMapEntityInformationApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {
    
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _indoorEntityInformationApi_IndoorMapEntityInformationChangedCallback = cwrap("indoorEntityInformationApi_IndoorMapEntityInformationChangedCallback", null, ["number", "number"]);
    var _indoorEntityInformationApi_CreateIndoorMapEntityInformation = cwrap("indoorMapEntityInformation_CreateIndoorMapEntityInformation", "number", ["number","string"]);
    var _indoorEntityInformationApi_DestroyIndoorMapEntityInformation = cwrap("indoorMapEntityInformation_DestroyIndoorMapEntityInformation", null, ["number","number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityCountBuffer = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityCountBuffer", "number", ["number","number","number"]);
        var _indoorEntityInformationApi_TryGetIndoorMapEntityInformationLoadState = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityInformationLoadState", "number", ["number","number", "number"]);
    
    var _indoorEntityInformationApi_TryGetIndoorMapEntityBuffersSize = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityBuffersSize", "number",  ["number", "number", "number", "number", "number", "number", "number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityModels = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityModels", "number" , ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]);

    this.registerIndoorMapEntityInformationChangedCallback = function(callback) {
        _indoorEntityInformationApi_IndoorMapEntityInformationChangedCallback(_emscriptenApiPointer, runtime.addFunction(callback));
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

        if (!success)
        {
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

        if (!success)
        {
            return null;
        }

        if (!success)
        {
            return null;
        }

        // Gets all indoorMapEntities from all Ids in indoorMapEntityModelIds
        var indoorMapEntitiesList = [];

        // indoorMapEntityIdsTotalSizeBuf + latLongsPerContourSizeBuf + latLongsSizeBuf as one array
        var indoorMapEntityIdsTotalSizeBuf = _emscriptenMemory.createInt32Buffer(1);
        var indoorMapEntityIdsSizesBuf = _emscriptenMemory.createInt32Buffer(indoorMapEntityCount);
        var latLongsPerContourSizeBuf = _emscriptenMemory.createInt32Buffer(1);
        var latLongsSizeBuf = _emscriptenMemory.createInt32Buffer(1);

        success = _indoorEntityInformationApi_TryGetIndoorMapEntityBuffersSize(
            _emscriptenApiPointer,
            IndoorMapEntityInformationId,
            indoorMapEntityCount,
            indoorMapEntityIdsTotalSizeBuf.ptr,
            indoorMapEntityIdsSizesBuf.ptr,
            latLongsPerContourSizeBuf.ptr,
            latLongsSizeBuf.ptr);
            
            
        var indoorMapEntityIdsTotalSize = _emscriptenMemory.consumeBufferToArray(indoorMapEntityIdsTotalSizeBuf);
        var indoorMapEntityStringIdSizes = _emscriptenMemory.consumeBufferToArray(indoorMapEntityIdsSizesBuf);
        var latLongsPerContourSize = _emscriptenMemory.consumeBufferToArray(latLongsPerContourSizeBuf);
        var latLongsSize = _emscriptenMemory.consumeBufferToArray(latLongsSizeBuf) * 2;

        if (!success)
        {
            return null;
        }

        var indoorMapEntityStringIdsBuf = _emscriptenMemory.createInt8Buffer(indoorMapEntityIdsTotalSize);

        var indoorMapFloorIdBuf = _emscriptenMemory.createInt32Buffer(indoorMapEntityCount);
        var positionLatLngBuf= _emscriptenMemory.createDoubleBuffer(indoorMapEntityCount * 2);

        var contoursPerPolygonBuf = _emscriptenMemory.createInt32Buffer(indoorMapEntityCount);
        var latLongsPerContourBuf = _emscriptenMemory.createInt32Buffer(latLongsPerContourSize);
        var latLongsBuf = _emscriptenMemory.createDoubleBuffer(latLongsSize);


        success = _indoorEntityInformationApi_TryGetIndoorMapEntityModels(
            _emscriptenApiPointer,
            IndoorMapEntityInformationId,
            indoorMapEntityCount,
            indoorMapEntityStringIdsBuf.ptr,
            indoorMapEntityIdsTotalSize,
            indoorMapFloorIdBuf.ptr,
            positionLatLngBuf.ptr,
            contoursPerPolygonBuf.ptr,
            latLongsPerContourBuf.ptr,
            latLongsPerContourSize,
            latLongsBuf.ptr,
            latLongsSize
        );

        var indoorMapEntityStringIds = _emscriptenMemory.consumeUtf8BufferToString(indoorMapEntityStringIdsBuf);
        var indoorMapEntityFloorIds = _emscriptenMemory.consumeBufferToArray(indoorMapFloorIdBuf);
        var positionLatLng = _emscriptenMemory.consumeBufferToArray(positionLatLngBuf);
        var contoursPerPolygon = _emscriptenMemory.consumeBufferToArray(contoursPerPolygonBuf);
        var latLongsPerContour = _emscriptenMemory.consumeBufferToArray(latLongsPerContourBuf);
        var latLongsDegrees = _emscriptenMemory.consumeBufferToArray(latLongsBuf);

        if (!success)
        {
            return null;
        }

        var idBufferHead = 0;
        var latLongsPerContourHead = 0;
        var latLongsDegreesHead = 0;

        // Change i, Index
        // indoorMapEntityStringIdSizes.length Should be the count of Entities
        for (var i = 0; i < indoorMapEntityStringIdSizes.length; i++) {
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

            var  latLongsPerContourEndIndex = latLongsPerContourHead + contourCount;
            for (var latLongsPerContourIndex = latLongsPerContourHead; latLongsPerContourIndex < latLongsPerContourEndIndex;  latLongsPerContourIndex++)
            {
                var contourPoints = [];
                
                var latLongsDegreesCount = latLongsPerContour[latLongsPerContourIndex];
                var latLongsDegreesEndIndex = latLongsDegreesHead + latLongsDegreesCount;

                for(var pointIndex = latLongsDegreesHead; pointIndex < latLongsDegreesEndIndex; pointIndex++)
                {
                    var lat = latLongsDegrees[(pointIndex * 2)];
                    var lng = latLongsDegrees[(pointIndex * 2) + 1];
                    contourPoints.push([lat, lng]);

                    latLongsDegreesHead++;
                }                
                polygonPoints.push(contourPoints);

                latLongsPerContourHead++;
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