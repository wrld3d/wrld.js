import { IndoorMap, SearchTag } from "./indoor_map";
import { IndoorMapEntrance } from "./indoor_map_entrance";
import { IndoorMapFloor } from "./indoor_map_floor";

import type { WrldEvent, EventHandler } from "../../types/event";

export { IndoorMap, IndoorMapEntrance, IndoorMapFloor };

export type { SearchTag };

export type EnterConfig = {
  animate?: boolean;
  latLng?: L.LatLng;
  distance?: number;
  orientation?: number;
};

export interface IndoorMapEvent extends WrldEvent {
  indoorMap: IndoorMap;
}
export interface IndoorMapFloorEvent extends WrldEvent {
  floor: IndoorMapFloor;
}
export interface IndoorMapEntranceEvent extends WrldEvent {
  entrance: IndoorMapEntrance;
}
export interface IndoorMapEntityEvent extends WrldEvent {
  ids: string[];
}
export type IndoorMapEventHandler = EventHandler<IndoorMapEvent>;
export type IndoorMapFloorEventHandler = EventHandler<IndoorMapFloorEvent>;
export type IndoorMapEntranceEventHandler = EventHandler<IndoorMapEntranceEvent>;
export type IndoorMapEntityEventHandler = EventHandler<IndoorMapEntityEvent>;

export type EventType =
  | "indoormapenter"
  | "indoormapexit"
  | "indoormapfloorchange"
  | "indoorentranceadd"
  | "indoorentranceremove"
  | "expandstart"
  | "expand"
  | "expandend"
  | "collapsestart"
  | "collapse"
  | "collapseend"
  | "indoorentityclick"
  | "indoormapenterrequested"
  | "indoormapload"
  | "indoormapunload"
  | "indoormapenterfailed";
