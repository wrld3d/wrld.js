var emscriptenMemory = {
    
    readDoubles: function(pointer, count) {
        var result = [];
        for (var i=0; i<count; ++i) {
            var item = Module.getValue(pointer + i*8, "double");
            result.push(item);
        }
        return result;
    },

    passDoubles: function(double_array, func) {
        var pointer = Module._malloc(double_array.length * 8);
        for (var i=0; i<double_array.length; ++i) {
            Module.setValue(pointer + i*8, double_array[i], "double");
        }
        func(pointer, double_array.length);
        Module._free(pointer);
    },

    passString: function(string, func) {
        var pointer = Module._malloc(32);
        Module.stringToUTF8(string, pointer, 32);
        func(pointer);
        Module._free(pointer);
    },

    passStrings: function(string_array, func) {
        // allocate array of pointers to strings
        // NB Emscripten heap pointers are 32 bits
        var pointer = Module._malloc(string_array.length*4);
        var strs = [];
        for (var i=0; i<string_array.length; ++i) {
            var str = Module._malloc(string_array[i].length + 1);
            Module.writeStringToMemory(string_array[i],str);
            Module.setValue(pointer + i*4, str, "*");
            strs.push(str);
        }
        func(pointer, string_array.length);
        for (var j=0; j<strs.length; ++j) {
            Module._free(strs[j]);
        }
        Module._free(pointer);
    },

    createStringsBuffer: function (string_array) {
        // allocate array of pointers to strings
        // NB Emscripten heap pointers are 32 bits
        var pointer = Module._malloc(string_array.length*4);
        var strs = [];
        for (var i=0; i<string_array.length; ++i) {
            var str = Module._malloc(string_array[i].length + 1);
            Module.writeStringToMemory(string_array[i],str);
            Module.setValue(pointer + i*4, str, "*");
            strs.push(str);
        }

        return [pointer, strs];
    },

    free2dBuffer: function (pointer, strs) {
        for (var j=0; j < strs.length; ++j) {
            Module._free(strs[j]);
        }

        Module._free(pointer);
    }
};

module.exports = emscriptenMemory;