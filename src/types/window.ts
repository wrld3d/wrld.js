import L from "leaflet";
import { Module } from "./module";

declare global {
  interface Window {
    createWrldModule: (module: Module) => Module;
    L: typeof L;
  }
}
