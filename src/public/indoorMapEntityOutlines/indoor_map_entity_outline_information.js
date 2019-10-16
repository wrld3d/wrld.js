var IndoorMapEntityOutlineInformation = function(indoorMapId, indoorMapFloorId) {

  var _nativeId = null;
  var _map = null;
  var _indoorMapId = indoorMapId;
  var _indoorMapFloorId = indoorMapFloorId;
  var _outlineEntities = [];
  var _isLoaded = false;

  this.getIndoorMapId = function() {
      return _indoorMapId;
  };

  this.getIndoorMapFloorId = function() {
      return _indoorMapFloorId;
  };
  
  this.getIndoorMapEntityOutlinePolygons = function() {
      return _outlineEntities;
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
      _map.indoorMapEntityOutlines._getImpl().addIndoorMapEntityOutlineInformation(this);
      return this;
  };

  this.remove = function() {
      if (_map !== null) {
          _map.indoorMapEntityOutlines._getImpl().removeIndoorMapEntityOutlineInformation(this);
          _map = null;
      }
      return this;
  };

  this._setNativeHandle = function(nativeId) {
      _nativeId = nativeId;
  };

  this._setData = function(data) {
      _outlineEntities = data;
      _isLoaded = true;
  };
};

var indoorMapEntityOutlineInformation = function(indoorMapId, indoorMapFloorId) {
  return new IndoorMapEntityOutlineInformation(indoorMapId, indoorMapFloorId);
};

module.exports = {
  IndoorMapEntityOutlineInformation: IndoorMapEntityOutlineInformation,
  indoorMapEntityOutlineInformation: indoorMapEntityOutlineInformation
};
