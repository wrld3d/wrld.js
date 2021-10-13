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

  export type {
    WrldEvent as Event,
    EventHandler,
    Color,
    ElevationMode,
    Vector3,
    Vector4,
  };

  const Wrld: typeof L & {
    Map: typeof Map,
    map: (element: HTMLElement | string, apiKey: string, options?: Map.Options) => Map,
    Marker: typeof Marker,
    marker: (latLng: L.LatLngExpression, options?: Marker.Options) => Marker,
    Popup: typeof Popup,
    popup: (options?: Popup.Options, source?: L.Layer) => Popup,
    Polygon: typeof Polygon,
    polygon: (latlngs: L.LatLngTuple[] | L.LatLngTuple[][], options?: Polygon.Options) => Polygon,
    Polyline: typeof Polyline,
    polyline: (latlngs: L.LatLngExpression[], options?: Polyline.Options) => Polyline,
    // TODO: L.circle
    // TODO: L.rectangle
    Heatmap: typeof Heatmap,
    heatmap: (pointData: Heatmap.PointData[], options?: Heatmap.Options) => Heatmap,
    prop: (name: string, geometryId: string, location: L.LatLngExpression, options?: props.PropOptions) => props.Prop,
    props: typeof props,
    indoors: typeof indoors,
    themes: typeof themes,
    buildings: typeof buildings,
    indoorMapEntities: typeof indoorMapEntities,
    indoorMapFloorOutlines: typeof indoorMapFloorOutlines,

    native: {
      Polygon: typeof Polygon,
      polygon: (latlngs: L.LatLngTuple[] | L.LatLngTuple[][], options?: Polygon.Options) => Polygon,
      Polyline: typeof Polyline,
      polyline: (latlngs: L.LatLngExpression[], options?: Polyline.Options) => Polyline,
    }
  };

  export default Wrld;
}
