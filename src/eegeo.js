var L = require("leaflet");
var EegeoMapController = require("./private/eegeo_map_controller");
var EmscriptenApi = require("./private/emscripten_api/emscripten_api");
var marker = require("./public/marker.js");
var popup = require("./public/popup.js");
var polygon = require("./public/polygon.js");


var _baseUrl = "https://cdn-webgl.eegeo.com/eegeojs/early_access/latest/";
var _appName = "eeGeoWebGL.jgz";

var _mapObjects = [];
var _emscriptenInitialized = false;


var createEmscriptenModule = function() {
	window.Module = {
		locateFile: function(url) {
			var absUrl = _baseUrl + url;
			return absUrl;
		}
	};
};

var initializeEmscripten = function() {
	if (!_emscriptenInitialized) {
		var script = document.createElement("script");
		script.src = _baseUrl + _appName;
		document.body.appendChild(script);
		_emscriptenInitialized = true;
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

		createEmscriptenModule();

		domElement = findMapContainerElement(domElement);

		var mapId = _mapObjects.length;
		var mapApiObject = new EmscriptenApi(window.Module);
		var mapOptions = options || {};
		var map = new EegeoMapController(mapId, mapApiObject, domElement, apiKey, mapOptions);
		_mapObjects.push(map);

		initializeEmscripten();

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

window.L = L;
L.eeGeo = eeGeo;

// The default image path is broken when using Browserify - it searches the script tags on the page
L.Icon.Default.imagePath = "http://cdn.leafletjs.com/leaflet/v0.7.7/images";

module.exports = L.eeGeo;
