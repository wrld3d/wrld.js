import type { Heatmap } from "../../public/heatmap";

declare class HeatmapsModule {
  addHeatmap: (heatmap: Heatmap) => void;
  removeHeatmap: (heatmap: Heatmap) => void;
}

export type { HeatmapsModule };
