function EmscriptenVersionApi(emscriptenApiPointer, cwrap) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    
    var _versionApi_GetPlatformVersionString = cwrap("versionApi_GetPlatformVersionString", "string", ["number"]);
    var _versionApi_GetPlatformVersionHashString = cwrap("versionApi_GetPlatformVersionHashString", "string", ["number"]);

    this.getPlatformVersion = function() {
        return _versionApi_GetPlatformVersionString(_emscriptenApiPointer);
    };

    this.getPlatformVersionHash = function() {
        return _versionApi_GetPlatformVersionHashString(_emscriptenApiPointer);
    };
}

module.exports = EmscriptenVersionApi;