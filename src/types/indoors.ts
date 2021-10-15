import type { WrldEvent, EventHandler } from "./event";
import type Map from "./map";

declare namespace indoors {
  type EnterConfig = {
      animate?: boolean;
      latLng?: L.LatLng;
      distance?: number;
      orientation?: number
  }

  interface IndoorMapEvent extends WrldEvent { indoorMap: IndoorMap; }
  interface IndoorMapFloorEvent extends WrldEvent { floor: IndoorMapFloor; }
  interface IndoorMapEntranceEvent extends WrldEvent { entrance: IndoorMapEntrance; }
  interface IndoorMapEntityEvent extends WrldEvent { ids: string[]; }
  type IndoorMapEventHandler = EventHandler<IndoorMapEvent>;
  type IndoorMapFloorEventHandler = EventHandler<IndoorMapFloorEvent>;
  type IndoorMapEntranceEventHandler = EventHandler<IndoorMapEntranceEvent>;
  type IndoorMapEntityEventHandler = EventHandler<IndoorMapEntityEvent>;

  type EventType = "indoormapenter" | "indoormapexit" | "indoormapfloorchange" | "indoorentranceadd" | "indoorentranceremove" | "expandstart" | "expand" | "expandend" | "collapsestart" | "collapse" | "collapseend" | "indoorentityclick" | "indoormapenterrequested" | "indoormapload" | "indoormapunload" | "indoormapenterfailed";

  class Indoors {
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
      setEntityHighlights(ids: string | string[], highlightColour: [number, number, number, number?], indoorId?: string, highlightBorderThickness?: number): void;
      clearEntityHighlights(ids: string | string[], indoorId?: string): void;
      tryGetReadableName(indoorMapId: Map.MapId): string | null;
      tryGetFloorReadableName(indoorMapId: Map.MapId, indoorMapFloorId: Map.MapFloorId): string | null;
      tryGetFloorShortName(indoorMapId: Map.MapId, indoorMapFloorId: Map.MapFloorId): string | null;
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

  interface SearchTag {
      name: string;
      search_tag: string;
      icon_key: string;
  }

  class IndoorMap {
      exit(): void;
      getIndoorMapId(): Map.MapId;
      getIndoorMapName(): string;
      getFloorCount(): number;
      getFloors(): IndoorMapFloor[];
      getSearchTags(): SearchTag[];
  }

  class IndoorMapFloor {
      /**
       * Note: this is for compatibility with the existing API – the short name was exposed as id. The actual id property in the submission json is not accessible through this API.
       *
       * @deprecated use {@link IndoorMapFloor.getFloorShortName} instead.
       * @returns the short name of the floor.
       */
      getFloorId(): string;
      /**
       * @returns the z_order of the floor, as defined in the json submission.
      */
      getFloorZOrder(): number;
      getFloorIndex(): number;
      getFloorName(): string;
      getFloorShortName(): string;
  }

  class IndoorMapEntrance {
      getIndoorMapId(): Map.MapId;
      getIndoorMapName(): string;
      getLatLng(): L.LatLng;
  }
}

export default indoors;
