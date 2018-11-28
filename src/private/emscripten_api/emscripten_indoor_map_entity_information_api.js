var indoorMapEntities = require("../../public/indoorMapEntities/indoorMapEntities");

function EmscriptenIndoorMapEntityInformationApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {
    
    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _indoorEntityInformationApi_IndoorMapEntityInformationChangedCallback = cwrap("indoorEntityInformationApi_IndoorMapEntityInformationChangedCallback", null, ["number", "number"]);
    var _indoorEntityInformationApi_CreateIndoorMapEntityInformation = cwrap("indoorMapEntityInformation_CreateIndoorMapEntityInformation", "number", ["number","string"]);
    var _indoorEntityInformationApi_DestroyIndoorMapEntityInformation = cwrap("indoorMapEntityInformation_DestroyIndoorMapEntityInformation", null, ["number","number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityCountBuffer = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityCountBuffer", "number", ["number","number","number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityModelIds = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityModelIds", "number", ["number", "number", "number", "number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityIdBufferSize = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityIdBufferSize", "number", ["number","number", "number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntityInformationLoadState = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntityInformationLoadState", "number", ["number","number", "number"]);
    var _indoorEntityInformationApi_TryGetIndoorMapEntity = cwrap("indoorEntityInformationApi_TryGetIndoorMapEntity", "number", ["number", "number", "number", "number"]);

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

        var indoorMapEntityModelIdsBuf = _emscriptenMemory.createInt32Buffer(indoorMapEntityCount);

        //Getting IndoorMapEntityModelIds
        success = _indoorEntityInformationApi_TryGetIndoorMapEntityModelIds(
            _emscriptenApiPointer,
            IndoorMapEntityInformationId,
            indoorMapEntityModelIdsBuf.ptr,
            indoorMapEntityModelIdsBuf.element_count
        );

        var indoorMapEntityModelIds = _emscriptenMemory.consumeBufferToArray(indoorMapEntityModelIdsBuf);

        if (!success)
        {
            return null;
        }

        // Gets all indoorMapEntities from all Ids in indoorMapEntityModelIds
        var indoorMapEntitiesList = [];

        for (var entityIndex = 0; entityIndex < indoorMapEntityCount; ++entityIndex)
        {
            var indoorMapEntityStringIdSizeBuf = _emscriptenMemory.createInt32Buffer(1);

            success = _indoorEntityInformationApi_TryGetIndoorMapEntityIdBufferSize(
                _emscriptenApiPointer,
                indoorMapEntityModelIds[entityIndex],
                indoorMapEntityStringIdSizeBuf.ptr
            );

            var indoorMapEntityStringIdSize = _emscriptenMemory.consumeBufferToArray(indoorMapEntityStringIdSizeBuf)[0];
            
            if(!success)
            {
                return null;
            }
            
            var indoorMapEntityStringId = _emscriptenMemory.createInt8Buffer(indoorMapEntityStringIdSize);
            var indoorMapFloorIdBuf = _emscriptenMemory.createInt32Buffer(1);
            var positionLatLngBuf = _emscriptenMemory.createDoubleBuffer(2);

            success = _indoorEntityInformationApi_TryGetIndoorMapEntity(
                _emscriptenApiPointer,
                indoorMapEntityModelIds[entityIndex],
                indoorMapEntityStringId.ptr,
                indoorMapEntityStringIdSize,
                indoorMapFloorIdBuf.ptr,
                positionLatLngBuf.ptr
            );

            var indoorMapEntityId = _emscriptenMemory.consumeUtf8BufferToString(indoorMapEntityStringId);
            var indoorMapEntityFloorIdArray = _emscriptenMemory.consumeBufferToArray(indoorMapFloorIdBuf);
            var positionLatLngArray = _emscriptenMemory.consumeBufferToArray(positionLatLngBuf);

            if(!success)
            {
                return null;
            }

            var indoorMapEntityFloorId = indoorMapEntityFloorIdArray[0];

            var lat = positionLatLngArray[0];
            var lng = positionLatLngArray[1];
            var position = L.latLng(lat, lng);

            var entity = new indoorMapEntities.IndoorMapEntity(indoorMapEntityId, indoorMapEntityFloorId, position);
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