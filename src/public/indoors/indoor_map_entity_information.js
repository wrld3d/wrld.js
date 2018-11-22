var IndoorMapEntityInformationLoadStateType = {
    NONE: "NONE",
    PARTIAL: "PARTIAL",
    COMPLETE: "COMPLETE"
};


var IndoorMapEntityInformation = function(indoorMapId) {
    
    var _id = null;
    var _map = null;
    var _indoorMapId = indoorMapId;
    var _indoorMapEntities = [];
    var _loadState = IndoorMapEntityInformationLoadStateType.NONE;

    this.getIndoorMapId = function() {
        return _indoorMapId;
    };
    
    this.getIndoorMapEntities = function() {
        return _indoorMapEntities;
    };

    this.getLoadState = function() {
        return _loadState;
    };

    this.getId = function() {
        return _id;
    };

    this.addTo = function(map) {
        if (_map !== null) {
            this.remove();
        }
        _map = map;
        _map.indoorMapEntityInformation._getImpl().addIndoorMapEntityInformation(this);
        return this;
    };

    this.remove = function() {
        if (_map !== null) {
            _map.indoorMapEntityInformation._getImpl().removeIndoorMapEntityInformation(this);
            _map = null;
        }
        return this;
    };

    this._setNativeHandle = function(nativeId) {
        _id = nativeId;
    };

    this._setData = function(data) {
        _indoorMapEntities = data.IndoorMapEntities;
        _loadState = data.LoadState;
    };
};

var indoorMapEntityInformation = function(indoorMapId) {
    return new IndoorMapEntityInformation(indoorMapId);
};

module.exports = {
    IndoorMapEntityInformation: IndoorMapEntityInformation,
    indoorMapEntityInformation: indoorMapEntityInformation
};