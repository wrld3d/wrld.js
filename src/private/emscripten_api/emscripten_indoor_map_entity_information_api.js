function EmscriptenIndoorMapEntityInformationApi(emscriptenApiPointer, cwrap, runtime, emscriptenMemory) {
    
    var _emscriptenApiPointer = emscriptenApiPointer;

    var _indoorEntityInformationApi_CreateIndoorMapEntityInformation = cwrap("indoorMapEntityInformation_CreateIndoorMapEntityInformation", "number", ["number","string"]);
    var _indoorEntityInformationApi_DestroyIndoorMapEntityInformation = cwrap("indoorMapEntityInformation_DestroyIndoorMapEntityInformation", null, ["number","number"]);

    this.createIndoorMapEntityInformation = function(indoorEntityInformation) {
        var indoorEntityInformationId = 0;

        var indoorMapId = indoorEntityInformation.getIndoorMapId();

        indoorEntityInformationId = _indoorEntityInformationApi_CreateIndoorMapEntityInformation(
            _emscriptenApiPointer,
            indoorMapId);

        return indoorEntityInformationId;
    };

    this.destroyIndoorMapEntityInformation = function(IndorMapEntityInformationId) {
        _indoorEntityInformationApi_DestroyIndoorMapEntityInformation(_emscriptenApiPointer, IndorMapEntityInformationId);
    };
}

module.exports = EmscriptenIndoorMapEntityInformationApi;
