import L from "leaflet";
import { factoryFor } from "../private/factoryFor";
import type { ElevationMode } from "../types/elevationMode";

// eslint-disable-next-line @typescript-eslint/no-namespace
export type PopupOptions = L.PopupOptions & {
  elevation?: number;
  elevationMode?: ElevationMode;
  closeWhenMovedOffscreen?: boolean;
};

declare class PopupType extends L.Popup {
  options: PopupOptions;
  constructor(options?: PopupOptions, source?: L.Layer);
  getElevation(): number;
  setElevation(elevation: number): this;
}

export type Popup = PopupType;

export const Popup: typeof PopupType = L.Popup.extend({
  options: {
    elevation: 0,
    closeWhenMovedOffscreen: false,
  },

  _onScreen: false,

  getElevation: function () {
    return this.options.elevation;
  },

  setElevation: function (elevation: number) {
    this.options.elevation = elevation;
    return this;
  },

  getCloseWhenMovedOffscreen: function () {
    return this.options.closeWhenMovedOffscreen;
  },

  setCloseWhenMovedOffscreen: function (closeWhenMovedOffscreen: boolean) {
    this.options.closeWhenMovedOffscreen = closeWhenMovedOffscreen;
    return this;
  },

  _updateContent: function () {
    if (!this._content) {
      return;
    }

    const node = this._contentNode;
    const content = typeof this._content === "function" ? this._content(this._source || this) : this._content;

    let contentNeedsUpdate = true;
    if (content.outerHTML && content.outerHTML === node.innerHTML) {
      // This test will fail to detect changes which don't affect HTML, but otherwise the DOM for the popup is
      // rebuilt every update cycle.  This makes embedding external HTML impossible.
      contentNeedsUpdate = false;
    }

    if (typeof content === "string") {
      node.innerHTML = content;
    } else if (!node.hasChildNodes() || contentNeedsUpdate) {
      while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
      }
      node.appendChild(content);
    }
    this.fire("contentupdate");
  },

  update: function () {
    if (!this._map) {
      return;
    }

    this._container.style.visibility = "hidden";

    this._updateContent();
    this._updateLayout();
    this._updatePosition();

    this._container.style.visibility = "";

    this._adjustPan();

    if (this.options.closeWhenMovedOffscreen) {
      if (this._onScreen && this._checkOutOfBounds()) {
        this._onScreen = false;
        this._close();
      } else {
        this._onScreen = !this._checkOutOfBounds();
      }
    }
  },

  _updatePosition: function () {
    if (!this._map) {
      return;
    }

    // todo: should probably just have a single api point here to get screen pos
    const latLngs = this._map.latLngsForLayer(this);
    const pos = this._map.latLngToLayerPoint(latLngs[0]);
    let offset = L.point(this.options.offset);

    const anchor = this._getAnchor();
    anchor.x = Math.round(anchor.x);
    anchor.y = Math.round(anchor.y);

    if (this._zoomAnimated) {
      L.DomUtil.setPosition(this._container, pos.add(anchor));
    } else {
      offset = offset.add(pos).add(anchor);
    }

    const bottom = (this._containerBottom = -offset.y);
    const left = (this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x);

    const bottom_style = Math.round(bottom) + "px";
    const left_style = Math.round(left) + "px";

    if (L.DomUtil.getStyle(this._container, "left") !== left_style) {
      // Do not update if style is already applied to prevent vertical wiggling
      this._container.style.left = left_style;
    }

    if (L.DomUtil.getStyle(this._container, "bottom") !== bottom_style) {
      // bottom position the popup in case the height of the popup changes (images loading etc)
      this._container.style.bottom = bottom_style;
    }
  },

  _checkOutOfBounds: function () {
    const rect = this._container.getBoundingClientRect();
    const rectHeight = rect.bottom - rect.top;
    const rectWidth = rect.right - rect.left;
    const mapRect = this._map._container.getBoundingClientRect();

    const offBottom = rect.bottom > mapRect.bottom + rectHeight / 2.0;
    const offTop = rect.top < mapRect.top - rectHeight / 2.0;
    const offRight = rect.right > mapRect.right + rectWidth / 2.0;
    const offleft = rect.left < mapRect.left - rectWidth / 2.0;
    return offBottom || offTop || offRight || offleft;
  },
});

export const popup = factoryFor(Popup);
