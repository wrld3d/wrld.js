import type * as WrldType from "../wrld";

declare module "leaflet" {
  interface Class {
    initialize(...args: unknown[]): this;
  }

  let Wrld: typeof WrldType;
}
