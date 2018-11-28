var ElevationModeType = {
    HEIGHT_ABOVE_GROUND: "heightAboveGround",
    HEIGHT_ABOVE_SEA_LEVEL: "heightAboveSeaLevel"
};

function isValidElevationMode(elevationMode) {
    return elevationMode === ElevationModeType.HEIGHT_ABOVE_GROUND || elevationMode === ElevationModeType.HEIGHT_ABOVE_SEA_LEVEL;
}

function getElevationModeInt(elevationModeString) {
    var elevationModes = {
        heightAboveSeaLevel: 0,
        heightAboveGround: 1
    };

    var elevationModeInt = elevationModes.heightAboveGround;

    if (elevationModeString && 
        elevationModeString.toLowerCase() === ElevationModeType.HEIGHT_ABOVE_SEA_LEVEL.toLowerCase()) {
        elevationModeInt = elevationModes.heightAboveSeaLevel;
    }

    return elevationModeInt;
}

module.exports = {
    ElevationModeType: ElevationModeType,
    isValidElevationMode: isValidElevationMode,
    getElevationModeInt: getElevationModeInt
};

