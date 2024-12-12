import { useCallback } from "react";
import { WorkflowRunningStatus } from "../mocks/handlers/events";
import { useChatStore } from "../store/chat-store";
import { streamEventHandler } from "../utils/stream-handler";

export function useChat() {
  const {
    messages: chatList,
    isResponding,
    currentMessage: message,
    setCurrentMessage: setMessage,
    addMessage,
    setResponding,
    updateLastMessage,
    setError,
  } = useChatStore();

  const handleSend = useCallback(
    async (endpoint: string) => {
      if (!message.trim() || isResponding) return;

      setResponding(true);
      setMessage("");

      // Add user message
      addMessage(message, false);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        // Add empty bot message that will be updated
        addMessage("", true);

        await streamEventHandler(response, {
          onWorkflowStarted: (data) => {
            updateLastMessage(() => ({
              workflowProcess: {
                status: WorkflowRunningStatus.Running,
                tracing: data.tracing || [],
              },
            }));
          },
          onMessage: (data) =>
            updateLastMessage((msg) => ({
              content: msg.content + data.answer,
            })),
          onWorkflowFinished: (data) => {
            updateLastMessage((msg) => ({
              workflowProcess: {
                ...msg.workflowProcess,
                status: data.status,
                tracing: msg.workflowProcess?.tracing || [],
              },
            }));
          },
          onNodeStarted: (data) => {
            updateLastMessage((msg) => ({
              workflowProcess: {
                ...msg.workflowProcess,
                status: WorkflowRunningStatus.Running,
                tracing: [
                  ...(msg.workflowProcess?.tracing || []),
                  { ...data, status: WorkflowRunningStatus.Running },
                ],
              },
            }));
          },
          onNodeFinished: (data) => {
            updateLastMessage((msg) => ({
              workflowProcess: {
                ...msg.workflowProcess,
                status:
                  msg.workflowProcess?.status || WorkflowRunningStatus.Running,
                tracing:
                  msg.workflowProcess?.tracing?.map((node) =>
                    node.node_id === data.node_id
                      ? { ...data, status: WorkflowRunningStatus.Succeeded }
                      : node
                  ) || [],
              },
            }));
          },
        });
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setResponding(false);
      }
    },
    [
      message,
      isResponding,
      addMessage,
      updateLastMessage,
      setResponding,
      setMessage,
      setError,
    ]
  );

  return {
    chatList,
    isResponding,
    message,
    setMessage,
    handleSend,
  };
}
