export { buildingHighlight, BuildingHighlight } from "./building_highlight";
export {
  buildingHighlightOptions,
  BuildingHighlightOptions,
  BuildingHighlightSelectionType,
  HeightRange,
} from "./building_highlight_options";
export { BuildingInformation } from "./building_information";
export { BuildingDimensions } from "./building_dimensions";
export { BuildingContour } from "./building_contour";

import type { WrldEvent, EventHandler } from "../../types/event";
import type { BuildingHighlight } from "./building_highlight";

export type FindBuildingResult = {
  found: boolean;
  point: L.LatLng;
};

export type BuildingInformationReceivedEvent = WrldEvent<EventType> & {
  buildingHighlight: BuildingHighlight;
};

export type BuildingInformationReceivedEventHandler = EventHandler<BuildingInformationReceivedEvent>;

export type EventType = "buildinginformationreceived";
