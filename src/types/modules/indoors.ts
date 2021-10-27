import type { EventHandler } from "../event";
import type {
  IndoorMap,
  IndoorMapFloor,
  IndoorMapEntrance,
  EnterConfig,
  IndoorMapEventHandler,
  IndoorMapFloorEventHandler,
  IndoorMapEntranceEventHandler,
  IndoorMapEntityEventHandler,
  EventType,
} from "../../public/indoors";
import { MapId, MapFloorId } from "../../public/map";
import { ColorArray } from "../color";

declare class IndoorsModule {
  isIndoors(): boolean;
  enter(indoorMap: IndoorMapEntrance | IndoorMap | string, config?: EnterConfig): boolean;
  exit(): this;
  getActiveIndoorMap(): IndoorMap | null;
  getFloor(): IndoorMapFloor | null;
  setFloor(floor: IndoorMapFloor | string | number): boolean;
  moveUp(numberOfFloors?: number): boolean;
  moveDown(numberOfFloors?: number): boolean;
  expand(): this;
  collapse(): this;
  setFloorInterpolation(value: number): this;
  getFloorInterpolation(): number;
  setFloorFromInterpolation(value: number): boolean;
  setEntityHighlights(
    ids: string | string[],
    highlightColour: ColorArray,
    indoorId?: string,
    highlightBorderThickness?: number
  ): void;
  clearEntityHighlights(ids: string | string[], indoorId?: string): void;
  tryGetReadableName(indoorMapId: MapId): string | null;
  tryGetFloorReadableName(indoorMapId: MapId, indoorMapFloorId: MapFloorId): string | null;
  tryGetFloorShortName(indoorMapId: MapId, indoorMapFloorId: MapFloorId): string | null;
  setBackgroundColor(color: string): void;
  hideLabelsForEntity(entityName: string): this;
  hideLabelsForEntities(entityNames: string[]): this;
  showLabelsForEntity(entityName: string): this;
  showLabelsForEntities(entityNames: string[]): this;
  showAllLabels(): this;
  on(event: "indoormapenter" | "indoormapexit", handler: IndoorMapEventHandler): this;
  on(event: "indoormapenter" | "indoormapexit", handler: IndoorMapEventHandler): this;
  on(event: "indoormapfloorchange", handler: IndoorMapFloorEventHandler): this;
  on(event: "indoorentranceadd" | "indoorentranceremove", handler: IndoorMapEntranceEventHandler): this;
  on(event: "indoorentityclick", handler: IndoorMapEntityEventHandler): this;
  on(event: EventType, handler: EventHandler): this;
  once(event: "indoormapenter" | "indoormapexit", handler: IndoorMapEventHandler): this;
  once(event: "indoormapenter" | "indoormapexit", handler: IndoorMapEventHandler): this;
  once(event: "indoormapfloorchange", handler: IndoorMapFloorEventHandler): this;
  once(event: "indoorentranceadd" | "indoorentranceremove", handler: IndoorMapEntranceEventHandler): this;
  once(event: "indoorentityclick", handler: IndoorMapEntityEventHandler): this;
  once(event: EventType, handler: EventHandler): this;
  off(event: EventType, handler: (e: Event) => void): this;
}

export type { IndoorsModule };
