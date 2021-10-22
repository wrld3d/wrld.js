export type Point = [number, number] | [number, number, number];

export type Routes = {
  getRoutes: (
    viaPoints: Point[],
    onLoadHandler: (points: L.LatLng[]) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onErrorHandler: (error: Record<string, any>) => void,
    transportModule: "walking" | "driving"
  ) => void;
};

export default Routes;
