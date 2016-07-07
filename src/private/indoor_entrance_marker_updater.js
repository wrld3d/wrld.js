var markers = require("../public/marker");

var IndoorEntranceMarkerUpdater = function(map, indoorsModule) {

	var _map = map;
	var _indoorsModule = indoorsModule;
	var _entranceMarkers = {};
	var _layerGroup = L.layerGroup([]);

	var _entranceIcon = L.icon({
	    iconUrl: "https://cdn-webgl.eegeo.com/eegeojs/resources/indoor_map_entrance_marker.png",
	    iconRetinaUrl: "https://cdn-webgl.eegeo.com/eegeojs/resources/indoor_map_entrance_marker@2.png",
	    iconSize: [48, 48],
	    iconAnchor: [24, 48]
	});

	var _addEntranceMarker = function(entrance) {
		var id = entrance.getIndoorMapId();
		var name = entrance.getIndoorMapName();
		var latLng = entrance.getLatLng();

		var marker = _createEntranceMarker(id, name, latLng);
		marker.addTo(_layerGroup);
		_entranceMarkers[id] = marker;
	};

	var _removeEntranceMarker = function(entrance) {
		var id = entrance.getIndoorMapId();

		var marker = _entranceMarkers[id];
		_layerGroup.removeLayer(marker);
		delete _entranceMarkers[id];
	};

	var _createEntranceMarker = function(id, name, latLng) {
		var marker = markers.marker(latLng, {
			title: name,
			icon: _entranceIcon
		});
		marker.on("click", function() {
			_indoorsModule.enterIndoorMap(id);
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

	_indoorsModule.addIndoorMapEntranceAddedCallback(_addEntranceMarker);
	_indoorsModule.addIndoorMapEntranceRemovedCallback(_removeEntranceMarker);

	_indoorsModule.addIndoorMapEnteredCallback(_hideEntranceMarkers);
	_indoorsModule.addIndoorMapExitedCallback(_showEntranceMarkers);
};

module.exports = IndoorEntranceMarkerUpdater;