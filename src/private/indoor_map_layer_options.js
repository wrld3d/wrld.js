const _getOptionsPropertyOrNull = function(layer, propertyName) {
    if (typeof layer.options === "undefined") {
        return null;
    }

    if (propertyName in layer.options) {
        return layer.options[propertyName];
    }

    return null;
};

export const getIndoorMapId = function(layer) {
    var indoorMapId = _getOptionsPropertyOrNull(layer, "indoorMapId");    
    return indoorMapId === "" ? null : indoorMapId;
};

export const hasIndoorMap = function(layer) {
    return getIndoorMapId(layer) !== null;
};

export const getIndoorMapFloorId = function(layer) {
    return _getOptionsPropertyOrNull(layer, "indoorMapFloorId");
};

export const getIndoorMapFloorIndex = function(layer) {
    var indoorMapFloorIndex = _getOptionsPropertyOrNull(layer, "indoorMapFloorIndex");

    if (indoorMapFloorIndex !== null) {
        return indoorMapFloorIndex;
    }

    // try a legacy-named option to maintain backwards compat
    return _getOptionsPropertyOrNull(layer, "indoorFloorIndex");
};

export const getLayerDisplayOption = function(layer) {
    var displayOption = _getOptionsPropertyOrNull(layer, "displayOption") || "currentFloor";
    return displayOption;
};

export const matchesCurrentFloor = function(activeIndoorMapFloorId, activeIndoorMapFloorIndex, layer) {
    if (activeIndoorMapFloorId === getIndoorMapFloorId(layer)) {
        return true;
    }
    
    return activeIndoorMapFloorIndex === getIndoorMapFloorIndex(layer);
};

export const matchesIndoorMap = function(activeIndoorMapId, activeIndoorMapFloorId, activeIndoorMapFloorIndex, layer) {  
    var displayOption = getLayerDisplayOption(layer);
    
    if (displayOption === "always") {
        return true;
    }

    if (displayOption === "currentIndoorMap" && activeIndoorMapId === getIndoorMapId(layer)) {
        return true;
    }        

    if (displayOption === "currentFloor" && 
        activeIndoorMapId === getIndoorMapId(layer) &&
        matchesCurrentFloor(activeIndoorMapFloorId, activeIndoorMapFloorIndex, layer)
    ) {
        return true;
    }

    return false;

};

const _copyOption = function(sourceOptions, destOptions, sourcePropertyName, destPropertyName) {
    if (!(sourcePropertyName in sourceOptions)) {
        return;
    }

    if (destPropertyName in destOptions) {
        return;
    }    
    
    destOptions[destPropertyName] = sourceOptions[sourcePropertyName];
};

export const copyIndoorMapOptions = function(sourceOptions, destOptions) {
    _copyOption(sourceOptions, destOptions, "indoorMapId", "indoorMapId");
    _copyOption(sourceOptions, destOptions, "indoorMapFloorId", "indoorMapFloorId");
    _copyOption(sourceOptions, destOptions, "indoorMapFloorIndex", "indoorMapFloorIndex");
    _copyOption(sourceOptions, destOptions, "indoorFloorIndex", "indoorMapFloorIndex");
};
