
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
        var pointer = _emscriptenModule._malloc(32);
        _emscriptenModule.stringToUTF8(string, pointer, 32);
        func(pointer);
        _emscriptenModule._free(pointer);
    };

    this.passStrings = function(string_array, func) {
        // allocate array of pointers to strings
        // NB Emscripten heap pointers are 32 bits
        var pointer = _emscriptenModule._malloc(string_array.length*4);
        var strs = [];
        for (var i=0; i<string_array.length; ++i) {
            var str = _emscriptenModule._malloc(string_array[i].length + 1);
            _emscriptenModule.writeStringToMemory(string_array[i],str);
            _emscriptenModule.setValue(pointer + i*4, str, "*");
            strs.push(str);
        }
        func(pointer, string_array.length);
        for (var j=0; j<strs.length; ++j) {
            _emscriptenModule._free(strs[j]);
        }
        _emscriptenModule._free(pointer);
    };

    this.stringifyPointer = function(ptr) {
      return _emscriptenModule.Pointer_stringify(ptr);
    };
}

module.exports = EmscriptenMemory;