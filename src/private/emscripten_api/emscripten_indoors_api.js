function EmscriptenIndoorsApi(apiPointer, cwrap) {

    var _apiPointer = apiPointer;
    var _exitIndoorMap = cwrap("exitIndoorMap", null, ["number"]);
    var _setIndoorMapEnteredCallback = cwrap("setIndoorMapEnteredCallback", null, ["number", "number"]);
    var _setIndoorMapExitedCallback = cwrap("setIndoorMapExitedCallback", null, ["number", "number"]);

    var _hasActiveIndoorMap = cwrap("hasActiveIndoorMap", "number", ["number"]);
	var _getActiveIndoorMapId = cwrap("getActiveIndoorMapId", "string", ["number"]);
	var _getActiveIndoorMapName = cwrap("getActiveIndoorMapName", "string", ["number"]);

    this.registerIndoorMapEnteredCallback = function (callback) {
        _setIndoorMapEnteredCallback(_apiPointer, Runtime.addFunction(callback));
    };

    this.registerIndoorMapExitedCallback = function (callback) {
        _setIndoorMapExitedCallback(_apiPointer, Runtime.addFunction(callback));
    };

    this.exitIndoorMap = function() {
        _exitIndoorMap(_apiPointer);
    };

    this.hasActiveIndoorMap = function() {
    	return !!_hasActiveIndoorMap(_apiPointer);
    };

	this.getActiveIndoorMapId = function() {
		return _getActiveIndoorMapId(_apiPointer);
	};

	this.getActiveIndoorMapName = function() {
		return _getActiveIndoorMapName(_apiPointer);
	};

}

module.exports = EmscriptenIndoorsApi;