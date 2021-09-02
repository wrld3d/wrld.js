import L from "leaflet";
import EegeoMapController from "./private/eegeo_map_controller";
import EmscriptenApi from "./private/emscripten_api/emscripten_api";
import * as marker from "./public/marker";
import * as popup from "./public/popup.js";
import * as polygon from "./public/polygon.js";
import * as polyline from "./public/polyline.js";
import * as prop from "./public/prop.js";
import * as polygonShim from "./private/polygon_shim.js";
import * as polylineShim from "./private/polyline_shim.js";
import * as rectangleShim from "./private/rectangle_shim.js";
import * as circle from "./public/circle.js";
import * as heatmap from "./public/heatmap.js";
// modules
import * as indoors from "./public/indoors/indoors";
import * as space from "./public/space";
import * as themes from "./public/themes";
import * as buildings from "./public/buildings/buildings";
import * as indoorMapEntities from "./public/indoorMapEntities/indoorMapEntities";
import * as indoorMapFloorOutlines from "./public/indoorMapFloorOutlines/indoorMapFloorOutlines";

import "./private/polyfills.js";

var _baseUrl = "https://cdn-webgl.wrld3d.com/eegeojs/public/latest/";
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
	if (element instanceof HTMLElement === false) {
		var idError = (id === null) ? "" : (" with id '" + id + "'");
		throw "No map container found" + idError;
	}
	return element;
};

var Wrld = {
	map: function(domElement, apiKey, options) {

		var wrldModule = createEmscriptenModule();

		domElement = findMapContainerElement(domElement);

		var browserDocument = document;
		var browserWindow = window;
		var mapId = _mapObjects.length;
		var mapApiObject = new EmscriptenApi(wrldModule);
		var mapOptions = options || {};
		var onMapRemove = function() {
			_mapObjects[mapId] = null;
		};
		var map = new EegeoMapController(mapId, mapApiObject, domElement, apiKey, browserWindow, browserDocument, wrldModule, mapOptions, onMapRemove);
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
	Polyline: polyline.Polyline,
	polyline: polyline.polyline,
	Prop: prop.Prop,
	prop: prop.prop,
	Heatmap: heatmap.Heatmap,
	heatmap: heatmap.heatmap,

	indoors: indoors,
	space: space,
	themes: themes,
	buildings: buildings,
	indoorMapEntities: indoorMapEntities,
	indoorMapFloorOutlines: indoorMapFloorOutlines,

	getMapById: function(mapId) {
		return _mapObjects[mapId];
	}
};

L.popup = popup.popup;
L.circle = circle.circle;
L.marker = marker.marker;
L.polygon = polygonShim.polygonShim;
L.polyline = polylineShim.polylineShim;
L.rectangle = rectangleShim.rectangleShim;

window.L = L;
L.Wrld = Wrld;
L.eeGeo = L.Wrld;

// The default image path is broken when using Browserify - it searches the script tags on the page
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.0.1/dist/images/";

export default Wrld;
