var markers = require("../public/marker");

var IndoorEntranceMarkerUpdater = function(map, indoorsModule) {

	var _map = map;
	var _indoorsModule = indoorsModule;
	var _entranceMarkers = {};
	var _layerGroup = L.layerGroup([]);

	var _entranceIcon = L.icon({
	    iconUrl: "https://cdn-webgl.wrld3d.com/wrldjs/resources/indoor_map_entrance_marker.png",
	    iconRetinaUrl: "https://cdn-webgl.wrld3d.com/wrldjs/resources/indoor_map_entrance_marker@2.png",
	    iconSize: [48, 48],
	    iconAnchor: [24, 48]
	});

	var _addEntranceMarker = function(event) {
		var entrance = event.entrance;
		var id = entrance.getIndoorMapId();

		var marker = _createEntranceMarker(entrance);
		marker.addTo(_layerGroup);
		_entranceMarkers[id] = marker;
	};

	var _removeEntranceMarker = function(event) {
		var entrance = event.entrance;
		var id = entrance.getIndoorMapId();

		var marker = _entranceMarkers[id];
		_layerGroup.removeLayer(marker);
		delete _entranceMarkers[id];
	};

	var _createEntranceMarker = function(entrance) {
		var marker = markers.marker(entrance.getLatLng(), {
			title: entrance.getIndoorMapName(),
			icon: _entranceIcon
		});
		marker.on("click", function() {
			_indoorsModule.enter(entrance);
		});
		return marker;
	};

	var _showEntranceMarkers = function() {
		_map.addLayer(_layerGroup);
	};

	var _hideEntranceMarkers = function() {
		_map.removeLayer(_layerGroup);
	};

	_showEntranceMarkers();

	_indoorsModule.on("indoorentranceadd", _addEntranceMarker);
	_indoorsModule.on("indoorentranceremove", _removeEntranceMarker);

	_indoorsModule.on("indoormapenter", _hideEntranceMarkers);
	_indoorsModule.on("indoormapexit", _showEntranceMarkers);

	this.removeAllEntranceMarkers = function() {
		_layerGroup.clearLayers();
		_entranceMarkers = {};
	};

};

module.exports = IndoorEntranceMarkerUpdater;