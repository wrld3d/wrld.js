declare namespace themes {
  enum season {
    Spring = "Spring",
    Summer = "Summer",
    Autumn = "Autumn",
    Winter = "Winter",
  }

  enum time {
    Dawn = "Dawn",
    Day = "Day",
    Dusk = "Dusk",
    Night = "Night",
  }

  enum weather {
    Clear = "Default",
    Overcast = "Overcast",
    Foggy = "Foggy",
    Rainy = "Rainy",
    Snowy = "Snowy",
  }

  type Themes = {
    setTheme: (season: themes.season, time: themes.time, weather: themes.weather) => void,
    setSeason: (season: themes.season) => void,
    setTime: (time: themes.time) => void,
    setWeather: (weather: themes.weather) => void,
    setEnvironmentThemesManifest: (manifest: string) => void,
  }
}

export default themes;
