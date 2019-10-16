var OutlinePolygon = require("../../public/outlines/outline_polygon");
var OutlinePolygonRing = require("../../public/outlines/outline_polygon_ring");

function EmscriptenIndoorMapEntityOutlineInformationApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _indoorMapEntityOutlineInformationApi_IndoorMapEntityOutlineInformationLoadedCallback = cwrap("indoorMapEntityOutlineInformationApi_IndoorMapEntityOutlineInformationLoadedCallback", null, ["number", "number"]);
    var _indoorMapEntityOutlineInformationApi_CreateIndoorMapEntityOutlineInformation = cwrap("indoorMapEntityOutlineInformationApi_CreateIndoorMapEntityOutlineInformation", "number", ["number","string", "number"]);
    var _indoorMapEntityOutlineInformationApi_DestroyIndoorMapEntityOutlineInformation = cwrap("indoorMapEntityOutlineInformationApi_DestroyIndoorMapEntityOutlineInformation", null, ["number","number"]);
    var _indoorMapEntityOutlineInformationApi_GetIndoorMapEntityOutlineInformationLoaded = cwrap("indoorMapEntityOutlineInformationApi_GetIndoorMapEntityOutlineInformationLoaded", "number", ["number", "number"]);

    var _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityBufferSize = cwrap("indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityBufferSize", "number", ["number", "number", "number"]);
    var _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityIdAndNumberOfPolygons = cwrap("indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityIdAndNumberOfPolygons","number", ["number", "number", "number", "number", "number"] );
    var _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityOutlinePointCount = cwrap("indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityOutlinePointCount", "number",["number", "number", "number", "number", "number"]);
    var _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityOutlinePoints = cwrap("indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityOutlinePoints", "number",["number", "number", "number", "number", "number", "number"]);
    var _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityPolygonNumberOfInnerPolygonsRings = cwrap("indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityPolygonNumberOfInnerPolygonsRings", "number", ["number", "number", "number", "number", "number"]);
    var _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityInnerRingPointCount = cwrap("indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityInnerRingPointCount", "number",["number", "number", "number", "number", "number", "number"]);
    var _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityInnerRingPoints = cwrap("indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityInnerRingPoints", "number", ["number", "number", "number", "number", "number", "number", "number"]);

    this.registerIndoorMapEntityOutlineInformationLoadedCallback = function(callback) {
        _indoorMapEntityOutlineInformationApi_IndoorMapEntityOutlineInformationLoadedCallback(_emscriptenApiPointer, runtime.addFunction(callback));
    };

    this.createIndoorMapEntityOutlineInformation = function(indoorMapEntityOutlineInformation) {
        var indoorMapId = indoorMapEntityOutlineInformation.getIndoorMapId();
        var indoorMapFloorId = indoorMapEntityOutlineInformation.getIndoorMapFloorId();

        var indoorMapEntityOutlineInformationId = _indoorMapEntityOutlineInformationApi_CreateIndoorMapEntityOutlineInformation(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapFloorId);

        return indoorMapEntityOutlineInformationId;
    };

    this.destroyIndoorMapEntityOutlineInformation = function(indoorMapEntityOutlineInformationId) {
        _indoorMapEntityOutlineInformationApi_DestroyIndoorMapEntityOutlineInformation(_emscriptenApiPointer, indoorMapEntityOutlineInformationId);
    };

    this.getIndoorMapEntityOutlineInformationLoaded = function(indoorMapEntityOutlineInformationId)
    {
        return _indoorMapEntityOutlineInformationApi_GetIndoorMapEntityOutlineInformationLoaded(_emscriptenApiPointer, indoorMapEntityOutlineInformationId);
    };

    this.tryGetIndoorMapEntityOutlineInformation = function(indoorMapEntityOutlineInformationId){
        ///Get Mapped Data.

        //Count of Entities.
        var indoorMapEntityCountBuf = _emscriptenMemory.createInt32Buffer(1);

        var success = _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityBufferSize(
            _emscriptenApiPointer,
            indoorMapEntityOutlineInformationId,
            indoorMapEntityCountBuf.ptr
        );

        var indoorMapFloorOutlinesCount = _emscriptenMemory.consumeBufferToArray(indoorMapEntityCountBuf)[0];

        if (!success)
        {
            return null;
        }

        var entityPolygonPair = [];
        for (var entityIndex = 0; entityIndex < indoorMapFloorOutlinesCount; entityIndex++) {
            //Get Entity sizes
            var indoorMapEntityIdBuf = _emscriptenMemory.createInt32Buffer(1);
            var indoorMapEntityNumOfPolyBuf = _emscriptenMemory.createInt32Buffer(1);

            success = _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityIdAndNumberOfPolygons(
                _emscriptenApiPointer,
                indoorMapEntityOutlineInformationId,
                entityIndex,
                indoorMapEntityIdBuf.ptr,
                indoorMapEntityNumOfPolyBuf.ptr
            );

            var indoorMapEntityId = _emscriptenMemory.consumeBufferToArray(indoorMapEntityIdBuf)[0];
            var indoorMapEntityNumOfPoly = _emscriptenMemory.consumeBufferToArray(indoorMapEntityNumOfPolyBuf)[0];
            
            if (!success)
            {
                return null;
            }
            
            var polygons = [];
            for (var polygonIndex = 0; polygonIndex < indoorMapEntityNumOfPoly; polygonIndex++) {
                // Get OutlineRing.
                // Get number of points.
                var indoorMapEntityOutlineRingPointCountBuf = _emscriptenMemory.createInt32Buffer(1);
                
                success = _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityOutlinePointCount(
                    _emscriptenApiPointer,
                    indoorMapEntityOutlineInformationId,
                    entityIndex,
                    polygonIndex,
                    indoorMapEntityOutlineRingPointCountBuf.ptr
                );
                
                var entityOutlineRingPointCount = _emscriptenMemory.consumeBufferToArray(indoorMapEntityOutlineRingPointCountBuf)[0];
                

                if (!success)
                {
                    return null;
                }

                // Get the points.
                var entityOutlineRingPointsBuf = _emscriptenMemory.createDoubleBuffer(2 * entityOutlineRingPointCount);
                
                success = _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityOutlinePoints(
                    _emscriptenApiPointer,
                    indoorMapEntityOutlineInformationId,
                    entityIndex,
                    polygonIndex,
                    entityOutlineRingPointsBuf.ptr,
                    entityOutlineRingPointCount
                );

                var entityOutlineRingPoints = _emscriptenMemory.consumeBufferToArray(entityOutlineRingPointsBuf);

                if (!success)
                {
                    return null;
                }

                // Our Outline Polygon we want to save.
                var outlinePolygonRing = _getOutlinePolygonRing(entityOutlineRingPoints,entityOutlineRingPointCount) ;

                // Get Number of Inner Rings.
                var indoorMapEntityInnerRingCountBuf = _emscriptenMemory.createInt32Buffer(1);

                success = _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityPolygonNumberOfInnerPolygonsRings(
                    _emscriptenApiPointer,
                    indoorMapEntityOutlineInformationId,
                    entityIndex,
                    polygonIndex,
                    indoorMapEntityInnerRingCountBuf.ptr
                );

                var indoorMapEntityInnerRingCount = _emscriptenMemory.consumeBufferToArray(indoorMapEntityInnerRingCountBuf)[0];

                if (!success)
                {
                    return null;
                }
                
                // The actual inner Rings
                var innerPolygonsRings = [];
                // Loop though each inner ring.
                for(var innerPolygonIndex = 0; innerPolygonIndex < indoorMapEntityInnerRingCount; innerPolygonIndex++)
                {
                    // Get Number of Points.
                    var indoorMapEntityInnerRingPointCountBuf = _emscriptenMemory.createInt32Buffer(1);
                
                    success = _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityInnerRingPointCount(
                        _emscriptenApiPointer,
                        indoorMapEntityOutlineInformationId,
                        entityIndex,
                        polygonIndex,
                        innerPolygonIndex,
                        indoorMapEntityInnerRingPointCountBuf.ptr
                    );
                    
                    var entityInnerRingPointCount = _emscriptenMemory.consumeBufferToArray(indoorMapEntityInnerRingPointCountBuf)[0];
                    if (!success)
                    {
                        return null;
                    }
                    // Get the points.
                    var entityInnerRingPointsBuf = _emscriptenMemory.createDoubleBuffer(2 * entityInnerRingPointCount);
                
                    success = _indoorMapEntityOutlineInformationApi_TryGetIndoorMapEntityInnerRingPoints(
                        _emscriptenApiPointer,
                        indoorMapEntityOutlineInformationId,
                        entityIndex,
                        polygonIndex,
                        innerPolygonIndex,
                        entityInnerRingPointsBuf.ptr,
                        entityInnerRingPointCount
                    );

                    var entityInnerRingPoints = _emscriptenMemory.consumeBufferToArray(entityInnerRingPointsBuf);
    
                    if (!success)
                    {
                        return null;
                    }
    
                    // Our inner Polygon Rings we want to save.
                    innerPolygonsRings.push(_getOutlinePolygonRing(entityInnerRingPoints, entityInnerRingPointCount));
                }
                polygons.push(new OutlinePolygon(outlinePolygonRing, innerPolygonsRings));
            }

            var data = {
                entityId: indoorMapEntityId,
                polygons: polygons
            } ;

            entityPolygonPair.push(data);
        }

        return entityPolygonPair;
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

module.exports = EmscriptenIndoorMapEntityOutlineInformationApi;
