export * from "leaflet";
import { getMapById, map } from "./public/map";
import Map from "./types/map";
export { marker, Marker } from "./public/marker";
export { popup, Popup } from "./public/popup.js";
export { circle, Circle } from "./public/circle.js";
export { heatmap, Heatmap } from "./public/heatmap.js";
export { prop, Prop } from "./public/prop.js";
// shims
import * as polygonNative from "./public/polygon.js";
import * as polylineNative from "./public/polyline.js";
import * as polygonShim from "./private/polygon_shim.js";
import * as polylineShim from "./private/polyline_shim.js";
import * as rectangleShim from "./private/rectangle_shim.js";
// modules
import * as indoors from "./public/indoors/indoors";
import * as space from "./public/space";
import * as themes from "./public/themes";
import * as buildings from "./public/buildings/buildings";
import * as indoorMapEntities from "./public/indoorMapEntities/indoorMapEntities";
import * as indoorMapFloorOutlines from "./public/indoorMapFloorOutlines/indoorMapFloorOutlines";
// types
export type { WrldEvent as Event, EventHandler } from "./types/event";
export type { Color } from "./types/color";
export type { ElevationMode } from "./types/elevationMode";
export type { Vector3, Vector4 } from "./types/vector";

import "./types/window";
import "./private/polyfills.js";

const Rectangle = rectangleShim.RectangleShim;
const rectangle = rectangleShim.rectangleShim;
const Polygon = polygonShim.PolygonShim;
const polygon = polygonShim.polygonShim;
const Polyline = polylineShim.PolylineShim;
const polyline = polylineShim.polylineShim;

const native = {
  Polygon: polygonNative.Polygon,
  polygon: polygonNative.polygon,
  Polyline: polylineNative.Polyline,
  polyline: polylineNative.polyline,
};

export {
  Map,
  map,
  getMapById,
  Rectangle,
  rectangle,
  Polygon,
  polygon,
  Polyline,
  polyline,
  indoors,
  space,
  themes,
  buildings,
  indoorMapEntities,
  indoorMapFloorOutlines,
  native,
};
