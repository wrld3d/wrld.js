import L from "leaflet";
const tinyRotationString = " rotate(0.0001deg)";

export const setPositionSmooth = (el: HTMLElement, point: L.Point, disable3D = false) : void => {
  L.DomUtil.setPosition(el, point);

  if (!disable3D && L.Browser.any3d) {
    (el.style[L.DomUtil.TRANSFORM as "position"]) += tinyRotationString;
  }
};
