import type L from "leaflet";
import type { BuildingInformationReceivedEventHandler, EventType, FindBuildingResult } from "../../public/buildings";
import type { WrldEvent } from "../event";
import type { BuildingsModuleImpl } from "../../private/modules/buildings_module";

declare class BuildingsModule {
  findBuildingAtScreenPoint(screenPoint: L.Point): FindBuildingResult;
  findBuildingAtLatLng(latLng: L.LatLng): FindBuildingResult;
  on(type: "buildinginformationreceived", fn: BuildingInformationReceivedEventHandler): void;
  once(type: "buildinginformationreceived", fn: BuildingInformationReceivedEventHandler): void;
  off(event: EventType, handler: (e: WrldEvent) => void): this;
  /** @internal */
  _getImpl(): BuildingsModuleImpl;
}

export type { BuildingsModule };
