import type { EventSourceMessage } from "@microsoft/fetch-event-source";
import type { NonStreamingResponse } from "./models";

export interface StreamingHandlers {
  onStreamStart?: (response: Response) => Promise<void>;
  onStreamMessage?: (event: EventSourceMessage) => void;
  onStreamEnd?: (finalContent: string) => void;
  onStreamError?: (error: Error) => void;
}

export interface NonStreamingHandlers {
  onStart?: () => void;
  onResponse?: (content: NonStreamingResponse) => void;
  onError?: (error: Error) => void;
}

export interface SendMessageOptions
  extends StreamingHandlers,
    NonStreamingHandlers {
  message: string;
  files?: File[];
}

export interface ChatHandlers extends StreamingHandlers, NonStreamingHandlers {}
