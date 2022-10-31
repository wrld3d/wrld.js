export function EmscriptenLabelApi(emscriptenApiPointer, cwrap) {
    var _emscriptenApiPointer = emscriptenApiPointer;

    var _labelApi_SetLabelsEnabled = cwrap("labelApi_SetLabelsEnabled", null, ["number", "number"]);


    this.setLabelsEnabled = (enabled) => {
        _labelApi_SetLabelsEnabled(_emscriptenApiPointer, enabled ? 1 : 0);
    };
}

export default EmscriptenLabelApi;
