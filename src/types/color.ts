import type { Vector3, Vector4 } from "./vector";

export type Color = string | Vector3 | Vector4 | {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export default Color;