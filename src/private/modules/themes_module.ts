import { MapModuleClass } from "./map_module";
import { season as Season, time as Time, weather as Weather } from "../../public/themes";
import type { EmscriptenApi } from "../emscripten_api/emscripten_api";

export class ThemesModule extends MapModuleClass {
  private _emscriptenApi: EmscriptenApi;
  private _ready: boolean;
  private _season: Season;
  private _time: Time;
  private _weather: Weather;
  private _shouldChangeTheme: boolean;
  private _shouldChangeState: boolean;

  constructor(emscriptenApi: EmscriptenApi) {
    super();
    this._emscriptenApi = emscriptenApi;
    this._ready = false;

    this._season = Season.Summer;
    this._time = Time.Day;
    this._weather = Weather.Clear;

    this._shouldChangeTheme = false;
    this._shouldChangeState = false;
  }

  private _updateTheme = (): void => {
    if (!this._ready) {
      return;
    }

    if (this._shouldChangeTheme) {
      this._emscriptenApi.themesApi?.setTheme(this._season);
      this._shouldChangeTheme = false;
    }

    if (this._shouldChangeState) {
      this._emscriptenApi.themesApi?.setState(this._time + this._weather, 1.0);
      this._shouldChangeState = false;
    }
  };

  private _tryMatchBuiltIn = (season: Season, time: Time, weather: Weather): {season: Season, time: Time, weather: Weather} => {
    const caseInsensitiveMatchWithCollection = (key: string, values: string[]) => {
      const keyUpper = key.toUpperCase();
      const matchedValue = values.find(function (item) {
        return keyUpper.localeCompare(item.toUpperCase()) === 0;
      });
      return matchedValue ? matchedValue : key;
    };

    return {
      season: caseInsensitiveMatchWithCollection(season, Object.values(season)) as Season,
      time: caseInsensitiveMatchWithCollection(time, Object.values(time)) as Time,
      weather: caseInsensitiveMatchWithCollection(weather, Object.values(weather)) as Weather,
    };
  };

  private _onThemesStreamingCompleted = (): void => {
    this._ready = true;
    this._updateTheme();
  };

  setTheme = (season: Season, time: Time, weather: Weather): void => {
    const themeInfo = this._tryMatchBuiltIn(season, time, weather);

    if (themeInfo.season !== this._season) {
      this._shouldChangeTheme = true;
    }

    if (themeInfo.time !== this._time || themeInfo.weather !== this._weather) {
      this._shouldChangeState = true;
    }

    this._season = themeInfo.season;
    this._time = themeInfo.time;
    this._weather = themeInfo.weather;
    this._updateTheme();
  };

  setSeason = (season: Season): void => {
    this.setTheme(season, this._time, this._weather);
  };

  getSeason = (): Season => this._season;

  setTime = (time: Time): void => {
    this.setTheme(this._season, time, this._weather);
  };

  getTime = (): Time => this._time;

  setWeather = (weather: Weather): void => {
    this.setTheme(this._season, this._time, weather);
  };

  getWeather = (): Weather => this._weather;

  setEnvironmentThemesManifest = (environmentThemesManifest: string): void => {
    if (!this._ready) {
      return;
    }
    this._emscriptenApi.themesApi?.setThemeManifest(environmentThemesManifest);
  };

  /** @internal */ onInitialized(): void {
    this._emscriptenApi.themesApi?.registerStreamingCompletedCallback(this._onThemesStreamingCompleted);
  }
}

export default ThemesModule;
