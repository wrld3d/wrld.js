import EegeoMapController from "../private/eegeo_map_controller";
import EmscriptenApi from "../private/emscripten_api/emscripten_api";
import { Module } from "../types/module";
import type { Map, MapOptions } from "./map";
import "../types/window"; // defines the overrides for the window global

/*
 * This is a collection of related functions extracted from the `wrld.js` (now .ts) file.
 * It relies on unscoped variables to store various states, maybe this could be converted to a class/object instead?
 */

const _eeGeoWebGLVersion = "public/latest";
const _baseUrl = `https://cdn-webgl.wrld3d.com/eegeojs/${_eeGeoWebGLVersion}/`;
const _appName = "eeGeoWebGL.jgz";

const _mapObjects: EegeoMapController[] = [];
let _emscriptenStartedLoading = false;
let _emscriptenFinishedLoading = false;
let _mapsWaitingInitialization: Module[] = [];

const onEmscriptenLoaded = () => {
  _emscriptenFinishedLoading = true;
  _mapsWaitingInitialization.forEach((module) => {
    window.createWrldModule(module);
  });
  _mapsWaitingInitialization = [];
};

const createEmscriptenModule = () => {
  if (!_emscriptenStartedLoading) {
    const script = document.createElement("script");
    script.src = `${_baseUrl}${_appName}`;
    script.onload = onEmscriptenLoaded;
    document.body.appendChild(script);
    _emscriptenStartedLoading = true;
  }

  const Module: Module = {} as Module;
  Module.locateFile = (url) => {
    const absUrl = `${_baseUrl}${url}`;
    return absUrl;
  };
  Module.onExit = (exitCode) => {
    if (exitCode === 1) {
      let message = "Error: wrld.js failed to initialize";
      if (!Module.ctx) {
        message = "Error: WebGL unavailable in this browser";
      }
      _mapObjects.forEach((map) => {
        map.onError(message);
      });
    }
  };
  return Module;
};

const initializeMap = (module: Module) => {
  if (!_emscriptenFinishedLoading) {
    _mapsWaitingInitialization.push(module);
  }
  else {
    window.createWrldModule(module);
  }
};

const abortInitializingMap = (module: Module) => {
  _mapsWaitingInitialization = _mapsWaitingInitialization.filter(item => item !== module);
};

const findMapContainerElement = (elementOrId: string | HTMLElement): HTMLElement => {
  if (elementOrId instanceof HTMLElement) {
    return elementOrId;
  }

  if (typeof elementOrId === "string") {
    const element = document.getElementById(elementOrId);
    if (element) return element;
  }

  const idError = (elementOrId === null) ? "" : (` with id "${elementOrId}"`);
  throw "No map container found" + idError;
};

export const map = (domElement: HTMLElement | string, apiKey: string, options?: MapOptions): Map => {
  const wrldModule = createEmscriptenModule();

  domElement = findMapContainerElement(domElement);

  const browserDocument = document;
  const browserWindow = window;
  const mapId = _mapObjects.length;
  const mapApiObject = new EmscriptenApi(wrldModule);
  const mapOptions = options || {};
  const onMapRemove = () => {
    delete _mapObjects[mapId];
    abortInitializingMap(wrldModule);
  };
  const map = new EegeoMapController(mapId, mapApiObject, domElement, apiKey, browserWindow, browserDocument, wrldModule, mapOptions, onMapRemove);
  _mapObjects.push(map);

  initializeMap(wrldModule);

  return map.leafletMap;
};

export const getMapById = (mapId: number): EegeoMapController => _mapObjects[mapId];
