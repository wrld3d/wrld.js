import type { EventHandler } from "./event";
import { Map, MapId, MapFloorId } from "../public/map";

declare namespace indoorMapFloorOutlines {
  interface IndoorMapFloorOutlineInformationLoadedEvent extends Event { indoorMapFloorOutlineInformation: indoorMapFloorOutlines.IndoorMapFloorOutlineInformation }
  type IndoorMapFloorOutlineInformationLoadedEventHandler = EventHandler<IndoorMapFloorOutlineInformationLoadedEvent>;

  type EventType = "indoormapflooroutlineinformationloaded";

  class IndoorMapFloorOutlines {
      on(type: "indoormapflooroutlineinformationloaded", fn: IndoorMapFloorOutlineInformationLoadedEventHandler): void;
      once(type: "indoormapflooroutlineinformationloaded", fn: IndoorMapFloorOutlineInformationLoadedEventHandler): void;
      off(event: EventType, handler: (e: Event) => void): this;
      /** @internal */
      _getImpl(): any;
  }

  class IndoorMapFloorOutlineInformation {
      constructor(indoorMapId: MapId, indoorMapFloorId: MapFloorId);
      getIndoorMapId(): MapId;
      getIndoorMapFloorId(): MapFloorId;
      getIndoorMapFloorOutlinePolygons(): IndoorMapFloorOutlinePolygon[];
      getIsLoaded(): boolean;
      getId(): number;
      addTo(map: Map): this;
      remove(): this;
  }
  
  function indoorMapFloorOutlineInformation(indoorMapId: MapId, indoorMapFloorId: MapFloorId): IndoorMapFloorOutlineInformation;

  class IndoorMapFloorOutlinePolygon {
      getOuterRing(): IndoorMapFloorOutlinePolygonRing;
      getInnerRings(): IndoorMapFloorOutlinePolygonRing[];
  }

  class IndoorMapFloorOutlinePolygonRing {
      getLatLngPoints(): L.LatLng[];
  }
}

export default indoorMapFloorOutlines;