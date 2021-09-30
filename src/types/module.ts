export type Module = {
  ctx: unknown;
  locateFile: (url: string) => string;
  onExit: (code: number) => void;
};
