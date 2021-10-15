import L from "leaflet";
import { getMapById, map } from "./public/map";
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

import "./types/window";
import "./private/polyfills.js";

const Wrld = {
  ...L,

  map: map,
  getMapById: getMapById,

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
