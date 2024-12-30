import { useChatStore } from "@/chat/store/chat-store";
import {
  PlaygroundAdapter,
  PlaygroundConfig,
} from "@/playground/core/playground-adapter";
import {
  NodeType,
  WorkflowRunningStatus,
} from "@/playground/mocks/utils/event-types";
import {
  usePlaygroundStore,
  WorkflowMessage,
} from "@/playground/store/playground-store";
import { NodeTracing } from "@/playground/types";
import { parseAndHandleEvent } from "@/playground/utils/stream-handler";
import { useEffect, useMemo, useState } from "react";

export function usePlaygroundChat(endpoint: string) {
  const [isReady, setIsReady] = useState(false);
  const {
    adapter,
    setAdapter,
    messages,
    isResponding,
    userInput,
    setUserInput,
    addMessage,
    setResponding,
  } = useChatStore();
  const {
    currentMessage,
    setCurrentMessage,
    addCompletedMessage,
    getCompletedMessage,
  } = usePlaygroundStore();

  // Combine regular messages with current streaming message
  const allMessages = useMemo(() => {
    const result = messages.map((msg) => {
      if (msg.isBot) {
        // Try to get completed message with workflow info
        const completed = getCompletedMessage(msg.id);
        if (completed) {
          return completed;
        }
      }
      return msg;
    });

    if (currentMessage && isResponding) {
      return [...result, currentMessage];
    }
    return result;
  }, [messages, currentMessage, isResponding, getCompletedMessage]);

  useEffect(() => {
    if (!adapter || !(adapter instanceof PlaygroundAdapter)) {
      const config = new PlaygroundConfig(endpoint);
      const newAdapter = new PlaygroundAdapter(config);

      newAdapter.onReady(() => {
        setIsReady(true);
        setAdapter(newAdapter);
      });
      newAdapter.initialize();
    }
  }, [endpoint, setAdapter]);

  const sendMessage = async (options: { message: string }) => {
    if (!adapter || !isReady || isResponding) return;
    if (!options.message.trim()) return;

    setResponding(true);
    setUserInput("");

    // Add user message
    addMessage(options.message, false);

    // Create streaming message
    const streamingMessage: WorkflowMessage = {
      id: crypto.randomUUID(),
      content: "",
      isBot: true,
    };
    setCurrentMessage(streamingMessage);
    try {
      await adapter.sendMessage(options.message, [], {
        onStreamMessage: (event) => {
          parseAndHandleEvent(event, {
            onWorkflowStarted: (data: {
              status: WorkflowRunningStatus;
              tracing?: any[];
            }) => {
              setCurrentMessage(
                (msg) =>
                  msg && {
                    ...msg,
                    workflowProcess: {
                      status: data.status,
                      tracing: data.tracing || [],
                      expand: true,
                    },
                  }
              );
            },
            onMessage: (data: { answer: string }) => {
              setCurrentMessage(
                (msg) =>
                  msg && {
                    ...msg,
                    content: msg.content + data.answer,
                  }
              );
            },
            onWorkflowFinished: (data: { status: WorkflowRunningStatus }) => {
              setCurrentMessage(
                (msg) =>
                  msg && {
                    ...msg,
                    workflowProcess: {
                      ...msg.workflowProcess!,
                      status: data.status,
                    },
                  }
              );
            },
            onNodeStarted: (data: {
              node_id: string;
              node_name: string;
              node_type: NodeType;
              status?: WorkflowRunningStatus;
            }) => {
              setCurrentMessage((msg) => {
                if (!msg) return msg;
                const newNode: NodeTracing = {
                  ...data,
                  id: data.node_id,
                  status: data.status || WorkflowRunningStatus.Running,
                };
                return {
                  ...msg,
                  workflowProcess: {
                    ...msg.workflowProcess!,
                    tracing: [...(msg.workflowProcess?.tracing || []), newNode],
                  },
                };
              });
            },
            onNodeFinished: (data: {
              node_id: string;
              status: WorkflowRunningStatus;
            }) => {
              setCurrentMessage(
                (msg) =>
                  msg && {
                    ...msg,
                    workflowProcess: {
                      ...msg.workflowProcess!,
                      tracing: msg.workflowProcess!.tracing.map((node) =>
                        node.node_id === data.node_id
                          ? { ...node, status: data.status }
                          : node
                      ),
                    },
                  }
              );
            },
          });
        },
        onStreamEnd: () => {
          setCurrentMessage((msg) => {
            if (msg) {
              // Add to chat store
              const lastMessage = addMessage(msg.content, true);
              // Preserve workflow info
              addCompletedMessage({
                ...msg,
                id: lastMessage.id,
              });
            }
            return undefined;
          });
          setResponding(false);
        },
        onStreamError: (error) => {
          setCurrentMessage(undefined);
          setResponding(false);
          console.error("Stream error:", error);
        },
      });
    } catch (error) {
      setCurrentMessage(undefined);
      setResponding(false);
      console.error("Send error:", error);
    }
  };

  return {
    messages: allMessages,
    isResponding,
    userInput,
    setUserInput,
    sendMessage,
    isReady: isReady && !!adapter,
  };
}
