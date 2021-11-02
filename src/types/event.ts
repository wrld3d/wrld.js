// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WrldEvent<TYPE = string, TARGET = any> {
  type: TYPE;
  target: TARGET;
}

export type EventHandler<T extends WrldEvent = WrldEvent> = (e: T) => void
