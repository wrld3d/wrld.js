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

const _baseUrl = "https://cdn-webgl.wrld3d.com/eegeojs/public/latest/";
const _appName = "eeGeoWebGL.jgz";

var _mapObjects = [];
var _emscriptenStartedLoading = false;
var _emscriptenFinishedLoading = false;
var _mapsWaitingInitialization = [];

const onEmscriptenLoaded = () => {
  _emscriptenFinishedLoading = true;
  _mapsWaitingInitialization.forEach((module) => {
    window.createWrldModule(module);
  });
  _mapsWaitingInitialization = [];
};

const createEmscriptenModule = () => {
  if (!_emscriptenStartedLoading) {
    var script = document.createElement("script");
    script.src = _baseUrl + _appName;
    script.onload = onEmscriptenLoaded;
    document.body.appendChild(script);
    _emscriptenStartedLoading = true;
  }

  var Module = {};
  Module["locateFile"] = (url) => {
    var absUrl = _baseUrl + url;
    return absUrl;
  };
  Module["onExit"] = (exitCode) => {
    if (exitCode === 1) {
      var message = "Error: wrld.js failed to initialize";
      if (!Module.ctx) {
        message = "Error: WebGL unavailable in this browser";
      }
      _mapObjects.forEach((map) => {
        map.onError(message);
      });
    }
  };
  return Module;
};

const initializeMap = (module) => {
  if (!_emscriptenFinishedLoading) {
    _mapsWaitingInitialization.push(module);
  }
  else {
    window.createWrldModule(module);
  }
};

const findMapContainerElement = (elementOrId) => {
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

const Wrld = {
  ...L,

  map: (domElement, apiKey, options) => {

    var wrldModule = createEmscriptenModule();

    domElement = findMapContainerElement(domElement);

    var browserDocument = document;
    var browserWindow = window;
    var mapId = _mapObjects.length;
    var mapApiObject = new EmscriptenApi(wrldModule);
    var mapOptions = options || {};
    var onMapRemove = () => {
      _mapObjects[mapId] = null;
    };
    var map = new EegeoMapController(mapId, mapApiObject, domElement, apiKey, browserWindow, browserDocument, wrldModule, mapOptions, onMapRemove);
    _mapObjects.push(map);

    initializeMap(wrldModule);

    return map.leafletMap;
  },
  getMapById: (mapId) => _mapObjects[mapId],

  // shims & overrides
  Popup: popup.Popup,
  popup: popup.popup,
  Circle: circle.Circle,
  circle: circle.circle,
  Marker: marker.Marker,
  marker: marker.marker,
  Polygon: polygonShim.PolygonShim,
  polygon: polygonShim.polygonShim,
  Polyline: polylineShim.PolylineShim,
  polyline: polylineShim.polylineShim,
  Rectangle: rectangleShim.RectangleShim,
  rectangle: rectangleShim.rectangleShim,

  // additions
  Prop: prop.Prop,
  prop: prop.prop,
  Heatmap: heatmap.Heatmap,
  heatmap: heatmap.heatmap,

  // new namespaces
  indoors: indoors,
  space: space,
  themes: themes,
  buildings: buildings,
  indoorMapEntities: indoorMapEntities,
  indoorMapFloorOutlines: indoorMapFloorOutlines,
  native: {
    Polygon: polygon.Polygon,
    polygon: polygon.polygon,
    Polyline: polyline.Polyline,
    polyline: polyline.polyline,
  },
};

// For compatibility with eeGeoWebGL we need L.Wrld present
window.L["Wrld"] = Wrld;

// The default image path is broken when using Browserify - it searches the script tags on the page
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.0.1/dist/images/";

export default Wrld;
