import type CameraApi from "../emscripten_api/emscripten_camera_api";
import type { Map } from "leaflet";

const _eventType = [
  "move",
  "movestart",
  "moveend",
  "drag",
  "dragstart",
  "dragend",
  "pan",
  "panstart",
  "panend",
  "rotate",
  "rotatestart",
  "rotateend",
  "tilt",
  "tiltstart",
  "tiltend",
  "zoom",
  "zoomstart",
  "zoomend",
  "transitionstart",
  "transitionend",
];

export class MapMoveEvents {
  private _onEvent: (eventKey: number) => void;

  constructor(leafletMap: Map) {
    this._onEvent = (eventKey: number) => {
      if (typeof _eventType[eventKey] === undefined) {
        return;
      }
      leafletMap.fire(_eventType[eventKey]);
    };
  }

  setEventCallbacks = (cameraApi: CameraApi): void => {
    cameraApi.setEventCallback(this._onEvent);
  };
}

export default MapMoveEvents;
