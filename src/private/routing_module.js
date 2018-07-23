var MapModule = require("./map_module");

var RoutingModule = function(apiKey, indoorsModule) {

    var _urlRoot = "https://routing.wrld3d.com/v1/";
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
        var parsedSteps = [];
        for (var i = 0; i < routeSteps.length; i++) 
        {   
            var metadata = routeSteps[i].name;
            var level = _parseMetadataTag(metadata, "level");
            if (level === "multiple") 
            {
                // skip route segments which change floor for now
                continue;
            }
            var routeStep = {};
            var latLongPoints = [];

            routeStep.indoorMapId = _parseMetadataTag(metadata, "bid");
            // Hack to preserve Westport/West ward works example behaviour:
            // Routes are defined relative to an indoor map submission, but 
            // Westport House was built before the era of UIDs
            if (routeStep.indoorMapId === "e2657c93-2d13-412a-89fe-0949a14e7eea") {
                routeStep.indoorMapId = "westport_house";
            } else if (routeStep.indoorMapId === "c857d08d-7de1-4447-9ff8-6747649a00e0") {
                // West Ward Works also has an unusual history
                routeStep.indoorMapId = "70f9b00f-8c4f-4570-9a23-62bd80a76f8a";
            }
            if (level) {
                routeStep.indoorMapFloorId = parseInt(level);
            }
            var stepGeometry = routeSteps[i]["geometry"]["coordinates"];

            for (var j=0; j<stepGeometry.length; j++) 
            {
                var lonlat = stepGeometry[j];     
                var latLon = [lonlat[1], lonlat[0]];
                latLongPoints.push(latLon); 
            }
            routeStep.points = latLongPoints;
            parsedSteps.push(routeStep);
        }

        return parsedSteps;
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
            var routeSteps = _parseRouteSteps(steps);
            results.push(routeSteps);
        }
      }

      return results;
    };

    var _routeParseHandler = function(routeLoadHandler, routeLoadErrorHandler) {
        return function() {
            var routeJson = JSON.parse(this.responseText);

            if (routeJson["code"] === "Ok")
            {
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
            }
            else
            {
                if (routeLoadErrorHandler !== null && routeLoadErrorHandler !== undefined)
                {
                    routeLoadErrorHandler(routeJson);
                }
            }
        };
    };

    var _cancelRequest = function(request) {
        return function() {
            request.abort();
        };
    };

    this.getRoute = function(viaPoints, onLoadHandler, onErrorHandler, transportMode) { 
        transportMode = transportMode || "walking";        
        var url = _urlRoot + "route?loc=";
        
        for (var pointIndex = 0; pointIndex < viaPoints.length; ++pointIndex)
        {
            url += viaPoints[pointIndex].join(",");

            if (pointIndex < viaPoints.length - 1)
            {
                url += "%3B";
            }
            
        }
        url += "&apikey=" + _apiKey;
        url += "&limit=400";
        url += "&travelmode=" + transportMode;
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.onload = _routeParseHandler(onLoadHandler, onErrorHandler);
        _indoorsModule.on("indoormapexit", _cancelRequest(request));
        request.send();
    };
};

RoutingModule.prototype = MapModule;

module.exports = RoutingModule;
