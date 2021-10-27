/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
export class MapModuleClass {
  /** @internal */ onUpdate(_dt: number) {}

  /** @internal */ onDraw(_dt: number) {}

  /** @internal */ onInitialized() {}

  /** @internal */ onInitialStreamingCompleted() {}
}

/**
 * Used for legacy class extensions via prototype, use MapModuleClass with ES5 classes.
 * @deprecated
 */
export const MapModule = {
  onUpdate: (_dt: number) => {},

  onDraw: (_dt: number) => {},

  onInitialized: () => {},

  onInitialStreamingCompleted: () => {},
};

export default MapModule;
