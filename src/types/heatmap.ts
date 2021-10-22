import type { Heatmap } from "../public/heatmap";

export type Heatmaps = {
  addHeatmap: (heatmap: Heatmap) => void;
  removeHeatmap: (heatmap: Heatmap) => void;
};

export default Heatmaps;
