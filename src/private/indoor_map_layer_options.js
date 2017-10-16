var exports = module.exports = {};

var _getOptionsPropertyOrNull = function(layer, propertyName) {
    if (typeof layer.options === "undefined") {
        return null;
    }

    if (propertyName in layer.options) {
        return layer.options[propertyName];
    }

    return null;
};

exports.getIndoorMapId = function(layer) {
    var indoorMapId = _getOptionsPropertyOrNull(layer, "indoorMapId");    
    return indoorMapId === "" ? null : indoorMapId;
};

exports.hasIndoorMap = function(layer) {
    return this.getIndoorMapId(layer) !== null;
};

exports.getIndoorMapFloorId = function(layer) {
    return _getOptionsPropertyOrNull(layer, "indoorMapFloorId");
};

exports.getIndoorMapFloorIndex = function(layer) {
    var indoorMapFloorIndex = _getOptionsPropertyOrNull(layer, "indoorMapFloorIndex");

    if (indoorMapFloorIndex !== null) {
        return indoorMapFloorIndex;
    }

    // try a legacy-named option to maintain backwards compat
    return _getOptionsPropertyOrNull(layer, "indoorFloorIndex");
};

exports.getLayerDisplayOption = function(layer) {
    var displayOption = _getOptionsPropertyOrNull(layer, "displayOption") || "currentFloor";
    return displayOption;
};

exports.matchesCurrentFloor = function(activeIndoorMapFloorId, activeIndoorMapFloorIndex, layer) {
    if (activeIndoorMapFloorId === this.getIndoorMapFloorId(layer)) {
        return true;
    }
    
    return activeIndoorMapFloorIndex === this.getIndoorMapFloorIndex(layer);
};

exports.matchesIndoorMap = function(activeIndoorMapId, activeIndoorMapFloorId, activeIndoorMapFloorIndex, layer) {  
    var displayOption = this.getLayerDisplayOption(layer);
    
    if (displayOption === "always") {
        return true;
    }

    if (displayOption === "currentIndoorMap" && activeIndoorMapId === this.getIndoorMapId(layer)) {
        return true;
    }        

    if (displayOption === "currentFloor" && 
        activeIndoorMapId === this.getIndoorMapId(layer) &&
        this.matchesCurrentFloor(activeIndoorMapFloorId, activeIndoorMapFloorIndex, layer)
    ) {
        return true;
    }

    return false;

};

var _copyOption = function(sourceOptions, destOptions, sourcePropertyName, destPropertyName) {
    if (!(sourcePropertyName in sourceOptions)) {
        return;
    }

    if (destPropertyName in destOptions) {
        return;
    }    
    
    destOptions[destPropertyName] = sourceOptions[sourcePropertyName];
};

exports.copyIndoorMapOptions = function(sourceOptions, destOptions) {
    _copyOption(sourceOptions, destOptions, "indoorMapId", "indoorMapId");
    _copyOption(sourceOptions, destOptions, "indoorMapFloorId", "indoorMapFloorId");
    _copyOption(sourceOptions, destOptions, "indoorMapFloorIndex", "indoorMapFloorIndex");
    _copyOption(sourceOptions, destOptions, "indoorFloorIndex", "indoorMapFloorIndex");
};
