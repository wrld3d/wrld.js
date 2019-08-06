var IndoorMapFloorOutlinePolygon = require("../../public/indoorMapFloorOutlines/indoor_map_floor_outline_polygon");
var IndoorMapFloorOutlinePolygonRing = require("../../public/indoorMapFloorOutlines/indoor_map_floor_outline_polygon_ring");

function EmscriptenIndoorMapFloorOutlineInformationApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;

    var _indoorFloorOutlineInformationApi_IndoorFloorOutlineInformationLoadedCallback = cwrap("indoorFloorOutlineInformationApi_IndoorFloorOutlineInformationLoadedCallback", null, ["number", "number"]);
    var _indoorFloorOutlineInformationApi_CreateIndoorFloorOutlineInformation = cwrap("indoorFloorOutlineInformationApi_CreateIndoorFloorOutlineInformation", "number", ["number","string", "number"]);
    var _indoorFloorOutlineInformationApi_DestroyIndoorFloorOutlineInformation = cwrap("indoorFloorOutlineInformationApi_DestroyIndoorFloorOutlineInformation", null, ["number","number"]);
    var _indoorFloorOutlineInformationApi_GetIndoorFloorOutlineInformationLoaded = cwrap("indoorFloorOutlineInformationApi_GetIndoorFloorOutlineInformationLoaded", "number", ["number","number"]);
    var _indoorFloorOutlineInformationApi_TryGetIndoorFloorOutlineBufferSize = cwrap("indoorFloorOutlineInformationApi_TryGetIndoorFloorOutlineBufferSize", "number", ["number","number","number"]);
    var _indoorFloorOutlineInformationApi_TryGetIndoorFloorOutlinePolygonBufferSizes = cwrap("indoorFloorOutlineInformationApi_TryGetIndoorFloorOutlinePolygonBufferSizes", "number", ["number","number","number","number","number","number"]);
    var _indoorFloorOutlineInformationApi_TryGetIndoorFloorOutlinePolygon = cwrap("indoorFloorOutlineInformationApi_TryGetIndoorFloorOutlinePolygon", "number", ["number","number","number","number","number","number","number","number"]);

    this.registerIndoorMapFloorOutlineInformationLoadedCallback = function(callback) {
        _indoorFloorOutlineInformationApi_IndoorFloorOutlineInformationLoadedCallback(_emscriptenApiPointer, runtime.addFunction(callback));
    };

    this.createIndoorMapFloorOutlineInformation = function(indoorMapFloorOutlineInformation) {
        var indoorMapFloorOutlineInformationId = 0;

        var indoorMapId = indoorMapFloorOutlineInformation.getIndoorMapId();
        var indoorMapFloorId = indoorMapFloorOutlineInformation.getIndoorMapFloorId();

        indoorMapFloorOutlineInformationId = _indoorFloorOutlineInformationApi_CreateIndoorFloorOutlineInformation(
            _emscriptenApiPointer,
            indoorMapId,
            indoorMapFloorId);

        return indoorMapFloorOutlineInformationId;
    };

    this.destroyIndoorMapFloorOutlineInformation = function(indoorMapFloorOutlineInformationId) {
        _indoorFloorOutlineInformationApi_DestroyIndoorFloorOutlineInformation(_emscriptenApiPointer, indoorMapFloorOutlineInformationId);
    };

    this.getIndoorFloorOutlineInformationLoaded = function(indoorMapFloorOutlineInformationId) {
        return _indoorFloorOutlineInformationApi_GetIndoorFloorOutlineInformationLoaded(_emscriptenApiPointer, indoorMapFloorOutlineInformationId);
    };

    this.tryGetIndoorMapFloorOutlineInformation = function(indoorMapFloorOutlineInformationId) {
        //Get Count of IndoorMapFloorOutlines
        var indoorMapFloorOutlinesCountBuf = _emscriptenMemory.createInt32Buffer(1);

        var success = _indoorFloorOutlineInformationApi_TryGetIndoorFloorOutlineBufferSize(
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

            success = _indoorFloorOutlineInformationApi_TryGetIndoorFloorOutlinePolygonBufferSizes(
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

            success = _indoorFloorOutlineInformationApi_TryGetIndoorFloorOutlinePolygon(
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
