import { MapModuleClass } from "./map_module";
import type { EmscriptenApi } from "../emscripten_api/emscripten_api";

export class LabelModule extends MapModuleClass {
  private _emscriptenApi: EmscriptenApi;
  private _enabled: boolean;

  constructor(emscriptenApi: EmscriptenApi) {
    super();
    this._emscriptenApi = emscriptenApi;
    this._enabled = true;
  }

  setLabelsEnabled = (enabled: boolean): void => {
    this._enabled = enabled;
    this._emscriptenApi.labelApi?.setLabelsEnabled(this._enabled);
  };

  onInitialized = (): void => {
    this._emscriptenApi.labelApi?.setLabelsEnabled(this._enabled);
  };
}

export default LabelModule;
