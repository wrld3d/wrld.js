var MapModule = require("./map_module");

var MarkerHeight = function(marker) {
    this.marker = marker;
    this.previousHeight = 0.0;
    this.previousLevel = -1;
};

var DefaultAltitudeModule = function(emscriptenApi) {

    var MAX_LEVEL_TO_UPDATE_HEIGHTS = 13;

    var _emscriptenApi = emscriptenApi;
    var _ready = false;

    var _markers = {};

    this.addLayer = function(layer) {
        var id = L.stamp(layer);
        if (id in _markers) {
            return;
        }

        var markerHeight = new MarkerHeight(layer);
        _markers[id] = markerHeight;
    };

    this.removeLayer = function(layer) {
        var id = L.stamp(layer);

        if (id in _markers) {
            delete _markers[id];
        }
    };

    this.onUpdate = function() {
        if (!_ready) {
            return;
        }

        var completedMarkers = [];

        for (var id in _markers) {
            var markerHeight = _markers[id];
            var marker = markerHeight.marker;
            var latLng = marker.getLatLng();

            var heightUpdate = _emscriptenApi.spacesApi.getUpdatedAltitudeAtLatLng(latLng, markerHeight.previousHeight, markerHeight.previousLevel);

            if (heightUpdate !== null) {
                var newHeight = heightUpdate[0];
                var newLevel = heightUpdate[1];

                markerHeight.previousHeight = newHeight;
                markerHeight.previousLevel = newLevel;
                latLng.alt = newHeight;
                marker.setLatLng(latLng);

                if (newLevel >= MAX_LEVEL_TO_UPDATE_HEIGHTS) {
                    completedMarkers.push(marker);
                }
            }
        }

        var self = this;
        completedMarkers.forEach(function(layer) {
            self.removeLayer(layer);
        });
    };

    this.onInitialized = function() {
        _ready = true;
    };
};
DefaultAltitudeModule.prototype = MapModule;

module.exports = DefaultAltitudeModule;