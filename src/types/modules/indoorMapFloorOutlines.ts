import { IndoorMapFloorOutlineInformationModuleImpl } from "../../private/modules/indoor_map_floor_outline_information_module";
import { EventType, IndoorMapFloorOutlineInformationLoadedEventHandler } from "../../public/indoorMapFloorOutlines";

declare class IndoorMapFloorOutlinesModule {
  on(type: EventType, fn: IndoorMapFloorOutlineInformationLoadedEventHandler): void;
  once(type: EventType, fn: IndoorMapFloorOutlineInformationLoadedEventHandler): void;
  off(event: EventType, handler: (e: Event) => void): this;
  /** @internal */
  _getImpl(): IndoorMapFloorOutlineInformationModuleImpl;
}

export type { IndoorMapFloorOutlinesModule };
