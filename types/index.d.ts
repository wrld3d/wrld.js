// Types
import type L from "leaflet";
import type { WrldEvent, EventHandler } from "./event";
import type { Color } from "./color";
import type { ElevationMode } from "./elevationMode";
import type { Vector3, Vector4 } from "./vector";
// Imports
import Map from "./map";
import Marker from "./marker";
import props from "./props";
import Popup from "./popup";
import Polygon from "./polygon";
import Polyline from "./polyline";
import Heatmap from "./heatmap";
import themes from "./themes";
import buildings from "./buildings";
import indoors from "./indoors";
import indoorMapEntities from "./indoorMapEntities";
import indoorMapFloorOutlines from "./indoorMapFloorOutlines";

declare module "wrld.js" {
  declare function map(element: HTMLElement | string, apiKey: string, options?: Map.Options): Map;
  declare function marker(latLng: L.LatLngExpression, options?: Marker.Options): Marker;
  declare function popup(options?: Popup.Options, source?: L.Layer): Popup;
  declare function polygon(latlngs: L.LatLngTuple[] | L.LatLngTuple[][], options?: Polygon.Options): Polygon;
  declare function polyline(latlngs: L.LatLngExpression[], options?: Polyline.Options): Polyline;
  declare function prop(name: string, geometryId: string, location: L.LatLngExpression, options?: props.PropOptions): props.Prop;
  declare function heatmap(pointData: Heatmap.PointData[], options?: Heatmap.Options): Heatmap;

  export type {
    WrldEvent as Event,
    EventHandler,
    Color,
    ElevationMode,
    Vector3,
    Vector4,
  };

  export {
    Map,
    map,
    Marker,
    marker,
    Popup,
    popup,
    Polygon,
    polygon,
    Polyline,
    polyline,
    // TODO: L.circle
    // TODO: L.rectangle
    Heatmap,
    heatmap,
    prop,
    props,
    indoors,
    themes,
    buildings,
    indoorMapEntities,
    indoorMapFloorOutlines,
  };
}
