var OutlinePolygonRing = function(latLngPoints) {
  var _latLngPoints = latLngPoints;

  this.getLatLngPoints = function() {
      return _latLngPoints;
  };

};

module.exports = OutlinePolygonRing;
