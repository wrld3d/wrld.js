var L = require("leaflet");
var space = require("./space");

var Polygon = function(latLngs, config) {
	var _map = null;
	var _outerRing = [];
	var _holes = [];
  var _config = config || {};

	function loadLatLngs(coords){
    var points = [];
		coords.forEach(function(coord) {
			points.push(L.latLng(coord));
		});
    return points;
	}

  var arrayDepth = 0;
  var testElement = latLngs;
  do {
    testElement = testElement[0];
    arrayDepth++;
  } while (Array.isArray(testElement));

  if (arrayDepth === 2)
  {
    _outerRing = loadLatLngs(latLngs);
  }
  else if (arrayDepth === 3)
  {
    _outerRing = loadLatLngs(latLngs[0]);
    var holeLatLngs = latLngs.splice(1);
    holeLatLngs.forEach(function(holeLatLng) {
      _holes.push(loadLatLngs(holeLatLng));
    });
  }
  else
  {
    throw new Error("Incorrect array input format.");
  }

	var _color = config["color"] || new space.Vector4(0, 0, 255, 128);
	var _colorNeedsChanged = true;


	this.getColor = function() {
		return _color;
	};

	this.setColor = function(color) {
		_color = color;
		_colorNeedsChanged = true;
    return this;
	};

	this.addHole = function(points) {
    _holes.push(loadLatLngs(points));
		return this;
	};

	this.getHoles = function() {
		return _holes;
	};

	this.getPoints = function() {
		return _outerRing;
	};

	this._colorNeedsChanged = function() {
		return _colorNeedsChanged;
	};

	this._onColorChanged = function() {
		_colorNeedsChanged = false;
	};

	this.addTo = function(map) {
		if (_map !== null) {
			this.remove();
		}
		_map = map;
		map._polygonModule.addPolygon(this);
		return this;
	};
	
	this.remove = function() {
		if (_map !== null) {
			_map._polygonModule.removePolygon(this);
			_map = null;
		}
		return this;
	};

  this._getConfig = function() {
    return _config;
  };
};

var polygon = function(latlngs, config) {
	return new Polygon(latlngs, config || {});
};

module.exports = {
	Polygon: Polygon,
	polygon: polygon
};