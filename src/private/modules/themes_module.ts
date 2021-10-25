import { MapModuleClass } from "./map_module";
import * as Themes from "../../public/themes";
import type { EmscriptenApi } from "../emscripten_api/emscripten_api";

export class ThemesModule extends MapModuleClass {
  private _emscriptenApi: EmscriptenApi;
  private _ready: boolean;
  private _season: Themes.season;
  private _time: Themes.time;
  private _weather: Themes.weather;
  private _shouldChangeTheme: boolean;
  private _shouldChangeState: boolean;

  constructor(emscriptenApi: EmscriptenApi) {
    super();
    this._emscriptenApi = emscriptenApi;
    this._ready = false;

    this._season = Themes.season.Summer;
    this._time = Themes.time.Day;
    this._weather = Themes.weather.Clear;

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

  private _tryMatchBuiltIn = (season: Themes.season, time: Themes.time, weather: Themes.weather): {season: Themes.season, time: Themes.time, weather: Themes.weather} => {
    const caseInsensitiveMatchWithCollection = (key: string, values: string[]) => {
      const keyUpper = key.toUpperCase();
      const matchedValue = values.find(function (item) {
        return keyUpper.localeCompare(item.toUpperCase()) === 0;
      });
      return matchedValue ? matchedValue : key;
    };

    return {
      season: caseInsensitiveMatchWithCollection(season, Object.values(Themes.season)) as Themes.season,
      time: caseInsensitiveMatchWithCollection(time, Object.values(Themes.time)) as Themes.time,
      weather: caseInsensitiveMatchWithCollection(weather, Object.values(Themes.weather)) as Themes.weather,
    };
  };

  private _onThemesStreamingCompleted = (): void => {
    this._ready = true;
    this._updateTheme();
  };

  setTheme = (season: Themes.season, time: Themes.time, weather: Themes.weather): void => {
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

  setSeason = (season: Themes.season): void => {
    this.setTheme(season, this._time, this._weather);
  };

  setTime = (time: Themes.time): void => {
    this.setTheme(this._season, time, this._weather);
  };

  setWeather = (weather: Themes.weather): void => {
    this.setTheme(this._season, this._time, weather);
  };

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
