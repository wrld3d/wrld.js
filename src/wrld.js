var L = require("leaflet");
var EegeoMapController = require("./private/eegeo_map_controller");
var EmscriptenApi = require("./private/emscripten_api/emscripten_api");
var marker = require("./public/marker.js");
var popup = require("./public/popup.js");
var polygon = require("./public/polygon.js");
var circle = require("./public/circle.js");
require("./private/polyfills.js");


var _baseUrl = "https://cdn-webgl.wrld3d.com/wrldjs/early_access/latest/";
var _appName = "eeGeoWebGL.jgz";


var _mapObjects = [];
var _emscriptenStartedLoading = false;
var _emscriptenFinishedLoading = false;
var _mapsWaitingInitialization = [];

var onEmscriptenLoaded = function() {
  _emscriptenFinishedLoading = true;
  _mapsWaitingInitialization.forEach(function(module) {
    window.createWrldModule(module);
  });
  _mapsWaitingInitialization = [];
};

var createEmscriptenModule = function() {
  if (!_emscriptenStartedLoading) {
		var script = document.createElement("script");
		script.src = _baseUrl + _appName;
    script.onload = onEmscriptenLoaded;
		document.body.appendChild(script);
		_emscriptenStartedLoading = true;
  }

	var Module = {};
	Module["locateFile"] = function(url) {
		var absUrl = _baseUrl + url;
		return absUrl;
	};
	Module["onExit"] = function(exitCode) {
		if (exitCode === 1) {
			var message = "Error: wrld.js failed to initialize";
			if (!Module.ctx) {
				message = "Error: WebGL unavailable in this browser";
			}
			_mapObjects.forEach(function(map) {
				map.onError(message);
			});
		}
	};
  return Module;
};

var initializeMap = function(module) {
  if (!_emscriptenFinishedLoading) {
    _mapsWaitingInitialization.push(module);
  }
  else {
    window.createWrldModule(module);
  }
};

var findMapContainerElement = function(elementOrId) {
	var element = elementOrId;
	var id = null;
	if (typeof elementOrId === "string") {
		id = elementOrId;
		element = document.getElementById(id);
	}
	if (!element) {
		var idError = (id === null) ? "" : (" with id '" + id + "'");
		throw "No map container found" + idError;
	}
	return element;
};

var eeGeo = {
	map: function(domElement, apiKey, options) {

		var wrldModule = createEmscriptenModule();

		domElement = findMapContainerElement(domElement);

		var browserDocument = document;
		var browserWindow = window;
		var mapId = _mapObjects.length;
		var mapApiObject = new EmscriptenApi(wrldModule);
		var mapOptions = options || {};
		var map = new EegeoMapController(mapId, mapApiObject, domElement, apiKey, browserWindow, browserDocument, wrldModule, mapOptions);
		_mapObjects.push(map);

		initializeMap(wrldModule);

		return map.leafletMap;
	},
	
	Marker: marker.Marker,
	marker: marker.marker,
	Popup: popup.Popup,
	popup: popup.popup,
	Polygon: polygon.Polygon,
	polygon: polygon.polygon,

	indoors: require("./public/indoors/indoors"),
	space: require("./public/space"),
	themes: require("./public/themes"),

	getMapById: function(mapId) {
		return _mapObjects[mapId];
	}
};

L.Circle = circle.Circle;
L.circle = circle.circle;

window.L = L;
L.eeGeo = eeGeo;

// The default image path is broken when using Browserify - it searches the script tags on the page
L.Icon.Default.imagePath = "http://cdn.leafletjs.com/leaflet/v1.0.1/images/";

module.exports = L.eeGeo;
