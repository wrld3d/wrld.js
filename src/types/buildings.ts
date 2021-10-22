import type L from "leaflet";
import { BuildingInformationReceivedEventHandler, EventType, FindBuildingResult } from "../public/buildings/buildings";
import type { WrldEvent } from "./event";

export declare class Buildings {
  findBuildingAtScreenPoint(screenPoint: L.Point): FindBuildingResult;
  findBuildingAtLatLng(latLng: L.LatLng): FindBuildingResult;
  on(type: "buildinginformationreceived", fn: BuildingInformationReceivedEventHandler): void;
  once(type: "buildinginformationreceived", fn: BuildingInformationReceivedEventHandler): void;
  off(event: EventType, handler: (e: WrldEvent) => void): this;
  /** @internal */
  _getImpl(): any;
}

export default Buildings;
