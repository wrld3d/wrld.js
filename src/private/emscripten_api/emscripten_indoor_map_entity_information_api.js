var indoorMapEntities = require("../../public/indoorMapEntities/indoorMapEntities");
var OutlinePolygon = require("../../public/outlines/outline_polygon");
var OutlinePolygonRing = require("../../public/outlines/outline_polygon_ring");

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

    var _indoorEntityInformationApi_TryGetNumberOfPolygons = cwrap("indoorEntityInformationApi_TryGetNumberOfPolygons", "number", ["number", "number", "number"]);
    var _indoorEntityInformationApi_TryGetSizeOfPolygonOuterRing = cwrap("indoorEntityInformationApi_TryGetSizeOfPolygonOuterRing", "number", ["number", "number", "number", "number"]);
    var _indoorEntityInformationApi_TryGetPolygonOuterRing = cwrap("indoorEntityInformationApi_TryGetPolygonOuterRing","number",["number", "number", "number", "number"]);
    var _indoorEntityInformationApi_TryGetPolygonInnerRingCount = cwrap("indoorEntityInformationApi_TryGetPolygonInnerRingCount","number",["number", "number", "number", "number"]);
    var _indoorEntityInformationApi_TryGetPolygonInnerRingPointCount = cwrap("indoorEntityInformationApi_TryGetPolygonInnerRingPointCount","number",["number", "number", "number", "number", "number"]);
    var _indoorEntityInformationApi_TryGetPolygonInnerRing = cwrap("indoorEntityInformationApi_TryGetPolygonInnerRing","number",["number", "number", "number", "number", "number"]);

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

            var Outlines = _GetOutlines(indoorMapEntityModelIds[entityIndex]);

            if(Outlines === null)
            {
                return null;
            }

            var entity = new indoorMapEntities.IndoorMapEntity(indoorMapEntityId, indoorMapEntityFloorId, position, Outlines);
            indoorMapEntitiesList.push(entity);
        }

        var output = {
            LoadState: indoorMapEntityInformationLoadState[0],
            IndoorMapEntities: indoorMapEntitiesList
        };

        return output;
    };

    var _GetOutlines = function(indoorMapEntityModelId) {
        var Outlines = [];

        var indoorMapEntityNumOfOutlinesBuf = _emscriptenMemory.createInt32Buffer(1);

        var success = _indoorEntityInformationApi_TryGetNumberOfPolygons(
            _emscriptenApiPointer,
            indoorMapEntityModelId, 
            indoorMapEntityNumOfOutlinesBuf.ptr
        );

        var indoorMapEntityNumOfOutlines = _emscriptenMemory.consumeBufferToArray(indoorMapEntityNumOfOutlinesBuf)[0];

        if (!success)
        {
            return null;
        }

        for(var outlineIndex = 0; outlineIndex < indoorMapEntityNumOfOutlines; outlineIndex++)
        {
            var outerRingPointCountBuf = _emscriptenMemory.createInt32Buffer(1);

            success = _indoorEntityInformationApi_TryGetSizeOfPolygonOuterRing(
                _emscriptenApiPointer,
                indoorMapEntityModelId, 
                outlineIndex,
                outerRingPointCountBuf.ptr
            );
            var outerRingPointCount = _emscriptenMemory.consumeBufferToArray(outerRingPointCountBuf)[0];

            if (!success)
            {
                return null;
            }

            var outerRingPointsBuf = _emscriptenMemory.createDoubleBuffer(2 * outerRingPointCount);
                
            success = _indoorEntityInformationApi_TryGetPolygonOuterRing(
                _emscriptenApiPointer,
                indoorMapEntityModelId,
                outlineIndex,
                outerRingPointsBuf.ptr
            );

            var entityOutlineRingPoints = _emscriptenMemory.consumeBufferToArray(outerRingPointsBuf);

            if (!success)
            {
                return null;
            }

            var outlinePolygonRing = _getOutlinePolygonRing(entityOutlineRingPoints, outerRingPointCount);

            var innerRingCountBuf = _emscriptenMemory.createInt32Buffer(1);

            success = _indoorEntityInformationApi_TryGetPolygonInnerRingCount(
                _emscriptenApiPointer,
                indoorMapEntityModelId,
                outlineIndex,
                innerRingCountBuf.ptr
            );

            var innerRingCount = _emscriptenMemory.consumeBufferToArray(innerRingCountBuf)[0];

            if (!success)
            {
                return null;
            }

            var innerRings = [];
            // Loop though each inner ring.
            for(var innerRingIndex = 0; innerRingIndex < innerRingCount; innerRingIndex++)
            {
                // Get Number of Points.
                var innerRingPointCountBuf = _emscriptenMemory.createInt32Buffer(1);
                
                success = _indoorEntityInformationApi_TryGetPolygonInnerRingPointCount(
                    _emscriptenApiPointer,
                    indoorMapEntityModelId,
                    outlineIndex,
                    innerRingIndex,
                    innerRingPointCountBuf.ptr
                );
                
                var innerRingPointCount = _emscriptenMemory.consumeBufferToArray(innerRingPointCountBuf)[0];
                
                if (!success)
                {
                    return null;
                }
                // Get the points.
                var innerRingPointsBuf = _emscriptenMemory.createDoubleBuffer(2 * innerRingPointCount);
            
                success = _indoorEntityInformationApi_TryGetPolygonInnerRing(
                    _emscriptenApiPointer,
                    indoorMapEntityModelId,
                    outlineIndex,
                    innerRingIndex,
                    innerRingPointsBuf.ptr
                );

                var innerRingPoints = _emscriptenMemory.consumeBufferToArray(innerRingPointsBuf);

                if (!success)
                {
                    return null;
                }

                // Our inner Polygon Rings we want to save.
                innerRings.push(_getOutlinePolygonRing(innerRingPoints, innerRingPointCount));
            }

            Outlines.push(new OutlinePolygon(outlinePolygonRing, innerRings));

        }

        return Outlines;
    };


    var _getOutlinePolygonRing = function(doublesLatLngArray, pointCount) {
        var OutlinePolygonRingPoints = [];

        for(var pointIndex = 0; pointIndex < pointCount; pointIndex++)
        {
            var lat = doublesLatLngArray[(pointIndex * 2)];
            var lng = doublesLatLngArray[(pointIndex * 2) + 1];
            OutlinePolygonRingPoints.push(L.latLng(lat, lng));
        }

        return new OutlinePolygonRing(OutlinePolygonRingPoints);
    };

}

module.exports = EmscriptenIndoorMapEntityInformationApi;