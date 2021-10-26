import Wrld from "../../src";
import { createMockMap } from "../__mocks__/mockMap";

describe("Wrld.themes", () => {
  it("Returns the right values", () => {
    expect(Wrld.themes.season).toEqual({ Autumn: "Autumn", Spring: "Spring", Summer: "Summer", Winter: "Winter" });
    expect(Wrld.themes.time).toEqual({ Dawn: "Dawn", Day: "Day", Dusk: "Dusk", Night: "Night" });
    expect(Wrld.themes.weather).toEqual({
      Clear: "Default",
      Foggy: "Foggy",
      Overcast: "Overcast",
      Rainy: "Rainy",
      Snowy: "Snowy",
    });
  });
});

describe("Wrld.map.themes", () => {
  it("sets the season", () => {
    const map = createMockMap();
    map.themes.setSeason(Wrld.themes.season.Autumn);
    expect(map.themes.getSeason()).toEqual("Autumn");
  });
  it("sets the time", () => {
    const map = createMockMap();
    map.themes.setTime(Wrld.themes.time.Dusk);
    expect(map.themes.getTime()).toEqual("Dusk");
  });
  it("sets the weather", () => {
    const map = createMockMap();
    map.themes.setWeather(Wrld.themes.weather.Foggy);
    expect(map.themes.getWeather()).toEqual("Foggy");
  });
  it("sets the theme", () => {
    const map = createMockMap();
    map.themes.setTheme(Wrld.themes.season.Winter, Wrld.themes.time.Night, Wrld.themes.weather.Rainy);
    expect(map.themes.getWeather()).toEqual("Rainy");
    expect(map.themes.getTime()).toEqual("Night");
    expect(map.themes.getSeason()).toEqual("Winter");
  });
});
