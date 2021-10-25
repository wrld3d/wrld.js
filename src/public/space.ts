import L from "leaflet";

export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(vector: Vector3);
  constructor(vector: [number, number, number]);
  constructor(x: number);
  constructor(x: number, y: number);
  constructor(x: number, y: number, z: number);
  constructor(...args: Vector3[] | number[] | ([number, number, number][])) {
    if (typeof (args[0]) === "number") {
      const [x, y, z] = (args as number[]);
      this.x = x;
      this.y = y;
      this.z = z || 0.0;
    } else {
      const vector = args[0];
      this.x = !Array.isArray(vector) ? vector.x : vector[0];
      this.y = !Array.isArray(vector) ? vector.y : vector[1] || 0.0;
      this.z = !Array.isArray(vector) ? vector.z : vector[2] || 0.0;
    }
  }

  toPoint (): L.Point {
    return L.point(this.x, this.y);
  }
}

export class Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(vector: Vector4);
  constructor(vector: [number, number, number?, number?]);
  constructor(x: number);
  constructor(x: number, y: number);
  constructor(x: number, y: number, z: number);
  constructor(x: number, y: number, z: number, w: number);
  constructor(...args: Vector4[] | number[] | ([number, number, number?, number?][])) {
    if (typeof (args[0]) === "number") {
      const [x, y, z, w] = (args as number[]);
      this.x = x;
      this.y = y;
      this.z = z || 0.0;
      this.w = w || 1.0;
    } else {
      const vector = args[0];
      this.x = !Array.isArray(vector) ? vector.x : vector[0];
      this.y = !Array.isArray(vector) ? vector.y : vector[1];
      this.z = !Array.isArray(vector) ? vector.z : vector[2] || 0.0;
      this.w = !Array.isArray(vector) ? vector.w : vector[3] || 1.0;
    }
  }
}

// TODO: fix DRY fail -- this should move to platform
// Judging by Leaflet, approx = 2.74287e7 * Math.exp(-0.622331 * zoom)
const _altitudes = [
  27428700,
  14720762,
  8000000,
  4512909,
  2087317,
  1248854,
  660556,
  351205,
  185652,
  83092,
  41899,
  21377,
  11294,
  5818,
  3106,
  1890,
  1300,
  821,
  500,
  300,
  108,
  58,
  31,
  17,
  9,
  5
];

const _lerp = (a: number, b: number, c: number) => a + c * (b - a);

const _altitudeToZoom = (altitude: number, comparisonFunc: (altitude: number, zoomLevelDistance: number) => boolean) => {
  const zoom = _altitudes.findIndex((zoomLevelDistance) => {
    return comparisonFunc(altitude, zoomLevelDistance);
  });
  const maxZoom = _altitudes.length - 1;
  return (zoom === -1) ? maxZoom : zoom;
};

const _nearestZoomAbove = (distance: number) => {
  const zoomAbove = _altitudeToZoom(distance, (d, z) => { return d > z; });
  return Math.max(0, zoomAbove - 1);
};

const _nearestZoomBelow = (distance: number) => _altitudeToZoom(distance, (d, z) => d >= z);

export const zoomToDistance = (zoom: number): number => {
  let zoomlevel = zoom;
  if (zoomlevel < 0) {
    zoomlevel = 0;
  } else if (zoomlevel >= _altitudes.length) {
    zoomlevel = _altitudes.length - 1;
  }

  const nearestZoomBelow = Math.floor(zoomlevel);
  const nearestZoomAbove = Math.ceil(zoomlevel);
  const valueBetweenNearestZoomLevels = zoomlevel - nearestZoomBelow;
  return _lerp(_altitudes[nearestZoomBelow], _altitudes[nearestZoomAbove], valueBetweenNearestZoomLevels);
};

export const distanceToZoom = (distance: number): number => {
  const smallestAltitude = _altitudes.length - 1;
  if (distance < _altitudes[smallestAltitude]) {
    distance = _altitudes[smallestAltitude];
  }
  if (distance > _altitudes[0]) {
    distance = _altitudes[0];
  }
  const nearestZoomAbove = _nearestZoomAbove(distance);
  const nearestZoomBelow = _nearestZoomBelow(distance);
  const distanceBetweenNearestZoomLevels = _altitudes[nearestZoomAbove] - _altitudes[nearestZoomBelow];
  const distanceFromZoomLevelBelow = distance - _altitudes[nearestZoomBelow];

  return (nearestZoomAbove === nearestZoomBelow) ? nearestZoomBelow : _lerp(nearestZoomBelow, nearestZoomAbove, distanceFromZoomLevelBelow / distanceBetweenNearestZoomLevels);
};
