var IndoorMapFloorOutlinePolygon = require("../../public/indoorMapFloorOutlines/indoor_map_floor_outline_polygon");
var IndoorMapFloorOutlinePolygonRing = require("../../public/indoorMapFloorOutlines/indoor_map_floor_outline_polygon_ring");

function EmscriptenIndoorMapFloorOutlineInformationApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _indoorMapFloorOutlineInformationApi_IndoorMapFloorOutlineInformationLoadedCallback = cwrap("indoorMapFloorOutlineInformationApi_IndoorMapFloorOutlineInformationLoadedCallback", null, ["number", "number"]);
    var _indoorMapFloorOutlineInformationApi_CreateIndoorMapFloorOutlineInformation = cwrap("indoorMapFloorOutlineInformationApi_CreateIndoorMapFloorOutlineInformation", "number", ["number","string", "number"]);
    var _indoorMapFloorOutlineInformationApi_DestroyIndoorMapFloorOutlineInformation = cwrap("indoorMapFloorOutlineInformationApi_DestroyIndoorMapFloorOutlineInformation", null, ["number","number"]);
    var _indoorMapFloorOutlineInformationApi_GetIndoorMapFloorOutlineInformationLoaded = cwrap("indoorMapFloorOutlineInformationApi_GetIndoorMapFloorOutlineInformationLoaded", "number", ["number","number"]);
    var _indoorMapFloorOutlineInformationApi_TryGetIndoorMapFloorOutlineBufferSize = cwrap("indoorMapFloorOutlineInformationApi_TryGetIndoorMapFloorOutlineBufferSize", "number", ["number","number","number"]);
    var _indoorMapFloorOutlineInformationApi_TryGetIndoorMapFloorOutlinePolygonBufferSizes = cwrap("indoorMapFloorOutlineInformationApi_TryGetIndoorMapFloorOutlinePolygonBufferSizes", "number", ["number","number","number","number","number","number"]);
    var _indoorMapFloorOutlineInformationApi_TryGetIndoorMapFloorOutlinePolygon = cwrap("indoorMapFloorOutlineInformationApi_TryGetIndoorMapFloorOutlinePolygon", "number", ["number","number","number","number","number","number","number","number"]);

    this.registerIndoorMapFloorOutlineInformationLoadedCallback = function(callback) {
        _indoorMapFloorOutlineInformationApi_IndoorMapFloorOutlineInformationLoadedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback));
    };

    this.createIndoorMapFloorOutlineInformation = function(indoorMapFloorOutlineInformation) {
        var indoorMapId = indoorMapFloorOutlineInformation.getIndoorMapId();
        var indoorMapFloorId = indoorMapFloorOutlineInformation.getIndoorMapFloorId();

        var indoorMapFloorOutlineInformationId = _indoorMapFloorOutlineInformationApi_CreateIndoorMapFloorOutlineInformation(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapFloorId);

        return indoorMapFloorOutlineInformationId;
    };

    this.destroyIndoorMapFloorOutlineInformation = function(indoorMapFloorOutlineInformationId) {
        _indoorMapFloorOutlineInformationApi_DestroyIndoorMapFloorOutlineInformation(_emscriptenApiPointer, indoorMapFloorOutlineInformationId);
    };

    this.getIndoorMapFloorOutlineInformationLoaded = function(indoorMapFloorOutlineInformationId) {
        return _indoorMapFloorOutlineInformationApi_GetIndoorMapFloorOutlineInformationLoaded(_emscriptenApiPointer, indoorMapFloorOutlineInformationId);
    };

    this.tryGetIndoorMapFloorOutlineInformation = function(indoorMapFloorOutlineInformationId) {
        //Get Count of IndoorMapFloorOutlines
        var indoorMapFloorOutlinesCountBuf = _emscriptenMemory.createInt32Buffer(1);

        var success = _indoorMapFloorOutlineInformationApi_TryGetIndoorMapFloorOutlineBufferSize(
            _emscriptenApiPointer,
            indoorMapFloorOutlineInformationId,
            indoorMapFloorOutlinesCountBuf.ptr
        );

        var indoorMapFloorOutlinesCount = _emscriptenMemory.consumeBufferToArray(indoorMapFloorOutlinesCountBuf)[0];

        if (!success)
        {
            return null;
        }

        var outlinePolygons = [];
        var i;
        for (i = 0; i < indoorMapFloorOutlinesCount; i++) {
            //Get Counts for each outline polygon
            var outerRingPointCountBuf = _emscriptenMemory.createInt32Buffer(1);
            var innerRingsCountBuf = _emscriptenMemory.createInt32Buffer(1);
            var innerRingsTotalPointCountBuf = _emscriptenMemory.createInt32Buffer(1);

            success = _indoorMapFloorOutlineInformationApi_TryGetIndoorMapFloorOutlinePolygonBufferSizes(
                _emscriptenApiPointer,
                indoorMapFloorOutlineInformationId,
                i,
                outerRingPointCountBuf.ptr,
                innerRingsCountBuf.ptr,
                innerRingsTotalPointCountBuf.ptr
            );

            var outerRingPointCount = _emscriptenMemory.consumeBufferToArray(outerRingPointCountBuf)[0];
            var innerRingsCount = _emscriptenMemory.consumeBufferToArray(innerRingsCountBuf)[0];
            var innerRingsTotalPointCount = _emscriptenMemory.consumeBufferToArray(innerRingsTotalPointCountBuf)[0];

            if (!success)
            {
                return null;
            }

            var outerRingPointsLatLngDoublesBuf = _emscriptenMemory.createDoubleBuffer(outerRingPointCount * 2);
            var innerRingsPointCountBuf = _emscriptenMemory.createInt32Buffer(innerRingsCount);
            var innerRingPointsLatLngDoublesBuf = _emscriptenMemory.createDoubleBuffer(innerRingsTotalPointCount * 2);

            success = _indoorMapFloorOutlineInformationApi_TryGetIndoorMapFloorOutlinePolygon(
                _emscriptenApiPointer,
                indoorMapFloorOutlineInformationId,
                i,
                outerRingPointsLatLngDoublesBuf.ptr,
                outerRingPointsLatLngDoublesBuf.element_count,
                innerRingsPointCountBuf.ptr,
                innerRingsPointCountBuf.element_count,
                innerRingPointsLatLngDoublesBuf.ptr,
                innerRingPointsLatLngDoublesBuf.element_count
            );

            var outerRingPointsLatLngDoubles = _emscriptenMemory.consumeBufferToArray(outerRingPointsLatLngDoublesBuf);
            var innerRingsPointCount = _emscriptenMemory.consumeBufferToArray(innerRingsPointCountBuf);
            var innerRingPointsLatLngDoubles = _emscriptenMemory.consumeBufferToArray(innerRingPointsLatLngDoublesBuf);

            var outerRing = _getOutlinePolygonRing(outerRingPointsLatLngDoubles, 0, outerRingPointCount);

            var innerRingBufferIndex = 0;
            var innerRings = [];

            for (var j = 0; j < innerRingsCount; j++) {
                var pointCount = innerRingsPointCount[j];
                var innerRing = _getOutlinePolygonRing(innerRingPointsLatLngDoubles, innerRingBufferIndex, pointCount);
                innerRingBufferIndex = innerRingBufferIndex + (pointCount * 2);
                innerRings.push(innerRing);
            }

            if (!success)
            {
                return null;
            }

            var outlinePolygon = new IndoorMapFloorOutlinePolygon(outerRing, innerRings);
            outlinePolygons.push(outlinePolygon);
        }

        return outlinePolygons;
    };

    var _getOutlinePolygonRing = function(doublesLatLngArray, startIndex, pointCount) {
        var pointIndex = startIndex;
        var ringPoints = [];

        for (var i = 0; i < pointCount; ++i) {
            var lat = doublesLatLngArray[pointIndex++];
            var lng = doublesLatLngArray[pointIndex++];
            ringPoints.push(L.latLng(lat, lng));
        }

        return new IndoorMapFloorOutlinePolygonRing(ringPoints);
    };
}

module.exports = EmscriptenIndoorMapFloorOutlineInformationApi;
