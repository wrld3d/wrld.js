import { ElevationMode } from "../types/elevationMode";

export enum ElevationModeType {
  HEIGHT_ABOVE_GROUND = "heightAboveGround",
  HEIGHT_ABOVE_SEA_LEVEL = "heightAboveSeaLevel",
}

export const isValidElevationMode = (elevationMode: ElevationModeType | ElevationMode): boolean => {
  return (
    elevationMode === ElevationModeType.HEIGHT_ABOVE_GROUND ||
    elevationMode === ElevationModeType.HEIGHT_ABOVE_SEA_LEVEL
  );
};

export const getElevationModeInt = (elevationModeString: ElevationModeType): number => {
  const elevationModes = {
    heightAboveSeaLevel: 0,
    heightAboveGround: 1,
  };

  let elevationModeInt = elevationModes.heightAboveGround;

  if (
    elevationModeString &&
    elevationModeString.toLowerCase() === ElevationModeType.HEIGHT_ABOVE_SEA_LEVEL.toLowerCase()
  ) {
    elevationModeInt = elevationModes.heightAboveSeaLevel;
  }

  return elevationModeInt;
};
