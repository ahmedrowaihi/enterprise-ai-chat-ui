import { http, HttpResponse } from "msw";
import { sleep } from "./workflow-utils";
import { createWorkflowEvents, createNodeEvents, createMessageEvent } from "./workflow-utils";
import { WORKFLOW_ID, TASK_ID, NodeType,  } from "./types";

export const parallelWorkflowChatbotHandler = http.post("/api/chat-parallel", async () => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Workflow started
      controller.enqueue(
        encoder.encode(createWorkflowEvents.started(WORKFLOW_ID, TASK_ID))
      );
      await sleep(500);

      // Initial planning node
      const planningNode = {
        id: "agent-1",
        name: "Agent Planning",
        type: NodeType.Agent,
      };
      controller.enqueue(encoder.encode(createNodeEvents.started(planningNode)));
      await sleep(500);
      controller.enqueue(encoder.encode(createNodeEvents.finished(planningNode)));
      await sleep(300);

      // Start parallel processing nodes
      const parallelNodes = [
        {
          id: "llm-1",
          name: "Context Analysis",
          type: NodeType.LLM,
        },
        {
          id: "kb-1",
          name: "Knowledge Search",
          type: NodeType.KnowledgeBase,
        },
        {
          id: "tool-1",
          name: "Data Processing",
          type: NodeType.Tool,
        },
      ];

      // Start all parallel nodes
      for (const node of parallelNodes) {
        controller.enqueue(encoder.encode(createNodeEvents.started(node)));
        await sleep(100); // Small delay between starts
      }

      controller.enqueue(
        encoder.encode(createMessageEvent("Analyzing multiple sources..."))
      );

      // Simulate parallel processing
      await sleep(1000);

      // Finish nodes in different order to show parallel nature
      controller.enqueue(
        encoder.encode(createNodeEvents.finished(parallelNodes[1])) // KB finishes first
      );
      await sleep(300);
      controller.enqueue(
        encoder.encode(createNodeEvents.finished(parallelNodes[2])) // Tool finishes second
      );
      await sleep(200);
      controller.enqueue(
        encoder.encode(createNodeEvents.finished(parallelNodes[0])) // LLM finishes last
      );

      // Start final response generation
      const responseNode = {
        id: "response-1",
        name: "Response Generation",
        type: NodeType.ResponseGeneration,
      };
      controller.enqueue(encoder.encode(createNodeEvents.started(responseNode)));
      await sleep(500);

      // Send the final message
      controller.enqueue(
        encoder.encode(
          createMessageEvent(
            "Based on parallel analysis of context, knowledge base, and data processing, here is your answer:\n\nI've processed multiple sources simultaneously to provide you with a comprehensive response. What would you like to know?"
          )
        )
      );

      controller.enqueue(encoder.encode(createNodeEvents.finished(responseNode)));
      await sleep(300);

      // Workflow finished
      controller.enqueue(
        encoder.encode(createWorkflowEvents.finished())
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