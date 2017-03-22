function EmscriptenThemesApi(apiPointer, cwrap, runtime) {

    var _apiPointer = apiPointer;
    var _setTheme = null;
    var _setState = null;
    var _setThemeManifest = null;
    var _setCallback = null;

    this.setTheme = function(themeName) {
        _setTheme = _setTheme || cwrap("setTheme", null, ["number", "string"]);
        _setTheme(_apiPointer, themeName);
    };

    this.setState = function(stateName, transitionTime) {
        _setState = _setState || cwrap("setState", null, ["number", "string", "number"]);
    	_setState(_apiPointer, stateName, transitionTime);
    };

    this.setThemeManifest = function(themeManifest) {
        _setThemeManifest = _setThemeManifest || cwrap("setThemeManifest", null, ["number", "string"]);
        _setThemeManifest(_apiPointer, themeManifest);
    };

    this.registerStreamingCompletedCallback = function (callback) {
        _setCallback = _setCallback || cwrap("setStreamingCompletedCallback", null, ["number", "number"]);
        _setCallback(_apiPointer, runtime.addFunction(callback));
    };
}

module.exports = EmscriptenThemesApi;