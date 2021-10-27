export type Color =
  | string
  | ColorArray
  | {
      r: number;
      g: number;
      b: number;
      a?: number;
    };

export type ColorArray = [number, number, number] | [number, number, number, number];

export default Color;
