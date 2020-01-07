var buildings = require("../../public/buildings/buildings");

function EmscriptenBuildingsApi(emscriptenApiPointer, cwrap, emscriptenModule, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    var _buildingsApi_SetBuildingHighlightChangedCallback = cwrap("buildingsApi_SetBuildingHighlightChangedCallback", null, ["number", "number"]);
    var _buildingsApi_CreateHighlightAtLocation = cwrap("buildingsApi_CreateHighlightAtLocation", null, ["number", "number", "number", "number", "number", "number", "number", "number"]);
    var _buildingsApi_CreateHighlightAtScreenPoint = cwrap("buildingsApi_CreateHighlightAtScreenPoint", null, ["number", "number", "number", "number", "number", "number", "number", "number"]);
    var _buildingsApi_DestroyHighlight = cwrap("buildingsApi_DestroyHighlight", null, ["number", "number"]);
    var _buildingsApi_SetHighlightColor = cwrap("buildingsApi_SetHighlightColor", null, ["number", "number", "number", "number", "number", "number"]);
    var _buildingsApi_TryGetBuildingInformationBufferSizes = cwrap("buildingsApi_TryGetBuildingInformationBufferSizes", "number", ["number", "number", "number", "number"]);
    var _buildingsApi_TryGetBuildingInformation = cwrap("buildingsApi_TryGetBuildingInformation", "number", ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]);
    var _buildingsApi_TryFindIntersectionWithBuilding = cwrap("buildingsApi_TryFindIntersectionWithBuilding", "number", ["number", "number", "number"]);

    this.registerBuildingInformationReceivedCallback = function(callback) {
        _buildingsApi_SetBuildingHighlightChangedCallback(_emscriptenApiPointer, emscriptenModule.addFunction(callback));
    };

    this.createBuildingHighlight = function(buildingHighlight) {
        var buildingHighlightId = 0;
        var options = buildingHighlight.getOptions();
        var color = buildingHighlight.getColor();

        var shouldCreateView = options.getIsInformationOnly() ? 0 : 1;

        if (options.getSelectionMode() === buildings.BuildingHighlightSelectionType.SELECT_AT_LOCATION) {
            var latLng = options.getSelectionLocation();
            buildingHighlightId = _buildingsApi_CreateHighlightAtLocation(
                _emscriptenApiPointer,
                latLng.lat,
                latLng.lng,
                color.x/255,
                color.y/255,
                color.z/255,
                color.w/255,
                shouldCreateView
            );
        }
        else {
            var point = options.getSelectionScreenPoint();
            buildingHighlightId = _buildingsApi_CreateHighlightAtScreenPoint(
                _emscriptenApiPointer,
                point.x,
                point.y,
                color.x/255,
                color.y/255,
                color.z/255,
                color.w/255,
                shouldCreateView
            );
        }

        return buildingHighlightId;
    };


    this.destroyBuildingHighlight = function(buildingHighlightId) {
        _buildingsApi_DestroyHighlight(_emscriptenApiPointer, buildingHighlightId);
    };

    this.setHighlightColor = function(buildingHighlightId, color) {
        _buildingsApi_SetHighlightColor(_emscriptenApiPointer, buildingHighlightId, color.x/255, color.y/255, color.z/255, color.w/255);
    };

    this.tryGetBuildingInformation = function(buildingHighlightId) {
        var buildingIdSizeBuf = _emscriptenMemory.createInt32Buffer(1);
        var contourPointsSizeBuf = _emscriptenMemory.createInt32Buffer(1);
        var buildingContoursSizeBuf = _emscriptenMemory.createInt32Buffer(1);

        var success = _buildingsApi_TryGetBuildingInformationBufferSizes(_emscriptenApiPointer, buildingHighlightId, buildingIdSizeBuf.ptr, contourPointsSizeBuf.ptr, buildingContoursSizeBuf.ptr);

        var buildingIdSize = _emscriptenMemory.consumeBufferToArray(buildingIdSizeBuf)[0];
        var contourPointsSize = _emscriptenMemory.consumeBufferToArray(contourPointsSizeBuf)[0];
        var buildingContoursSize = _emscriptenMemory.consumeBufferToArray(buildingContoursSizeBuf)[0];

        if (!success)
        {
            return null;
        }

        var buildingIdBuf = _emscriptenMemory.createInt8Buffer(buildingIdSize);
        var baseAltitudeBuf = _emscriptenMemory.createDoubleBuffer(1);
        var topAltitudeBuf = _emscriptenMemory.createDoubleBuffer(1);
        var centroidBuf = _emscriptenMemory.createBufferFromArray([0.0, 0.0], _emscriptenMemory.createDoubleBuffer);

        // building contours fetched as struct of arrays
        var contourPointsLatLngDoublesBuf = _emscriptenMemory.createDoubleBuffer(contourPointsSize * 2);
        var contourPointCountsBuf = _emscriptenMemory.createInt32Buffer(buildingContoursSize);
        var contourBottomAltitudeBuf = _emscriptenMemory.createDoubleBuffer(buildingContoursSize);
        var contourTopAltitudeBuf = _emscriptenMemory.createDoubleBuffer(buildingContoursSize);


        success = _buildingsApi_TryGetBuildingInformation(
            _emscriptenApiPointer,
            buildingHighlightId,
            buildingIdBuf.ptr,
            buildingIdSize,
            baseAltitudeBuf.ptr,
            topAltitudeBuf.ptr,
            centroidBuf.ptr,
            contourPointsLatLngDoublesBuf.ptr,
            contourPointsLatLngDoublesBuf.element_count,
            contourPointCountsBuf.ptr,
            contourPointCountsBuf.element_count,
            contourBottomAltitudeBuf.ptr,
            contourBottomAltitudeBuf.element_count,
            contourTopAltitudeBuf.ptr,
            contourTopAltitudeBuf.element_count
            );

        var buildingId = _emscriptenMemory.consumeUtf8BufferToString(buildingIdBuf);
        var baseAltitude = _emscriptenMemory.consumeBufferToArray(baseAltitudeBuf);
        var topAltitude = _emscriptenMemory.consumeBufferToArray(topAltitudeBuf);
        var centroid = L.latLng(_emscriptenMemory.consumeBufferToArray(centroidBuf));

        var buildingDimensions = new buildings.BuildingDimensions(baseAltitude, topAltitude, centroid);

        var contourPointsLatLngDoubles = _emscriptenMemory.consumeBufferToArray(contourPointsLatLngDoublesBuf);
        var contourPointCounts = _emscriptenMemory.consumeBufferToArray(contourPointCountsBuf);
        var contourBottomAltitudes = _emscriptenMemory.consumeBufferToArray(contourBottomAltitudeBuf);
        var contourTopAltitudes = _emscriptenMemory.consumeBufferToArray(contourTopAltitudeBuf);

        var buildingContours = [];
        var pointBufferIndex = 0;
        for (var contourIndex = 0; contourIndex < contourPointCountsBuf.element_count; ++contourIndex) {
            var pointCount = contourPointCounts[contourIndex];
            var points = [];
            for (var i = 0; i < pointCount; ++i) {
                var lat = contourPointsLatLngDoubles[pointBufferIndex++];
                var lng = contourPointsLatLngDoubles[pointBufferIndex++];
                points.push(L.latLng(lat, lng));
            }
            var contour = new buildings.BuildingContour(
                contourBottomAltitudes[contourIndex],
                contourTopAltitudes[contourIndex],
                points);
            buildingContours.push(contour);
        }

        if (!success) {
            return null;
        }

        return new buildings.BuildingInformation(buildingId, buildingDimensions, buildingContours);
    };

    this.findIntersectionWithBuilding = function(ray) {
        var rayElements = [ray.origin.x, ray.origin.y, ray.origin.z, ray.direction.x, ray.direction.y, ray.direction.z];

        var rayBuffer = _emscriptenMemory.createBufferFromArray(rayElements, _emscriptenMemory.createDoubleBuffer);

        var intersectionLatLngAltBuffer = _emscriptenMemory.createDoubleBuffer(3);

        var didIntersect = _buildingsApi_TryFindIntersectionWithBuilding(_emscriptenApiPointer, rayBuffer.ptr, intersectionLatLngAltBuffer.ptr);

        _emscriptenMemory.freeBuffer(rayBuffer);

        var resultArray = _emscriptenMemory.consumeBufferToArray(intersectionLatLngAltBuffer);

        return {
            found : didIntersect,
            point : L.latLng(resultArray)
        };
    };


}

module.exports = EmscriptenBuildingsApi;