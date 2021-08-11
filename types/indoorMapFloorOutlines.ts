import type { EventHandler } from "./event";
import type Map from "./map";

declare namespace indoorMapFloorOutlines {
  interface IndoorMapFloorOutlineInformationLoadedEvent extends Event { indoorMapFloorOutlineInformation: indoorMapFloorOutlines.IndoorMapFloorOutlineInformation }
  type IndoorMapFloorOutlineInformationLoadedEventHandler = EventHandler<IndoorMapFloorOutlineInformationLoadedEvent>;

  type EventType = "indoormapflooroutlineinformationloaded";

  class IndoorMapFloorOutlines {
      on(type: "indoormapflooroutlineinformationloaded", fn: IndoorMapFloorOutlineInformationLoadedEventHandler): void;
      once(type: "indoormapflooroutlineinformationloaded", fn: IndoorMapFloorOutlineInformationLoadedEventHandler): void;
      off(event: EventType, handler: (e: Event) => void): this;
  }

  class IndoorMapFloorOutlineInformation {
      constructor(indoorMapId: Map.MapId, indoorMapFloorId: Map.MapFloorId);
      getIndoorMapId(): Map.MapId;
      getIndoorMapFloorId(): Map.MapFloorId;
      getIndoorMapFloorOutlinePolygons(): IndoorMapFloorOutlinePolygon[];
      getIsLoaded(): boolean;
      getId(): number;
      addTo(map: Map): this;
      remove(): this;
  }
  
  function indoorMapFloorOutlineInformation(indoorMapId: Map.MapId, indoorMapFloorId: Map.MapFloorId): IndoorMapFloorOutlineInformation;

  class IndoorMapFloorOutlinePolygon {
      getOuterRing(): IndoorMapFloorOutlinePolygonRing;
      getInnerRings(): IndoorMapFloorOutlinePolygonRing[];
  }

  class IndoorMapFloorOutlinePolygonRing {
      getLatLngPoints(): L.LatLng[];
  }
}

export default indoorMapFloorOutlines;