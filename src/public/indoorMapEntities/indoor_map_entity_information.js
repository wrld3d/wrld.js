const IndoorMapEntityInformationLoadStateType = {
    NONE: "None",
    PARTIAL: "Partial",
    COMPLETE: "Complete"
};

export function IndoorMapEntityInformation (indoorMapId) {
    
    var _nativeId = null;
    var _map = null;
    var _indoorMapId = indoorMapId;
    var _indoorMapEntities = [];
    var _loadState = IndoorMapEntityInformationLoadStateType.NONE;

    this.getIndoorMapId = () => _indoorMapId;
    
    this.getIndoorMapEntities = () => _indoorMapEntities;

    this.getLoadState = () => _loadState;

    /**
     * Returns the auto-incrementing unique id of this IndoorMapEntityInformation object.
     * @returns {number}
     */
    this.getId = () => _nativeId;

    /**
     * Returns the auto-incrementing unique id of this IndoorMapEntityInformation object.
     * @deprecated use {@link IndoorMapEntityInformation.getId}
     * @returns {number}
     */
    this.getNativeId = () => _nativeId;

    this.addTo = (map) => {
        if (_map !== null) {
            this.remove();
        }
        _map = map;
        _map.indoorMapEntities._getImpl().addIndoorMapEntityInformation(this);
        return this;
    };

    this.remove = () => {
        if (_map !== null) {
            _map.indoorMapEntities._getImpl().removeIndoorMapEntityInformation(this);
            _map = null;
        }
        return this;
    };

    this._setNativeHandle = (nativeId) => {
        _nativeId = nativeId;
    };

    this._setData = (data) => {
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
}

export const indoorMapEntityInformation = (indoorMapId) => new IndoorMapEntityInformation(indoorMapId);
