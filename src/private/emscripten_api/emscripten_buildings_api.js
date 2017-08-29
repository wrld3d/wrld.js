function EmscriptenBuildingsApi(apiPointer, cwrap, runtime, emscriptenMemory) {
    var _requestCounter = 0;
    var _getBuildingFootprintAtLocationInterop = null;
    var _callbackMap = {};
    var _apiPointer = apiPointer;
    var _emscriptenMemory = emscriptenMemory;

    function apiCallback(requestId, buildingReceived, baseAlt, topAlt, centroidLat, centroidLong, outline, outlineSize) {
        var outlineArray = _emscriptenMemory.readDoubles(outline, outlineSize);
        var outline2dArray = [];
        while (outlineArray.length)
        {
            outline2dArray.push(outlineArray.splice(0,3));
        }

        _callbackMap[requestId](buildingReceived, baseAlt, topAlt, centroidLat, centroidLong, outline2dArray);
        delete _callbackMap[requestId];
    }

    this.setEventCallback = function() {
        cwrap("SetBuildingsApiEventCallback", null, ["number", "number"])(_apiPointer, runtime.addFunction(apiCallback));
    };

    this.getBuildingFootprintAtLocation = function(latitude, longitude, altitude, callback) {
        _getBuildingFootprintAtLocationInterop = _getBuildingFootprintAtLocationInterop
            || cwrap("GetBuildingFootprintAtLocation", null, ["number", "number", "number", "number", "number"]);
        _callbackMap[_requestCounter] = callback;
        _getBuildingFootprintAtLocationInterop(_apiPointer, latitude, longitude, altitude, _requestCounter);
        _requestCounter++;
    };
}

module.exports = EmscriptenBuildingsApi;