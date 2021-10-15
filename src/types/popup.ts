import type L from "leaflet";

declare namespace Popup {
  type Options = L.PopupOptions & {
    elevation: number;
  };
}

declare class Popup extends L.Popup {
  constructor(options?: Popup.Options, source?: L.Layer);
  getElevation(): number;
  setElevation(elevation: number): this;
}

export default Popup;
