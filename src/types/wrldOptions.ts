import type { MapId, MapFloorId } from "../public/map";
import type ElevationMode from "./elevationMode";
import type DisplayOption from "./displayOption";

export type WrldOptions = {
  elevation?: number;
  elevationMode?: ElevationMode;
  indoorMapId?: MapId;
  indoorMapFloorId?: MapFloorId;
  displayOption?: DisplayOption;
};
