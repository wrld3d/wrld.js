var IndoorMapEntityInformation = function(indoorMapId) {
    
    var _id = null;
    var _map = null;
    var _indoorMapId = indoorMapId;

    this.getIndoorMapId = function() {
        return _indoorMapId;
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

    this._setNativeHandle = function(nativeId) {
        _id = nativeId;
    };
};

var indoorMapEntityInformation = function(indoorMapId) {
    return new IndoorMapEntityInformation(indoorMapId);
};

module.exports = {
    IndoorMapEntityInformation: IndoorMapEntityInformation,
    indoorMapEntityInformation: indoorMapEntityInformation
};