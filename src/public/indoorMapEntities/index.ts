export { indoorMapEntityInformation, IndoorMapEntityInformation } from "./indoor_map_entity_information";
export { IndoorMapEntity } from "./indoor_map_entity";

import type { WrldEvent, EventHandler } from "../../types/event";
import type { IndoorMapEntityInformation } from "./indoor_map_entity_information";

export type IndoorMapEntityInformationChangedEvent = WrldEvent<EventType> & {
  indoorMapEntityInformation: IndoorMapEntityInformation;
};
export type IndoorMapEntityInformationChangedEventHandler = EventHandler<IndoorMapEntityInformationChangedEvent>;

export type EventType = "indoormapentityinformationchanged";
