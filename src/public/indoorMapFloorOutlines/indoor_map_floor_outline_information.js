var IndoorMapFloorOutlineInformation = function(indoorMapId, indoorMapFloorId) {

  var _nativeId = null;
  var _map = null;
  var _indoorMapId = indoorMapId;
  var _indoorMapFloorId = indoorMapFloorId;
  var _outlinePolygons = [];
  var _isLoaded = false;

  this.getIndoorMapId = function() {
      return _indoorMapId;
  };

  this.getIndoorMapFloorId = function() {
      return _indoorMapFloorId;
  };
  
  this.getIndoorMapFloorOutlinePolygons = function() {
      return _outlinePolygons;
  };

  this.getIsLoaded = function() {
      return _isLoaded;
  };

  this.getId = function() {
      return _nativeId;
  };

  this.addTo = function(map) {
      if (_map !== null) {
          this.remove();
      }
      _map = map;
      _map.indoorMapFloorOutlines._getImpl().addIndoorMapFloorOutlineInformation(this);
      return this;
  };

  this.remove = function() {
      if (_map !== null) {
          _map.indoorMapFloorOutlines._getImpl().removeIndoorMapFloorOutlineInformation(this);
          _map = null;
      }
      return this;
  };

  this._setNativeHandle = function(nativeId) {
      _nativeId = nativeId;
  };

  this._setData = function(data) {
      _outlinePolygons = data;
      _isLoaded = true;
  };
};

var indoorMapFloorOutlineInformation = function(indoorMapId, indoorMapFloorId) {
  return new IndoorMapFloorOutlineInformation(indoorMapId, indoorMapFloorId);
};

module.exports = {
  IndoorMapFloorOutlineInformation: IndoorMapFloorOutlineInformation,
  indoorMapFloorOutlineInformation: indoorMapFloorOutlineInformation
};
