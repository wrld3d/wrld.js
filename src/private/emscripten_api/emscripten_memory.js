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
    }
};

module.exports = emscriptenMemory;