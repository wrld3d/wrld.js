import type { season, time, weather } from "../public/themes";

export type Themes = {
  setTheme: (season: season, time: time, weather: weather) => void;
  setSeason: (season: season) => void;
  setTime: (time: time) => void;
  setWeather: (weather: weather) => void;
  setEnvironmentThemesManifest: (manifest: string) => void;
};

export default Themes;
