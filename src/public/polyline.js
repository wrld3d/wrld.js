var L = require("leaflet");
var space = require("./space");

var Polyline = function(latLngs, config) {
    var _map = null;
    var _points = [];

  var _config = config || {};

    function loadLatLngs(coords){
    var points = [];
        coords.forEach(function(coord) {
            points.push(L.latLng(coord));
        });
    return points;
    }

  var arrayDepth = 0;
  var testElement = latLngs;
  do {
    testElement = testElement[0];
    arrayDepth++;
  } while (Array.isArray(testElement));

  if (arrayDepth === 2)
  {
    _points = loadLatLngs(latLngs);
  }
  else
  {
    throw new Error("Incorrect array input format.");
  }

    var _color = new space.Vector4(config["color"] || [0, 0, 255, 128]);
    var _colorNeedsChanged = true;


    this.getColor = function() {
        return new space.Vector4(_color);
    };

    this.setColor = function(color) {
        _color = new space.Vector4(color);
        _colorNeedsChanged = true;
    return this;
    };


    this.getPoints = function() {
        return _points;
    };

    this._colorNeedsChanged = function() {
        return _colorNeedsChanged;
    };

    this._onColorChanged = function() {
        _colorNeedsChanged = false;
    };

    this.addTo = function(map) {
        if (_map !== null) {
            this.remove();
        }
        _map = map;
        map._polylineModule.addPolyline(this);
        return this;
    };
    
    this.remove = function() {
        if (_map !== null) {
            _map._polylineModule.removePolygon(this);
            _map = null;
        }
        return this;
    };

  this._getConfig = function() {
    return _config;
  };
};

var polyline = function(latlngs, config) {
    return new Polyline(latlngs, config || {});
};

module.exports = {
    Polyline: Polyline,
    polyline: polyline
};