export interface WrldEvent<T = string> {
  type: T;
  target: any;
}

export type EventHandler<T extends WrldEvent = WrldEvent<any>> = (e: T) => void
