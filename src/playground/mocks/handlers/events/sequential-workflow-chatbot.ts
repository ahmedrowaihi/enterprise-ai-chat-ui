import { http, HttpResponse } from "msw";
import { NodeType, TASK_ID, WORKFLOW_ID } from "./types";
import {
    createMessageEvent,
    createNodeEvents,
    createWorkflowEvents,
    sleep,
} from "./workflow-utils";

export const sequentialWorkflowChatbotHandler = http.post(
  "/api/chat-sequential",
  async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Workflow started
        controller.enqueue(
          encoder.encode(createWorkflowEvents.started(WORKFLOW_ID, TASK_ID))
        );
        await sleep(500);

        // Execute all nodes first
        const nodes = [
          {
            id: "agent-1",
            name: "Agent Planning",
            type: NodeType.Agent,
          },
          {
            id: "llm-1",
            name: "LLM Analysis",
            type: NodeType.LLM,
          },
          {
            id: "kb-1",
            name: "Knowledge Base Search",
            type: NodeType.KnowledgeBase,
          },
          {
            id: "tool-1",
            name: "Data Processing",
            type: NodeType.Tool,
          },
          {
            id: "response-1",
            name: "Response Generation",
            type: NodeType.ResponseGeneration,
          },
        ];

        // Execute all nodes
        for (const node of nodes) {
          controller.enqueue(encoder.encode(createNodeEvents.started(node)));
          await sleep(500);

          controller.enqueue(encoder.encode(createNodeEvents.finished(node)));
          await sleep(500);
        }

        // After all nodes are finished, send the complete message
        const messages = [
          "Based on the analysis",
          " and knowledge base search,",
          " here is your answer:",
          "\n\nHello! I can help you with your question.",
          " What would you like to know?",
        ];

        for (const msg of messages) {
          controller.enqueue(encoder.encode(createMessageEvent(msg)));
          await sleep(300);
        }

        // Workflow finished
        controller.enqueue(encoder.encode(createWorkflowEvents.finished()));

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
