import L from "leaflet";

import { ElevationMode } from "../types/elevationMode";
import { ElevationModeType, isValidElevationMode } from "../private/elevation_mode";
import { Map, MapId, MapFloorId } from "../wrld.js";
import { factoryFor } from "../private/factoryFor";

export type PropOptions = {
  elevation?: number;
  elevationMode?: ElevationMode;
  indoorMapId?: MapId;
  indoorMapFloorId?: MapFloorId;
  headingDegrees?: number;
};

type Location = Parameters<typeof L.latLng>[0];

export class Prop {
  private _map: null | Map;
  private _name: string;
  private _geometryId: string;
  private __geometryIdNeedsChanged: boolean;
  private _location: L.LatLng;
  private __locationNeedsChanged: boolean;
  private _indoorMapId: MapId;
  private _indoorMapFloorId: MapFloorId;
  private _headingDegrees: number;
  private __headingDegreesNeedsChanged: boolean;
  private _elevation: number;
  private __elevationNeedsChanged: boolean;
  private _elevationMode: ElevationMode;
  private __elevationModeNeedsChanged: boolean;

  constructor(name: string, geometryId: string, location: Location, config: PropOptions = {}) {
    this._map = null;
    this._name = name;
    this._geometryId = geometryId;
    this.__geometryIdNeedsChanged = false;
    this._location = L.latLng(location);
    this.__locationNeedsChanged = false;
    this._indoorMapId = config["indoorMapId"] || "";
    this._indoorMapFloorId = config["indoorMapFloorId"] || 0;
    this._headingDegrees = config["headingDegrees"] || 0.0;
    this.__headingDegreesNeedsChanged = false;
    this._elevation = config["elevation"] || 0.0;
    this.__elevationNeedsChanged = false;
    this._elevationMode = config["elevationMode"] || ElevationModeType.HEIGHT_ABOVE_GROUND;
    this.__elevationModeNeedsChanged = false;
  }

  getLocation = (): L.LatLng => this._location;

  setLocation = (location: Location): this => {
    this._location = L.latLng(location);
    this.__locationNeedsChanged = true;
    return this;
  };

  getIndoorMapId = (): MapId => this._indoorMapId;

  getIndoorMapFloorId = (): MapFloorId => this._indoorMapFloorId;

  getHeadingDegrees = (): number => this._headingDegrees;

  setHeadingDegrees = (headingDegrees: number): this => {
    this._headingDegrees = headingDegrees;
    this.__headingDegreesNeedsChanged = true;
    return this;
  };

  getElevation = (): number => this._elevation;

  setElevation = (elevation: number): this => {
    this._elevation = elevation;
    this.__elevationNeedsChanged = true;
    return this;
  };

  getElevationMode = (): ElevationMode => this._elevationMode;

  setElevationMode = (elevationModeString: ElevationModeType): this => {
    if (isValidElevationMode(elevationModeString)) {
      this._elevationMode = elevationModeString;
      this.__elevationModeNeedsChanged = true;
    }
    return this;
  };

  getGeometryId = (): string => this._geometryId;

  setGeometryId = (geometryId: string): this => {
    this._geometryId = geometryId;
    this.__geometryIdNeedsChanged = true;
    return this;
  };

  getName = (): string => this._name;

  addTo = (map: Map): this => {
    if (this._map !== null) {
      this.remove();
    }
    this._map = map;
    map.props.addProp(this);
    return this;
  };

  remove = (): this => {
    if (this._map !== null) {
      this._map.props.removeProp(this);
      this._map = null;
    }
    return this;
  };

  /** @internal */
  _geometryIdNeedsChanged = (): boolean => this.__geometryIdNeedsChanged;

  /** @internal */
  _onGeometryIdChanged = (): void => {
    this.__geometryIdNeedsChanged = false;
  };

  /** @internal */
  _locationNeedsChanged = (): boolean => this.__locationNeedsChanged;

  /** @internal */
  _onLocationChanged = (): void => {
    this.__locationNeedsChanged = false;
  };

  /** @internal */
  _headingDegreesNeedsChanged = (): boolean => this.__headingDegreesNeedsChanged;

  /** @internal */
  _onHeadingDegreesChanged = (): void => {
    this.__headingDegreesNeedsChanged = false;
  };

  /** @internal */
  _elevationNeedsChanged = (): boolean => this.__elevationNeedsChanged;

  /** @internal */
  _onElevationChanged = (): void => {
    this.__elevationNeedsChanged = false;
  };

  /** @internal */
  _elevationModeNeedsChanged = (): boolean => this.__elevationModeNeedsChanged;

  /** @internal */
  _onElevationModeChanged = (): void => {
    this.__elevationModeNeedsChanged = false;
  };
}

export const prop = factoryFor(Prop);
