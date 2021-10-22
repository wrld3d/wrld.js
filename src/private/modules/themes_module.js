import MapModule from "./map_module";
import * as Themes from "../../public/themes";

export function ThemesModule (emscriptenApi) {

    var _emscriptenApi = emscriptenApi;
    var _ready = false;

    var _season = "Summer";
    var _time = "Day";
    var _weather = "Default";

    var _shouldChangeTheme = false;
    var _shouldChangeState = false;

    var _updateTheme = () => {
        if (!_ready) {
            return;
        }

        if (_shouldChangeTheme) {
            _emscriptenApi.themesApi.setTheme(_season);
            _shouldChangeTheme = false;
        }

        if (_shouldChangeState) {
            _emscriptenApi.themesApi.setState(_time + _weather, 1.0);
            _shouldChangeState = false;
        }
    };

    var _tryMatchBuiltIn = (season, time, weather) => {
        var getValues = function (obj) {
            var values = [];
            for (var key in obj) {
                values.push(obj[key]);
            }
            return values;
        };
        var caseInsensitiveMatchWithCollection = (key, values) => {
            var keyUpper = key.toUpperCase();
            var matchedValue = values.find(function (item) {
                return keyUpper.localeCompare(item.toUpperCase()) === 0;
            });
            return matchedValue ? matchedValue : key;
        };

        return {
            season: caseInsensitiveMatchWithCollection(season, getValues(Themes.season)),
            time: caseInsensitiveMatchWithCollection(time, getValues(Themes.time)),
            weather: caseInsensitiveMatchWithCollection(weather, getValues(Themes.weather))
        };
    };

    var _onThemesStreamingCompleted = () => {
        _ready = true;
        _updateTheme();
    };
    
    this.setTheme = (season, time, weather) => {
        var themeInfo = _tryMatchBuiltIn(season, time, weather);

        if (themeInfo.season !== _season) {
            _shouldChangeTheme = true;
        }

        if (themeInfo.time !== _time || themeInfo.weather !== _weather) {
            _shouldChangeState = true;
        }

        _season = themeInfo.season;
        _time = themeInfo.time;
        _weather = themeInfo.weather;
        _updateTheme();
    };

    this.setSeason = (season) => {
        this.setTheme(season, _time, _weather);
    };

    this.setTime = (time) => {
        this.setTheme(_season, time, _weather);
    };

    this.setWeather = (weather) => {
        this.setTheme(_season, _time, weather);
    };

    this.setEnvironmentThemesManifest = (environmentThemesManifest) => {
        if (!_ready) {
            return;
        }
        _emscriptenApi.themesApi.setThemeManifest(environmentThemesManifest);
    };

    this.onInitialized = () => {
        _emscriptenApi.themesApi.registerStreamingCompletedCallback(_onThemesStreamingCompleted);
    };
}

ThemesModule.prototype = MapModule;

export default ThemesModule;