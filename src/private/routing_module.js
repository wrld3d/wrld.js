var MapModule = require("./map_module");

var RoutingModule = function(apiKey, indoorsModule) {

    var _urlRoot = "https://routing.eegeo.com/v1/";
    var _apiKey = apiKey;
    var _indoorsModule = indoorsModule;

    var _parseMetadataTag = function(metadata, tag) {
        var decoratedTag = "{" + tag + ":";
        var occurrence = metadata.indexOf(decoratedTag);

        if (occurrence !== -1)
        {
            var postTag = metadata.slice(occurrence + decoratedTag.length);
            var nextBracketIndex = postTag.indexOf("}");

            if (nextBracketIndex !== -1)
            {
                return postTag.substring(0, nextBracketIndex);
            }
        }

        return null;
    };

    var _parseRouteSteps = function(routeSteps) {
        var latLongAltPoints = [];
        var height = 0;

        for (var i = 0; i < routeSteps.length; i++) 
        {   
            var metadata = routeSteps[i].name;
            var level = _parseMetadataTag(metadata, "level");
        
            if (level !== "multiple") 
            {
                height = _indoorsModule.getFloorHeightAboveSeaLevel(level);
            }

            var stepGeometry = routeSteps[i]["geometry"]["coordinates"];

            for (var j=0; j<stepGeometry.length; j++) 
            {
                var lonlat = stepGeometry[j];     
                var latLonAlt = [lonlat[1], lonlat[0], height];
                latLongAltPoints.push(latLonAlt); 
            }
        }

        return latLongAltPoints;
    };

    var _parseRoutes = function(routingJson) {
      var routes = routingJson["routes"];
      var results = [];

      for (var routeIndex = 0; routeIndex < routes.length; ++routeIndex)
      {
        var legs = routes[routeIndex]["legs"];

        for (var legIndex = 0; legIndex < legs.length; ++legIndex)
        {
            var steps = legs[legIndex]["steps"]; 
            var points = _parseRouteSteps(steps);
            results.push(points);
        }
      }

      return results;
    };

    var _routeParseHandler = function(routeLoadHandler) {
        return function() {
            var routeJson = JSON.parse(this.responseText);
            var routes;
            if ("type" in routeJson && routeJson["type"] === "multipart")
            {
                var multiroute = routeJson["routes"];
                for (var index = 0; index < multiroute.length; ++index)
                {
                    routes = _parseRoutes(multiroute[index]);
                    routeLoadHandler(routes);
                }
            }
            else
            {
                routes = _parseRoutes(routeJson);
                routeLoadHandler(routes);
            }
        };
    };

    var _cancelRequest = function(request) {
        return function() {
            request.abort();
        };
    };

    this.getRoutes = function(startPoint, endPoint, onLoadHandler) {
        var url = _urlRoot + "route/?loc=" + startPoint[0] + "," + startPoint[1];
        url += "%3B" + endPoint[0] + "," + endPoint[1];
        url += "&apikey=" + _apiKey;
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.onload = _routeParseHandler(onLoadHandler);
        _indoorsModule.on("indoormapexit", _cancelRequest(request));
        request.send();
    };

    this.getRoutesBetweenLevels = function(startPoint, startLevel, endPoint, endLevel, onLoadHandler) { 
        var url = _urlRoot + "routelevels/?loc=" + startPoint[0] + "," + startPoint[1];
        url += "%3B" + endPoint[0] + "," + endPoint[1];
        url += "&levels=" + startLevel  + "%3B" + endLevel;
        url += "&apikey=" + _apiKey;
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.onload = _routeParseHandler(onLoadHandler);
        _indoorsModule.on("indoormapexit", _cancelRequest(request));
        request.send();
    };

    this.getMultipartRoutesBetweenLevels = function(startPoint, startLevel, endPoint, endLevel, onLoadHandler) { 
        var url = _urlRoot + "multiroute/?loc=" + startPoint[0] + "," + startPoint[1];
        url += "%3B" + endPoint[0] + "," + endPoint[1];
        url += "&levels=" + startLevel  + "%3B" + endLevel;
        url += "&apikey=" + _apiKey;
        url += "&limit=400";
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.onload = _routeParseHandler(onLoadHandler);
        _indoorsModule.on("indoormapexit", _cancelRequest(request));
        request.send();
    };
};

RoutingModule.prototype = MapModule;

module.exports = RoutingModule;
