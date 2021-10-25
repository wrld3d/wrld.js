import type { WrldEvent } from "../event";
import type { IndoorMapEntityInformationModuleImpl } from "../../private/modules/indoor_map_entity_information_module";
import type {
  EventType,
  IndoorMapEntityInformationChangedEvent,
  IndoorMapEntityInformationChangedEventHandler,
} from "../../public/indoorMapEntities";

// type definition for the indoor map entities module - remove once the module is written in TypeScript
declare class IndoorMapEntitiesModule {
  on(type: IndoorMapEntityInformationChangedEvent, fn: IndoorMapEntityInformationChangedEventHandler): void;
  once(type: IndoorMapEntityInformationChangedEvent, fn: IndoorMapEntityInformationChangedEventHandler): void;
  off(event: EventType, handler: (e: WrldEvent) => void): this;
  /** @internal */
  _getImpl(): IndoorMapEntityInformationModuleImpl;
}

export type { IndoorMapEntitiesModule };
