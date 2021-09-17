export function IndoorMapFloorOutlinePolygon(outerRing, innerRings) {
  var _outerRing = outerRing;
  var _innerRings = innerRings;

  this.getOuterRing = () => _outerRing;

  this.getInnerRings = () => _innerRings;
}

export default IndoorMapFloorOutlinePolygon;
