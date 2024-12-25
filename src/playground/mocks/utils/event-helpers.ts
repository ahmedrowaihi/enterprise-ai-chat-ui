import type { EventSourceMessage } from "@microsoft/fetch-event-source";
import { StreamEventHandlers } from "./event-types";

export function parseAndHandleEvent(
  event: EventSourceMessage,
  handlers: StreamEventHandlers
) {
  try {
    const data = JSON.parse(event.data);
    switch (event.event) {
      case "workflow_started":
        handlers.onWorkflowStarted(data);
        break;
      case "message":
        handlers.onMessage(data);
        break;
      case "workflow_finished":
        handlers.onWorkflowFinished(data);
        break;
      case "node_started":
        handlers.onNodeStarted(data);
        break;
      case "node_finished":
        handlers.onNodeFinished(data);
        break;
    }
  } catch (e) {
    console.error("Error parsing event:", e);
  }
}
