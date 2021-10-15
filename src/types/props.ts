import type L from "leaflet";
import type ElevationMode from "./elevationMode";
import type Map from "./map";

declare namespace props {
  class Props {
      addProp(prop: Prop): void;
      addProps(props: Prop[]): void;
      removeProp(prop: Prop): void;
      removeProps(props: Prop[]): void;
      setAutomaticIndoorMapPopulationEnabled(enabled: boolean): void;
      isAutomaticIndoorMapPopulationEnabled(): boolean;
      setIndoorMapPopulationServiceUrl(serviceUrl: string): boolean;
      getIndoorMapEntitySetProps(indoorMapId: Map.MapId, indoorMapFloorId: Map.MapFloorId): Prop[] | null;
  }

  type PropOptions = {
      elevation?: number;
      elevationMode?: ElevationMode;
      indoorMapId?: Map.MapId;
      indoorMapFloorId?: Map.MapFloorId;
      headingDegrees?: number;
  };
  
  class Prop {
      constructor(name: string, geometryId: string, location: L.LatLngExpression, options?: PropOptions);
      addTo(map: Map): this;
      remove(): this;
      getLocation(): L.LatLng;
      setLocation(latLng: L.LatLngExpression): this;
      getIndoorMapId(): Map.MapId;
      getIndoorMapFloorId(): Map.MapFloorId;
      getHeadingDegrees(): number;
      setHeadingDegrees(heading: number): this;
      getElevation(): number;
      setElevation(elevation : number): this;
      getElevationMode(): ElevationMode;
      setElevationMode(elevationMode: ElevationMode): this;
      getGeometryId(): string;
      setGeometryId(geometryId: string): this;
      getName(): string;
  }
}

export default props;
