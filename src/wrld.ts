export * from "leaflet";
import "./types/leaflet";
import "./types/window";
import "./private/polyfills.js";

import { Map } from "./public/map";
import { map, getMapById } from "./public/map_factory";
// shims
export { marker, Marker } from "./public/marker";
export { circle, Circle } from "./public/circle";
export { heatmap, Heatmap } from "./public/heatmap";
export { polygon, Polygon } from "./public/polygon";
export { polyline, Polyline } from "./public/polyline";
export { rectangle, Rectangle } from "./public/rectangle";
// new modules
export { popup, Popup } from "./public/popup";
export { prop, Prop } from "./public/prop";
// namespaced modules
import * as native from "./public/native";
import * as indoors from "./public/indoors";
import * as space from "./public/space";
import * as themes from "./public/themes";
import * as buildings from "./public/buildings";
import * as indoorMapEntities from "./public/indoorMapEntities";
import * as indoorMapFloorOutlines from "./public/indoorMapFloorOutlines";
// types
export type { WrldEvent as Event, EventHandler } from "./types/event";
export type { Color } from "./types/color";
export type { ElevationMode } from "./types/elevationMode";
export type { MarkerOptions } from "./public/marker";
export type { PopupOptions } from "./public/popup";
export type { PropOptions } from "./public/prop";
export type { CircleOptions } from "./public/circle";
export type { PolygonOptions } from "./public/polygon";
export type { PolylineOptions } from "./public/polyline";
export type { RectangleOptions } from "./public/rectangle";
export type {
  HeatmapOptions,
  ColorStop,
  ColorStopArray,
  DensityStop,
  DensityStopArray,
  OcclusionMapFeature,
  PointData,
  WeightedPoint,
} from "./public/heatmap";
export type {
  MapFloorId,
  MapFloorIndex,
  MapId,
  MapOptions,
  ZoomPanOptions,
  PrecacheHandler,
  PrecacheResponse,
} from "./public/map";

export {
  Map,
  map,
  indoors,
  space,
  themes,
  buildings,
  indoorMapEntities,
  indoorMapFloorOutlines,
  native,
  /** @internal */
  getMapById,
};
