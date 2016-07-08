var L = require("leaflet");
var space = require("./space");

function Polygon(latlngs, config) {
	var _map = null;
	var _points = [];

	(function() {
		for (var i=0; i < latlngs.length; ++i) {
			_points.push(L.latLng(latlngs[i]));
		}
	})();

	var _color = new space.Vector4(config["color"] || [0.0, 0.0, 1.0, 0.5]);
	var _colorNeedsChanged = true;


	this.getColor = function() {
		return new space.Vector4(_color);
	};

	this.setColor = function(color) {
		_color = new space.Vector4(color);
		_colorNeedsChanged = true;
	};

	this.getPoints = function() {
		return _points;
	};

	this.colorNeedsChanged = function() {
		return _colorNeedsChanged;
	};

	this.onColorChanged = function() {
		_colorNeedsChanged = false;
	};

	this.addTo = function(map) {
		if (_map !== null) {
			this.removeFromMap();
		}
		_map = map;
		map._polygonModule.addPolygon(this);
		return this;
	};

	this.removeFromMap = function() {
		if (_map !== null) {
			_map._polygonModule.removePolygon(this);
			_map = null;
		}
		return this;
	};
}

var polygon = function(latlngs, config) {
	return new Polygon(latlngs, config || {});
};

module.exports = polygon;