
import type { WrldEvent, EventHandler } from "../../types/event";

export type StreamingCompletedEvent = WrldEvent<StreamingCompletedEventType>
export type BasicStreamingCompletedEvent = WrldEvent<BasicStreamingCompletedEventType>
export type StreamingStartedEvent = WrldEvent<StreamingStartedEventType> 

export type StreamingCompletedEventHandler = EventHandler<StreamingCompletedEvent>;
export type BasicStreamingCompletedEventHandler = EventHandler<BasicStreamingCompletedEvent>;
export type StreamingStartedEventHandler = EventHandler<StreamingStartedEvent>;

export type StreamingCompletedEventType = "streamingcompleted";
export type BasicStreamingCompletedEventType = "basicstreamingcompleted";
export type StreamingStartedEventType = "streamingstarted";
