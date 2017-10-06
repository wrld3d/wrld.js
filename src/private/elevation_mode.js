var ElevationModeType = {
    HEIGHT_ABOVE_GROUND: "heightAboveGround",
    HEIGHT_ABOVE_SEA_LEVEL: "heightAboveSeaLevel"
};

function isValidElevationMode(elevationMode) {
    return elevationMode === ElevationModeType.HEIGHT_ABOVE_GROUND || elevationMode === ElevationModeType.HEIGHT_ABOVE_SEA_LEVEL;
}

module.exports = {
    ElevationModeType: ElevationModeType,
    isValidElevationMode: isValidElevationMode
};

