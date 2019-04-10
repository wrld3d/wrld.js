function EmscriptenVersionApi(emscriptenApiPointer, cwrap, emscriptenMemory) {

    var _emscriptenApiPointer = emscriptenApiPointer;
    var _emscriptenMemory = emscriptenMemory;
    
    var _versionApi_GetPlatformVersionStringSize = cwrap("versionApi_GetPlatformVersionStringSize", "number", ["number"]);
    var _versionApi_TryGetPlatformVersionString = cwrap("versionApi_TryGetPlatformVersionString", "number", ["number", "number", "number"]);

    var _versionApi_GetPlatformHashStringSize = cwrap("versionApi_GetPlatformHashStringSize", "number", ["number"]);
    var _versionApi_TryGetPlatformHashString = cwrap("versionApi_TryGetPlatformHashString", "number", ["number", "number", "number"]);

    var _tryGetNativeVersionString = function(nativeGetBufferSizeFunc, nativeGetStringFunc) {
        var bufferSize = nativeGetBufferSizeFunc(_emscriptenApiPointer);
        var stringBuffer = _emscriptenMemory.createInt8Buffer(bufferSize);
        var success = nativeGetStringFunc(
            _emscriptenApiPointer,
            stringBuffer.ptr,
            bufferSize
            );

        if (!success) {
            return null;
        }

        var stringValue = _emscriptenMemory.consumeUtf8BufferToString(stringBuffer);
        return stringValue;
    };

    this.getPlatformVersion = function() {
        return _tryGetNativeVersionString(
            _versionApi_GetPlatformVersionStringSize,
            _versionApi_TryGetPlatformVersionString
            );
    };

    this.getPlatformVersionHash = function() {
        return _tryGetNativeVersionString(
            _versionApi_GetPlatformHashStringSize,
            _versionApi_TryGetPlatformHashString
            );
    };
}

module.exports = EmscriptenVersionApi;