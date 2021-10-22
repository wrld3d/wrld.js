import type L from "leaflet";
import type { WrldEvent, EventHandler } from "./event";
import type { Map, MapFloorId, MapId } from "../public/map";

declare namespace indoorMapEntities {

  interface IndoorMapEntityInformationChangedEvent extends WrldEvent { indoorMapEntityInformation: indoorMapEntities.IndoorMapEntityInformation }
  type IndoorMapEntityInformationChangedEventHandler = EventHandler<IndoorMapEntityInformationChangedEvent>;

  type EventType = "indoormapentityinformationchanged";

  class IndoorMapEntities {
      on(type: IndoorMapEntityInformationChangedEvent, fn: IndoorMapEntityInformationChangedEventHandler): void;
      once(type: IndoorMapEntityInformationChangedEvent, fn: IndoorMapEntityInformationChangedEventHandler): void;
      off(event: EventType, handler: (e: WrldEvent) => void): this;
       /** @internal */
       _getImpl(): any;
  }

  class IndoorMapEntity {
      constructor(indoorMapEntityId: string, indoorMapFloorId: MapFloorId, position: L.LatLng, outline: L.LatLngTuple[][]);
      getIndoorMapEntityId(): string;
      getIndoorMapFloorId(): MapFloorId;
      getPosition(): L.LatLng;
      getOutline(): L.LatLngTuple[][];
  }

  class IndoorMapEntityInformation {
      constructor(indoorMapId: MapId);
      /**
       * @returns the auto-incrementing unique id of this IndoorMapEntityInformation object.
       */
      getId(): number;
      getIndoorMapId(): MapId;
      getIndoorMapEntities(): IndoorMapEntity[];
      getLoadState(): "None" | "Partial" | "Complete";
      addTo(map: Map): this;
      remove(): this;
      /**
       * @deprecated use {@link IndoorMapEntityInformation.getId}
       * @returns the auto-incrementing unique id of this IndoorMapEntityInformation object.
       */
      getNativeId(): number;
  }
  
  function indoorMapEntityInformation(indoorMapId: MapId): IndoorMapEntityInformation;
}

export default indoorMapEntities;