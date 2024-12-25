import { sleep } from "@/playground/utils";
import {
  createMessageEvent,
  createNodeEvents,
  createWorkflowEvents,
  NodeType,
  TASK_ID,
  WORKFLOW_ID,
  WorkflowRunningStatus,
} from "@/playground/mocks/utils";
import { http, HttpResponse } from "msw";

export const memoryWorkflowChatbotHandler = http.post(
  "/api/chat-memory",
  async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Workflow started
        controller.enqueue(
          encoder.encode(createWorkflowEvents.started(WORKFLOW_ID, TASK_ID))
        );
        await sleep(500);

        // Memory Analysis Node
        const memoryAnalysisNode = {
          id: "memory-1",
          name: "Memory Analysis",
          type: NodeType.LLM,
        };
        controller.enqueue(
          encoder.encode(createNodeEvents.started(memoryAnalysisNode))
        );
        await sleep(500);

        // Memory Analysis messages
        const analysisMessages = [
          "Analyzing memory request",
          "...",
          "Processing memory content",
        ];
        for (const msg of analysisMessages) {
          controller.enqueue(encoder.encode(createMessageEvent(msg)));
          await sleep(300);
        }

        controller.enqueue(
          encoder.encode(createNodeEvents.finished(memoryAnalysisNode))
        );
        await sleep(500);

        // Memory Storage Node
        const memoryStorageNode = {
          id: "storage-1",
          name: "Memory Storage",
          type: NodeType.Tool,
        };
        controller.enqueue(
          encoder.encode(createNodeEvents.started(memoryStorageNode))
        );
        await sleep(700);

        controller.enqueue(
          encoder.encode(createNodeEvents.finished(memoryStorageNode))
        );
        await sleep(500);

        // Response Generation Node
        const responseNode = {
          id: "response-1",
          name: "Response Generation",
          type: NodeType.ResponseGeneration,
        };
        controller.enqueue(
          encoder.encode(createNodeEvents.started(responseNode))
        );
        await sleep(500);

        // Final response messages
        const responseMessages = [
          "I've stored that in my memory.",
          " I'll remember this information",
          " for our future conversations.",
          "\n\nIs there anything specific",
          " you'd like me to recall?",
        ];
        for (const msg of responseMessages) {
          controller.enqueue(encoder.encode(createMessageEvent(msg)));
          await sleep(300);
        }

        controller.enqueue(
          encoder.encode(createNodeEvents.finished(responseNode))
        );
        await sleep(500);

        // Workflow finished
        controller.enqueue(
          encoder.encode(
            createWorkflowEvents.finished(WorkflowRunningStatus.Succeeded)
          )
        );

        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  }
);
