export {
  indoorMapFloorOutlineInformation,
  IndoorMapFloorOutlineInformation,
} from "./indoor_map_floor_outline_information";
export { IndoorMapFloorOutlinePolygon } from "./indoor_map_floor_outline_polygon";
export { IndoorMapFloorOutlinePolygonRing } from "./indoor_map_floor_outline_polygon_ring";

import type { WrldEvent, EventHandler } from "../../types/event";
import type { IndoorMapFloorOutlineInformation } from "./indoor_map_floor_outline_information";

export type IndoorMapFloorOutlineInformationLoadedEvent = WrldEvent<EventType> & {
  indoorMapFloorOutlineInformation: IndoorMapFloorOutlineInformation;
};

export type IndoorMapFloorOutlineInformationLoadedEventHandler =
  EventHandler<IndoorMapFloorOutlineInformationLoadedEvent>;

export type EventType = "indoormapflooroutlineinformationloaded";
