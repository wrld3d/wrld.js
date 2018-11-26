var indoorMapEntities = require("../../public/indoorMapEntities/indoorMapEntities");

function EmscriptenIndoorMapEntityInformationApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {
    
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _indoorEntityInformationApi_IndoorMapEntityInformationReceivedCallback = cwrap("indoorEntityInformationApi_IndoorMapEntityInformationReceivedCallback", null, ["number", "number"]);
    var _indoorEntityInformationApi_CreateIndoorMapEntityInformation = cwrap("indoorMapEntityInformation_CreateIndoorMapEntityInformation", "number", ["number","string"]);
    var _indoorEntityInformationApi_DestroyIndoorMapEntityInformation = cwrap("indoorMapEntityInformation_DestroyIndoorMapEntityInformation", null, ["number","number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityInformationBufferSizes = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityInformationBufferSizes", "number", ["number","number","number","number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntities = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntities", "number", ["number", "number", "number", "number", "number", "number", "number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityIdBufferSize = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityIdBufferSize", "number", ["number","number", "number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityId = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityId", "number", ["number", "number", "number", "number"]);

    this.registerIndoorMapEntityInformationReceivedCallback = function(callback) {
        _indoorEntityInformationApi_IndoorMapEntityInformationReceivedCallback(_emscriptenApiPointer, runtime.addFunction(callback));
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

        var indoorMapEntityIdsSizeBuf = _emscriptenMemory.createInt32Buffer(1);
        var indoorMapEntitiesSizeBuf = _emscriptenMemory.createInt32Buffer(1);

        var success = _indoorEntityInformationApi_TryGetIndoorMapEntityInformationBufferSizes(
            _emscriptenApiPointer,
            IndoorMapEntityInformationId,
            indoorMapEntityIdsSizeBuf.ptr, 
            indoorMapEntitiesSizeBuf.ptr
        );

        var IndoorMapEntitiesSize = _emscriptenMemory.consumeBufferToArray(indoorMapEntitiesSizeBuf)[0];
        var IndoorMapEntityIdsCountSize = _emscriptenMemory.consumeBufferToArray(indoorMapEntityIdsSizeBuf)[0];

        if (!success)
        {
            return null;
        }
        
        var entityIdsBuf = _emscriptenMemory.createInt32Buffer(IndoorMapEntityIdsCountSize);
        var floorIdBuf = _emscriptenMemory.createInt32Buffer(IndoorMapEntityIdsCountSize);
        var positionLatLngBuf = _emscriptenMemory.createDoubleBuffer(IndoorMapEntitiesSize * 2);
        var loadStateBuf = _emscriptenMemory.createInt32Buffer(1);

        success = _indoorEntityInformationApi_TryGetIndoorMapEntities(
            _emscriptenApiPointer,
            IndoorMapEntityInformationId,
            entityIdsBuf.ptr,
            entityIdsBuf.element_count,
            floorIdBuf.ptr,
            floorIdBuf.element_count,
            positionLatLngBuf.ptr,
            positionLatLngBuf.element_count,
            loadStateBuf.ptr
        );

        var entityIntIds = _emscriptenMemory.consumeBufferToArray(entityIdsBuf);
        var entityFloorIds = _emscriptenMemory.consumeBufferToArray(floorIdBuf);
        var positionLatLngDoubles = _emscriptenMemory.consumeBufferToArray(positionLatLngBuf);
        var loadState = _emscriptenMemory.consumeBufferToArray(loadStateBuf);

        var indoorMapEntitiesList = [];

        for (var entityIndex = 0; entityIndex < IndoorMapEntitiesSize; ++entityIndex)
        {
            var indoorMapEntitySizeBuf = _emscriptenMemory.createInt32Buffer(1);
            _indoorEntityInformationApi_TryGetIndoorMapEntityIdBufferSize(
                _emscriptenApiPointer,
                entityIntIds[entityIndex],
                indoorMapEntitySizeBuf.ptr
            );

            var indoorMapEntitySize = _emscriptenMemory.consumeBufferToArray(indoorMapEntitySizeBuf)[0];
            var indoorMapEntityBuf = _emscriptenMemory.createInt8Buffer(indoorMapEntitySize);
            
            success = _indoorEntityInformationApi_TryGetIndoorMapEntityId(
                _emscriptenApiPointer,
                entityIntIds[entityIndex],
                indoorMapEntityBuf.ptr,
                indoorMapEntitySize
            );
            var indoorMapEntityId = _emscriptenMemory.consumeUtf8BufferToString(indoorMapEntityBuf);
            var indoorMapEntityFloorId = entityFloorIds[entityIndex];

            var lat = positionLatLngDoubles[ ( entityIndex * 2 ) ];
            var lng = positionLatLngDoubles[ ( entityIndex * 2 ) + 1];
            var position = L.latLng(lat, lng);

            var entity = new indoorMapEntities.IndoorMapEntity(indoorMapEntityId, indoorMapEntityFloorId, position);
            indoorMapEntitiesList.push(entity);
        }

        var output = {
            LoadState: loadState[0],
            IndoorMapEntities: indoorMapEntitiesList
        };

        return output;
    };
}

module.exports = EmscriptenIndoorMapEntityInformationApi;
