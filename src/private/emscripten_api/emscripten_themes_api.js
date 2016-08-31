function EmscriptenThemesApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;
    var _setTheme = cwrap("setTheme", null, ["number", "string"]);
    var _setState = cwrap("setState", null, ["number", "string", "number"]);
    var _setCallback = cwrap("setStreamingCompletedCallback", null, ["number", "number"]);

    this.setTheme = function(themeName) {
        _setTheme(_apiPointer, themeName);
    };

    this.setState = function(stateName, transitionTime) {
    	_setState(_apiPointer, stateName, transitionTime);
    };

    this.registerStreamingCompletedCallback = function (callback) {
        _setCallback(_apiPointer, runtime.addFunction(callback));
    };
}

module.exports = EmscriptenThemesApi;