import L from "leaflet";
import { factoryFor } from "../private/factoryFor";
import { setPositionSmooth } from "../private/eegeo_dom_util";
import { ElevationModeType, isValidElevationMode } from "../private/elevation_mode";
import { copyIndoorMapOptions } from "../private/indoor_map_layer_options.js";
import { ElevationMode } from "../types/elevationMode";
import { MapId, MapFloorId, MapFloorIndex } from "./map";
import { Popup, PopupOptions } from "./popup";

type Content = Parameters<typeof L.Popup.prototype.setContent>[0];

export type MarkerOptions = L.MarkerOptions & {
  elevation?: number;
  elevationMode?: ElevationMode;
  indoorMapId?: MapId;
  indoorMapFloorId?: MapFloorId;
};

declare class MarkerType extends L.Marker {
  options: MarkerOptions;
  constructor(latLng: L.LatLngExpression, options?: MarkerOptions);
  getElevation(): number;
  setElevation(elevation: number): this;
  getElevationMode(): ElevationMode;
  setElevationMode(elevationMode: ElevationMode): this;
  setIndoorMapWithFloorId(indoorMapId: MapId, indoorMapFloorId: MapFloorId): this;
  setIndoorMapWithFloorIndex(indoorMapId: MapId, indoorMapFloorIndex: MapFloorIndex): this;
  setOutdoor(): this;
}

export type Marker = MarkerType;

export const Marker: typeof MarkerType = L.Marker.extend({
  initialize: function (latLng: L.LatLngExpression, options?: MarkerOptions) {
    L.Marker.prototype.initialize.call(this, latLng, options);
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
    elevationMode: ElevationModeType.HEIGHT_ABOVE_GROUND,
  },

  getElevation: function (): number {
    return this.options.elevation;
  },

  setElevation: function (elevation: number) {
    this.options.elevation = elevation;

    if (this._map !== null) {
      this._map._createPointMapping(this);
    }

    return this;
  },

  setElevationMode: function (mode: ElevationMode) {
    if (isValidElevationMode(mode)) {
      this.options.elevationMode = mode;

      if (this._map !== null) {
        this._map._createPointMapping(this);
      }
    }

    return this;
  },

  getElevationMode: function (): ElevationMode {
    return this.options.elevationMode;
  },

  setIndoorMapWithFloorId: function (indoorMapId: MapId, indoorMapFloorId: MapFloorId) {
    this.options.indoorMapId = indoorMapId;
    this.options.indoorMapFloorId = indoorMapFloorId;

    if (this._map !== null) {
      this._map._createPointMapping(this);
    }

    return this;
  },

  setIndoorMapWithFloorIndex: function (indoorMapId: MapId, indoorMapFloorIndex: MapFloorIndex) {
    this.options.indoorMapId = indoorMapId;
    this.options.indoorMapFloorIndex = indoorMapFloorIndex;

    if (this._map !== null) {
      this._map._createPointMapping(this);
    }

    return this;
  },

  setOutdoor: function () {
    delete this.options.indoorMapId;
    delete this.options.indoorMapFloorId;
    delete this.options.indoorMapFloorIndex;

    if (this._map !== null) {
      this._map._createPointMapping(this);
    }

    return this;
  },

  setLatLng: function (latLng: L.LatLngExpression) {
    const baseReturnValue = L.Marker.prototype.setLatLng.call(this, latLng);

    if (this._map) {
      this._map._createPointMapping(this);
    }

    return baseReturnValue;
  },

  update: function () {
    if (this._icon) {
      // todo: should probably just have a single api point here to get screen pos
      const latLngs = this._map.latLngsForLayer(this);
      let screenPos;
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

  _setPos: function (pos: L.Point) {
    const setPosFunc = L.Browser.gecko ? setPositionSmooth : L.DomUtil.setPosition;

    setPosFunc(this._icon, pos);

    if (this._shadow) {
      setPosFunc(this._shadow, pos);
    }

    this._zIndex = pos.y * 10000 + this.options.zIndexOffset * 10000;

    this._resetZIndex();
  },

  bindPopup: function (this: Marker, content: Content | L.Popup, options?: PopupOptions) {
    let popup = content;
    if (!(content instanceof L.Popup)) {
      if (!options) {
        options = {};
      }

      // copy relevant marker options into popup
      if (!("elevation" in options)) {
        options.elevation = this.getElevation();
      }

      if (!("elevationMode" in options)) {
        options.elevationMode = this.options.elevationMode;
      }

      copyIndoorMapOptions(this.options, options);

      popup = new Popup(options, this).setContent(content);
    }
    return L.Marker.prototype.bindPopup.call(this, popup, options);
  },

  _onDragStart: function () {
    // During drag, leaflet uses screen space for positioning. This has no notion of altitude
    // so we need to compensate at the beginning and end of the drag.
    this._isDragging = true;
    this._elevationBeforeDrag = this.getElevation();
    const flatPos = L.DomUtil.getPosition(this._icon);
    const flatLatLng = this._map.layerPointToLatLng(flatPos);
    const realLatLng = this.getLatLng();
    this._latOffsetForDrag = realLatLng.lat - flatLatLng.lat;
    this._lngOffsetForDrag = realLatLng.lng - flatLatLng.lng;
    this.setLatLng(flatLatLng);
  },

  _onDrag: function () {
    this._map._createPointMapping(this);
  },

  _onDragEnd: function () {
    const flatLatLng = this.getLatLng();
    if (this.options.indoorMapId) {
      // preserve the original elevation, offsetting the position accordingly
      this.setLatLng(
        new L.LatLng(
          flatLatLng.lat + this._latOffsetForDrag,
          flatLatLng.lng + this._lngOffsetForDrag,
          this._elevationBeforeDrag
        )
      );
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
  },
});

export const marker = factoryFor(Marker);
