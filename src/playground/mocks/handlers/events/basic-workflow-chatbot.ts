import {
  createMessageEvent,
  createNodeEvents,
  createWorkflowEvents,
} from "@/playground/mocks/utils";
import {
  NodeType,
  TASK_ID,
  WORKFLOW_ID,
  WorkflowRunningStatus,
} from "@/playground/mocks/utils/event-types";
import { sleep } from "@/playground/utils/common/sleep";
import { http, HttpResponse } from "msw";

export const basicWorkflowChatbotHandler = http.post("/api/chat", async () => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Workflow started
      controller.enqueue(
        encoder.encode(createWorkflowEvents.started(WORKFLOW_ID, TASK_ID))
      );
      await sleep(500);

      // Agent Planning Node
      controller.enqueue(
        encoder.encode(
          createNodeEvents.started({
            id: "agent-1",
            name: "Agent Planning",
            type: NodeType.Agent,
          })
        )
      );
      await sleep(500);

      // Agent Planning Node Finished
      controller.enqueue(
        encoder.encode(
          createNodeEvents.finished({
            id: "agent-1",
            name: "Agent Planning",
            type: NodeType.Agent,
          })
        )
      );
      await sleep(500);

      // LLM Analysis Node
      controller.enqueue(
        encoder.encode(
          createNodeEvents.started({
            id: "llm-1",
            name: "LLM Analysis",
            type: NodeType.LLM,
          })
        )
      );
      await sleep(500);

      // LLM Analysis messages
      const llmMessages = ["Analyzing", " your", " request", "..."];
      for (const msg of llmMessages) {
        controller.enqueue(encoder.encode(createMessageEvent(msg)));
        await sleep(300);
      }

      // LLM Analysis Node Finished
      controller.enqueue(
        encoder.encode(
          createNodeEvents.finished({
            id: "llm-1",
            name: "LLM Analysis",
            type: NodeType.LLM,
          })
        )
      );
      await sleep(500);

      // Knowledge Base Search Node
      controller.enqueue(
        encoder.encode(
          createNodeEvents.started({
            id: "kb-1",
            name: "Knowledge Base Search",
            type: NodeType.KnowledgeBase,
          })
        )
      );
      await sleep(700);

      // Knowledge Base Search Node Finished
      controller.enqueue(
        encoder.encode(
          createNodeEvents.finished({
            id: "kb-1",
            name: "Knowledge Base Search",
            type: NodeType.KnowledgeBase,
          })
        )
      );
      await sleep(500);

      // Tool Operation Node
      controller.enqueue(
        encoder.encode(
          createNodeEvents.started({
            id: "tool-1",
            name: "Data Processing",
            type: NodeType.Tool,
          })
        )
      );
      await sleep(500);

      // Tool Operation Node Finished
      controller.enqueue(
        encoder.encode(
          createNodeEvents.finished({
            id: "tool-1",
            name: "Data Processing",
            type: NodeType.Tool,
          })
        )
      );
      await sleep(500);

      // Response Generation Node
      controller.enqueue(
        encoder.encode(
          createNodeEvents.started({
            id: "response-1",
            name: "Response Generation",
            type: NodeType.ResponseGeneration,
          })
        )
      );
      await sleep(500);

      // Final response messages
      const responseMessages = [
        "Based on the analysis",
        " and knowledge base search,",
        " here is your answer:",
        "\n\nHello! I can help you with your question.",
        " What would you like to know?",
      ];
      for (const msg of responseMessages) {
        controller.enqueue(encoder.encode(createMessageEvent(msg)));
        await sleep(300);
      }

      // Response Generation Node Finished
      controller.enqueue(
        encoder.encode(
          createNodeEvents.finished({
            id: "response-1",
            name: "Response Generation",
            type: NodeType.ResponseGeneration,
          })
        )
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
});
