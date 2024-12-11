import { http, HttpResponse } from "msw";
import { sleep } from "./workflow-utils";


enum WorkflowRunningStatus {
  Running = "running",
  Succeeded = "succeeded",
  Failed = "failed",
  Stopped = "stopped",
}

enum NodeType {
  LLM = "llm",
  KnowledgeBase = "knowledge_base",
  ResponseGeneration = "response_generation",
  Agent = "agent",
  Tool = "tool",
  Workflow = "workflow",
}

export const basicWorkflowChatbotHandler = http.post("/api/chat", async () => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Workflow started
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "workflow_started",
              workflow_run_id: "test-workflow-id",
              task_id: "test-task-id",
              data: {
                status: WorkflowRunningStatus.Running,
              },
            }) +
            "\n\n"
        )
      );
      await sleep(500);

      // Agent Planning Node
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "node_started",
              data: {
                id: "agent-1",
                node_id: "agent-1",
                node_name: "Agent Planning",
                status: WorkflowRunningStatus.Running,
                node_type: NodeType.Agent,
              },
            }) +
            "\n\n"
        )
      );
      await sleep(500);

      // Agent Planning Node Finished
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "node_finished",
              data: {
                id: "agent-1",
                node_id: "agent-1",
                node_name: "Agent Planning",
                status: WorkflowRunningStatus.Succeeded,
                node_type: NodeType.Agent,
              },
            }) +
            "\n\n"
        )
      );
      await sleep(500);

      // LLM Analysis Node
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "node_started",
              data: {
                id: "llm-1",
                node_id: "llm-1",
                node_name: "LLM Analysis",
                status: WorkflowRunningStatus.Running,
                node_type: NodeType.LLM,
              },
            }) +
            "\n\n"
        )
      );
      await sleep(500);

      // LLM Analysis messages
      const llmMessages = ["Analyzing", " your", " request", "..."];
      for (const msg of llmMessages) {
        controller.enqueue(
          encoder.encode(
            "data: " +
              JSON.stringify({
                event: "message",
                answer: msg,
                conversation_id: "test-conv-id",
                task_id: "test-task-id",
                id: "test-message-id",
              }) +
              "\n\n"
          )
        );
        await sleep(300);
      }

      // LLM Analysis Node Finished
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "node_finished",
              data: {
                id: "llm-1",
                node_id: "llm-1",
                node_name: "LLM Analysis",
                status: WorkflowRunningStatus.Succeeded,
                node_type: NodeType.LLM,
              },
            }) +
            "\n\n"
        )
      );
      await sleep(500);

      // Knowledge Base Search Node
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "node_started",
              data: {
                id: "kb-1",
                node_id: "kb-1",
                node_name: "Knowledge Base Search",
                status: WorkflowRunningStatus.Running,
                node_type: NodeType.KnowledgeBase,
              },
            }) +
            "\n\n"
        )
      );
      await sleep(700);

      // Knowledge Base Search Node Finished
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "node_finished",
              data: {
                id: "kb-1",
                node_id: "kb-1",
                node_name: "Knowledge Base Search",
                status: WorkflowRunningStatus.Succeeded,
                node_type: NodeType.KnowledgeBase,
              },
            }) +
            "\n\n"
        )
      );
      await sleep(500);

      // Tool Operation Node
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "node_started",
              data: {
                id: "tool-1",
                node_id: "tool-1",
                node_name: "Data Processing",
                status: WorkflowRunningStatus.Running,
                node_type: NodeType.Tool,
              },
            }) +
            "\n\n"
        )
      );
      await sleep(500);

      // Tool Operation Node Finished
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "node_finished",
              data: {
                id: "tool-1",
                node_id: "tool-1",
                node_name: "Data Processing",
                status: WorkflowRunningStatus.Succeeded,
                node_type: NodeType.Tool,
              },
            }) +
            "\n\n"
        )
      );
      await sleep(500);

      // Response Generation Node
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "node_started",
              data: {
                id: "response-1",
                node_id: "response-1",
                node_name: "Response Generation",
                status: WorkflowRunningStatus.Running,
                node_type: NodeType.ResponseGeneration,
              },
            }) +
            "\n\n"
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
        controller.enqueue(
          encoder.encode(
            "data: " +
              JSON.stringify({
                event: "message",
                answer: msg,
                conversation_id: "test-conv-id",
                task_id: "test-task-id",
                id: "test-message-id",
              }) +
              "\n\n"
          )
        );
        await sleep(300);
      }

      // Response Generation Node Finished
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "node_finished",
              data: {
                id: "response-1",
                node_id: "response-1",
                node_name: "Response Generation",
                status: WorkflowRunningStatus.Succeeded,
                node_type: NodeType.ResponseGeneration,
              },
            }) +
            "\n\n"
        )
      );
      await sleep(500);

      // Workflow finished
      controller.enqueue(
        encoder.encode(
          "data: " +
            JSON.stringify({
              event: "workflow_finished",
              data: {
                status: WorkflowRunningStatus.Succeeded,
              },
            }) +
            "\n\n"
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
