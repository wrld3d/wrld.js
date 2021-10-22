import type { Prop } from "../public/prop";
import type { MapId, MapFloorId } from "../public/map";

export declare class Props {
  addProp(prop: Prop): void;
  addProps(props: Prop[]): void;
  removeProp(prop: Prop): void;
  removeProps(props: Prop[]): void;
  setAutomaticIndoorMapPopulationEnabled(enabled: boolean): void;
  isAutomaticIndoorMapPopulationEnabled(): boolean;
  setIndoorMapPopulationServiceUrl(serviceUrl: string): boolean;
  getIndoorMapEntitySetProps(indoorMapId: MapId, indoorMapFloorId: MapFloorId): Prop[] | null;
}

export default Props;
