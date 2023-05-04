import type { StreamingCompletedEventHandler, BasicStreamingCompletedEventHandler, StreamingStartedEventHandler, StreamingCompletedEventType, BasicStreamingCompletedEventType, StreamingStartedEventType } from "../../public/streaming";
import type { WrldEvent } from "../event";
import type { StreamingModuleImpl } from "../../private/modules/streaming_module";

declare class StreamingModule {

  on(type: StreamingCompletedEventType, fn: StreamingCompletedEventHandler): void;
  on(type: BasicStreamingCompletedEventType, fn: BasicStreamingCompletedEventHandler): void;
  on(type: StreamingStartedEventType, fn: StreamingStartedEventHandler): void;
  once(type: StreamingCompletedEventType, fn: StreamingCompletedEventHandler): void;
  once(type: BasicStreamingCompletedEventType, fn: BasicStreamingCompletedEventHandler): void;
  once(type: StreamingStartedEventType, fn: StreamingStartedEventHandler): void;
  off(event: StreamingCompletedEventType, handler: (e: WrldEvent) => void): this;
  off(type: BasicStreamingCompletedEventType, fn: BasicStreamingCompletedEventHandler): void;
  off(event: StreamingStartedEventType, handler: (e: StreamingStartedEventType) => void): this;
  /** @internal */
  _getImpl(): StreamingModuleImpl;
}

export type { StreamingModule };
