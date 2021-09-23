export function IndoorMapFloorOutlineInformation (indoorMapId, indoorMapFloorId) {
  var _nativeId = null;
  var _map = null;
  var _indoorMapId = indoorMapId;
  var _indoorMapFloorId = indoorMapFloorId;
  var _outlinePolygons = [];
  var _isLoaded = false;

  this.getIndoorMapId = () => _indoorMapId;

  this.getIndoorMapFloorId = () => _indoorMapFloorId;
  
  this.getIndoorMapFloorOutlinePolygons = () => _outlinePolygons;

  this.getIsLoaded = () => _isLoaded;

  this.getId = () => _nativeId;

  this.addTo = (map) => {
    if (_map !== null) {
        this.remove();
    }
    _map = map;
    _map.indoorMapFloorOutlines._getImpl().addIndoorMapFloorOutlineInformation(this);
    return this;
  };

  this.remove = () => {
    if (_map !== null) {
        _map.indoorMapFloorOutlines._getImpl().removeIndoorMapFloorOutlineInformation(this);
        _map = null;
    }
    return this;
  };

  this._setNativeHandle = (nativeId) => {
    _nativeId = nativeId;
  };

  this._setData = (data) => {
    _outlinePolygons = data;
    _isLoaded = true;
  };
}

export const indoorMapFloorOutlineInformation = (indoorMapId, indoorMapFloorId) =>
    new IndoorMapFloorOutlineInformation(indoorMapId, indoorMapFloorId);
