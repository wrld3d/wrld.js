
function EmscriptenMemory(emscriptenModule) {

    var _emscriptenModule = emscriptenModule;

    this.readDoubles = function(pointer, count) {
        var result = [];
        for (var i=0; i<count; ++i) {
            var item = _emscriptenModule.getValue(pointer + i*8, "double");
            result.push(item);
        }
        return result;
    };

    this.passDoubles = function(double_array, func) {
        var pointer = _emscriptenModule._malloc(double_array.length * 8);
        for (var i=0; i<double_array.length; ++i) {
            _emscriptenModule.setValue(pointer + i*8, double_array[i], "double");
        }
        func(pointer, double_array.length);
        _emscriptenModule._free(pointer);
    };

    this.passString = function(string, func) {
        var utf8Length = _emscriptenModule.lengthBytesUTF8(string);
        var pointer = _emscriptenModule._malloc(utf8Length);
        _emscriptenModule.stringToUTF8(string, pointer, utf8Length);
        func(pointer);
        _emscriptenModule._free(pointer);
    };

    this.passStrings = function(string_array, func) {
        // allocate array of pointers to strings
        // NB Emscripten heap pointers are 32 bits
        var pointer = _emscriptenModule._malloc(string_array.length*4);
        var strs = [];
        for (var i=0; i<string_array.length; ++i) {
            var utf8Length = _emscriptenModule.lengthBytesUTF8(string_array[i]) + 1;
            var str = _emscriptenModule._malloc(utf8Length);
            _emscriptenModule.stringToUTF8(string_array[i],str, utf8Length);
            _emscriptenModule.setValue(pointer + i*4, str, "*");
            strs.push(str);
        }
        func(pointer, string_array.length);
        for (var j=0; j<strs.length; ++j) {
            _emscriptenModule._free(strs[j]);
        }
        _emscriptenModule._free(pointer);
    };

    this.passInt32s = function(int32_array, func) {
        var pointer = _emscriptenModule._malloc(int32_array.length * 4);
        for (var i=0; i<int32_array.length; ++i) {
            _emscriptenModule.setValue(pointer + i*4, int32_array[i], "i32");
        }
        func(pointer, int32_array.length);
        _emscriptenModule._free(pointer);  
    };

    this.stringifyPointer = function(ptr) {
      return _emscriptenModule.UTF8ToString(ptr);
    };

    this.createInt8Buffer = function(bufferLen) {
        var bufferPtr = _emscriptenModule._malloc(bufferLen);
        return {
            ptr: bufferPtr,
            element_count: bufferLen,
            element_type: "i8",
            element_size_bytes: 1
        };
    };

    this.createInt32Buffer = function(elementCount) {
        var elementSizeBytes = 4;
        var bufferPtr = _emscriptenModule._malloc(elementCount * elementSizeBytes);
        return {
            ptr: bufferPtr,
            element_count: elementCount,
            element_type: "i32",
            element_size_bytes: elementSizeBytes
        };
    };

    this.createDoubleBuffer = function(elementCount) {
        var elementSizeBytes = 8;
        var bufferPtr = _emscriptenModule._malloc(elementCount * elementSizeBytes);
        return {
            ptr: bufferPtr,
            element_count: elementCount,
            element_type: "double",
            element_size_bytes: elementSizeBytes
        };
    };

    this.createBufferFromArray = function(number_array, createXBufferFunc) {
        var buffer = createXBufferFunc(number_array.length);
        for (var i = 0; i < buffer.element_count; ++i) {
            _emscriptenModule.setValue(buffer.ptr + i*buffer.element_size_bytes, number_array[i], buffer.element_type);
        }
        return buffer;
    };

    this.consumeBufferToArray = function(buffer) {
        var result = [];
        for (var i = 0; i < buffer.element_count; ++i) {
            var item = _emscriptenModule.getValue(buffer.ptr + i*buffer.element_size_bytes, buffer.element_type);
            result.push(item);
        }
        _emscriptenModule._free(buffer.ptr);
        return result;
    };

    this.freeBuffer = function(buffer) {
        _emscriptenModule._free(buffer.ptr);
    };

    this.createUtf8BufferFromString = function(str) {
        var bufferLen = _emscriptenModule.lengthBytesUTF8(str) + 1;
        var buffer = this.createInt8Buffer(bufferLen);
        _emscriptenModule.stringToUTF8(str, buffer.ptr, bufferLen);
        return buffer;
    };

    this.consumeUtf8BufferToString = function(buffer) {
        var result = _emscriptenModule.UTF8ToString(buffer.ptr);
        _emscriptenModule._free(buffer.ptr);
        return result;
    };
}

module.exports = EmscriptenMemory;