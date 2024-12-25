import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useCallback } from "react";
import { useChatStore } from "../store/chat-store";
import { WorkflowRunningStatus } from "../mocks/utils/event-types";
import { parseAndHandleEvent } from "../utils/stream-handler";

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
        await fetchEventSource(endpoint, {
          method: "POST",
          openWhenHidden: true,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
          async onopen(response) {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            // Add empty bot message that will be updated
            addMessage("", true);
          },
          onmessage(event) {
            parseAndHandleEvent(event, {
              onWorkflowStarted: (data) => {
                updateLastMessage(() => ({
                  workflowProcess: {
                    status: data.status,
                    tracing: data.tracing || [],
                  },
                }));
              },
              onMessage: (data) => {
                updateLastMessage((msg) => ({
                  content: msg.content + data.answer,
                }));
              },
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
                    status:
                      msg.workflowProcess?.status ||
                      WorkflowRunningStatus.Running,
                    tracing: [
                      ...(msg.workflowProcess?.tracing || []),
                      { ...data, status: data.status },
                    ],
                  },
                }));
              },
              onNodeFinished: (data) => {
                updateLastMessage((msg) => ({
                  workflowProcess: {
                    ...msg.workflowProcess,
                    status:
                      msg.workflowProcess?.status ||
                      WorkflowRunningStatus.Running,
                    tracing:
                      msg.workflowProcess?.tracing?.map((node) =>
                        node.node_id === data.node_id
                          ? { ...data, status: data.status }
                          : node
                      ) || [],
                  },
                }));
              },
            });
          },
          onerror(err) {
            console.error("Error:", err);
            setError(err instanceof Error ? err.message : "An error occurred");
            setResponding(false);
          },
          onclose() {
            setResponding(false);
          },
        });
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
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
