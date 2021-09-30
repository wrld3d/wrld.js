import type L from "leaflet";
import type { WrldEvent, EventHandler } from "./event";
import type Map from "./map";
import type Color from "./color";

declare namespace buildings {
  type FindBuildingResult = {
      found: boolean;
      point: L.LatLng;
  };

  interface BuildingInformationReceivedEvent extends WrldEvent { buildingHighlight: buildings.BuildingHighlight }
  type BuildingInformationReceivedEventHandler = EventHandler<BuildingInformationReceivedEvent>;

  type EventType = "buildinginformationreceived";

  class Buildings {
      findBuildingAtScreenPoint(screenPoint: L.Point): FindBuildingResult;
      findBuildingAtLatLng(latLng: L.LatLng): FindBuildingResult;
      on(type: "buildinginformationreceived", fn: BuildingInformationReceivedEventHandler): void;
      once(type: "buildinginformationreceived", fn: BuildingInformationReceivedEventHandler): void;
      off(event: EventType, handler: (e: WrldEvent) => void): this;
  }

  class BuildingHighlight {
      getId(): number;
      getOptions(): BuildingHighlightOptions;
      getColor(): { x: number; y: number; z: number; w: number; };
      getBuildingInformation(): null | BuildingInformation;
      addTo(map: Map): this;
      remove(): this;
      setColor(color: Color): this;
  }
  
  class BuildingHighlightOptions {
      highlightBuildingAtLocation(latLng: L.LatLng): this;
      highlightBuildingAtScreenPoint(screenPoint: L.Point): this;
      color(color: Color): this
      informationOnly(): this;
  }
  
  function buildingHighlight(options: BuildingHighlightOptions): BuildingHighlight;
  
  function buildingHighlightOptions(): BuildingHighlightOptions;
  
  class BuildingInformation {
      getBuildingId(): string;
      getBuildingDimensions(): BuildingDimensions;
      getBuildingContours(): BuildingContour[];
  }
  
  class BuildingDimensions {
      getBaseAltitude(): number;
      getTopAltitude(): number;
      getCentroid(): L.LatLng;
  }
  
  class BuildingContour {
      getBottomAltitude(): number;
      getTopAltitude(): number;
      getPoints(): L.LatLng[];
  }
}

export default buildings;