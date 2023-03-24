
import type { WrldEvent, EventHandler } from "../../types/event";

export type StreamingCompletedEvent = WrldEvent<StreamingCompletedEventType>
export type StreamingStartedEvent = WrldEvent<StreamingStartedEventType> 

export type StreamingCompletedEventHandler = EventHandler<StreamingCompletedEvent>;
export type StreamingStartedEventHandler = EventHandler<StreamingStartedEvent>;

export type StreamingCompletedEventType = "streamingcompleted";
export type StreamingStartedEventType = "streamingstarted";
