var IndoorMapEntityInformationLoadStateType = {
    NONE: "None",
    PARTIAL: "Partial",
    COMPLETE: "Complete"
};

var IndoorMapEntityInformation = function(indoorMapId) {
    
    var _nativeId = null;
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

    /**
     * Returns the auto-incrementing unique id of this IndoorMapEntityInformation object.
     * @returns {number}
     */
    this.getId = function() {
        return _nativeId;
    };

    /**
     * Returns the auto-incrementing unique id of this IndoorMapEntityInformation object.
     * @deprecated use {@link IndoorMapEntityInformation.getId}
     * @returns {number}
     */
    this.getNativeId = function() {
        return _nativeId;
    };

    this.addTo = function(map) {
        if (_map !== null) {
            this.remove();
        }
        _map = map;
        _map.indoorMapEntities._getImpl().addIndoorMapEntityInformation(this);
        return this;
    };

    this.remove = function() {
        if (_map !== null) {
            _map.indoorMapEntities._getImpl().removeIndoorMapEntityInformation(this);
            _map = null;
        }
        return this;
    };

    this._setNativeHandle = function(nativeId) {
        _nativeId = nativeId;
    };

    this._setData = function(data) {
        _indoorMapEntities = data.IndoorMapEntities;

        switch(data.LoadState)
        {
            case 0:
                _loadState = IndoorMapEntityInformationLoadStateType.NONE;
                break;
            case 1:
                _loadState = IndoorMapEntityInformationLoadStateType.PARTIAL;
                break;
            case 2:
                _loadState = IndoorMapEntityInformationLoadStateType.COMPLETE;
                break;
        }
    };
};

var indoorMapEntityInformation = function(indoorMapId) {
    return new IndoorMapEntityInformation(indoorMapId);
};

module.exports = {
    IndoorMapEntityInformation: IndoorMapEntityInformation,
    indoorMapEntityInformation: indoorMapEntityInformation
};