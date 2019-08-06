var IndoorMapFloorOutlinePolygon = function(outerRing, innerRings) {
  var _outerRing = outerRing;
  var _innerRings = innerRings;

  this.getOuterRing = function() {
      return _outerRing;
  };

  this.getInnerRings = function() {
      return _innerRings;
  };

};

module.exports = IndoorMapFloorOutlinePolygon;
