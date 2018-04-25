var indoorOptions = require("../private/indoor_map_layer_options.js");
var elevationMode = require("../private/elevation_mode.js");

var popups = require("./popup");

var EegeoDomUtil = require("../private/eegeo_dom_util");

var Marker = L.Marker.extend({
    initialize: function(latlng, options) {
        L.Marker.prototype.initialize.call(this, latlng, options);

        this.on("dragstart", this._onDragStart);
        this.on("drag", this._onDrag);
        this.on("dragend", this._onDragEnd);
        this._elevationBeforeDrag = 0;
        this._isDragging = false;
        this._latOffsetForDrag = 0;
        this._lngOffsetForDrag = 0;
    },    

    options: {
        elevation: 0,
        elevationMode: elevationMode.ElevationModeType.HEIGHT_ABOVE_GROUND
    },

    getElevation: function() {
        return this.options.elevation;
    },

    setElevation: function(elevation) {
        this.options.elevation = elevation;

        if (this._map !== null) {
            this._map._createPointMapping(this);
        }
        
        return this;
    },

    setElevationMode: function(mode) {
        if (elevationMode.isValidElevationMode(mode)) {
            this.options.elevationMode = mode;

            if (this._map !== null) {
                this._map._createPointMapping(this);
            }
        }

        return this;
    },

    getElevationMode: function() {
        return this.options.elevationMode;
    },

    setIndoorMapWithFloorId: function(indoorMapId, indoorMapFloorId) {
        this.options.indoorMapId = indoorMapId;
        this.options.indoorMapFloorId = indoorMapFloorId;

        if (this._map !== null) {
            this._map._createPointMapping(this);
        }

        return this;
    },
    
    setIndoorMapWithFloorIndex: function(indoorMapId, indoorMapFloorIndex) {
        this.options.indoorMapId = indoorMapId;
        this.options.indoorMapFloorIndex = indoorMapFloorIndex;

        if (this._map !== null) {
            this._map._createPointMapping(this);
        }
        
        return this;
    },

    setOutdoor: function() {
        delete this.options.indoorMapId;
        delete this.options.indoorMapFloorId;
        delete this.options.indoorMapFloorIndex;

        if (this._map !== null) {
            this._map._createPointMapping(this);
        }

        return this;
    },
    
    setLatLng: function (latlng) {
        var baseReturnValue = L.Marker.prototype.setLatLng.call(this, latlng);
        
        if (this._map) {
            this._map._createPointMapping(this);
        }

        return baseReturnValue;
	},

    update: function() {
        if (this._icon) {
            // todo: should probably just have a single api point here to get screen pos
            var latLngs = this._map.latLngsForLayer(this);            
            var screenPos;
            if (this._isDragging) {
                // Leaflet updates the latlng directly during a drag event to correspond to screen pos
                screenPos = this._map.latLngToLayerPoint(this.getLatLng());
            } else {
                screenPos = this._map.latLngToLayerPoint(latLngs[0]);
            }
            this._setPos(screenPos);
        }
        return this;
    },

    _setPos: function (pos) {
        var setPosFunc = (L.Browser.gecko) ? EegeoDomUtil.setPositionSmooth : L.DomUtil.setPosition;

        setPosFunc(this._icon, pos);

        if (this._shadow) {
            setPosFunc(this._shadow, pos);
        }

        this._zIndex = parseInt(pos.y * 10000) + (this.options.zIndexOffset * 10000);

        this._resetZIndex();
    },

    bindPopup: function(content, options) {
        var popup = content;
        if (!(popup instanceof L.Popup)) {
            if (!options) {
                options = {};
            }
            
            // copy relevant marker options into popup
            if (!("elevation" in options)) {
                options["elevation"] = this.getElevation();
            }

            if (!("elevationMode" in options)) {
                options["elevationMode"] = this.options.elevationMode;
            }

            indoorOptions.copyIndoorMapOptions(this.options, options);

            popup = new popups.Popup(options, this).setContent(content);
        }
        return L.Marker.prototype.bindPopup.call(this, popup, options);
    },

    _onDragStart: function() {
        // During drag, leaflet uses screen space for positioning. This has no notion of altitude
        // so we need to compensate at the beginning and end of the drag.
        this._isDragging = true;
        this._elevationBeforeDrag = this.getElevation();
        var flatPos = L.DomUtil.getPosition(this._icon);
        var flatLatLng = this._map.layerPointToLatLng(flatPos);
        var realLatLng = this.getLatLng();
        this._latOffsetForDrag = realLatLng.lat - flatLatLng.lat;
        this._lngOffsetForDrag = realLatLng.lng - flatLatLng.lng;
        this.setLatLng(flatLatLng);
    },

    _onDrag: function(e) {
        this._map._createPointMapping(this);
    },

    _onDragEnd: function(e) {
        var flatLatLng = this.getLatLng();
        if (this.options.indoorMapId) {
            // preserve the original elevation, offsetting the position accordingly
            this.setLatLng(new L.LatLng(flatLatLng.lat + this._latOffsetForDrag, flatLatLng.lng + this._lngOffsetForDrag, this._elevationBeforeDrag));
        } else {
            // we're dragging a marker outside, the original elevation above ground may not be relevant in its new location
            // so just place it where it was dragged
            this.setLatLng(new L.LatLng(flatLatLng.lat, flatLatLng.lng));
            this.options.elevation = 0;
        }
        this._map._createPointMapping(this);
        this._latOffsetForDrag = 0;
        this._lngOffsetForDrag = 0;
        this._elevationBeforeDrag = 0;
        this._isDragging = false;
    }


});

var marker = function(latLng, options) {
    return new Marker(latLng, options);
};

module.exports = {
    Marker: Marker,
    marker: marker
};