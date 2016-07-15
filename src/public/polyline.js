var L = require("leaflet");
var space = require("./space");

function Polyline(latlngs, config) {
	var _map = null;
	var _points = [];

	(function() {
		for (var i=0; i < latlngs.length; ++i) {
			_points.push(L.latLng(latlngs[i]));
		}
	})();

	this.getPoints = function() {
		return _points;
	};

	this.addTo = function(map) {
		if (_map !== null) {
			this.removeFromMap();
		}
		_map = map;
		map._polylineModule.addPolyline(this);
		return this;
	};

	this.removeFromMap = function() {
		if (_map !== null) {
			_map._polylineModule.removePolyline(this);
			_map = null;
		}
		return this;
	};
}

var polyline = function(latlngs, config) {
	return new Polyline(latlngs, config || {});
};

module.exports = polyline;