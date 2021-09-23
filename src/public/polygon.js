import { latLng } from "leaflet";
import { Vector4 } from "./space";

export function Polygon (latLngs, config) {
	var _map = null;
	var _outerRing = [];
	var _holes = [];
  var _config = config || {};

	const loadLatLngs = (coords) => {
		var points = [];
		coords.forEach(function (coord) {
			points.push(latLng(coord));
		});
		return points;
	};

  var arrayDepth = 0;
  var testElement = latLngs;
  do {
    testElement = testElement[0];
    arrayDepth++;
  } while (Array.isArray(testElement));

  if (arrayDepth === 2)
  {
    _outerRing = loadLatLngs(latLngs);
  }
  else if (arrayDepth === 3)
  {
    _outerRing = loadLatLngs(latLngs[0]);
    var holeLatLngs = latLngs.splice(1);
    holeLatLngs.forEach(function(holeLatLng) {
      _holes.push(loadLatLngs(holeLatLng));
    });
  }
  else
  {
    throw new Error("Incorrect array input format.");
  }

	var _color = config["color"] || new Vector4(0, 0, 255, 128);
	var _colorNeedsChanged = true;


	this.getColor = () => _color;

	this.setColor = (color) => {
		_color = color;
		_colorNeedsChanged = true;
    return this;
	};

	this.addHole = (points) => {
    _holes.push(loadLatLngs(points));
		return this;
	};

	this.getHoles = () => _holes;

	this.getPoints = () => _outerRing;

	this._colorNeedsChanged = () => _colorNeedsChanged;

	this._onColorChanged = () => {
		_colorNeedsChanged = false;
	};

	this.addTo = (map) => {
		if (_map !== null) {
			this.remove();
		}
		_map = map;
		map._polygonModule.addPolygon(this);
		return this;
	};
	
	this.remove = () => {
		if (_map !== null) {
			_map._polygonModule.removePolygon(this);
			_map = null;
		}
		return this;
	};

  this._getConfig = () => _config;
}

export const polygon = (latlngs, config) => new Polygon(latlngs, config || {});
