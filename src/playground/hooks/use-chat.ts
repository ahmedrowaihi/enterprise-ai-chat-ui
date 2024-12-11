import { useCallback, useRef, useState } from "react";
import { NodeType, WorkflowRunningStatus } from "../mocks/handlers/events";

interface NodeTracing {
  id: string;
  node_id: string;
  node_name: string;
  status: WorkflowRunningStatus;
  node_type: NodeType;
}

interface WorkflowProcess {
  status: WorkflowRunningStatus;
  tracing: NodeTracing[];
  expand?: boolean;
}

interface ChatItem {
  id: string;
  content: string;
  isAnswer: boolean;
  workflow_run_id?: string;
  workflowProcess?: WorkflowProcess;
}

export function useChat() {
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const [message, setMessage] = useState("");
  const currentMessageRef = useRef<ChatItem>(null!);

  const handleStream = useCallback((response: Response) => {
    if (!response.ok) throw new Error("Network response was not ok");

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let bufferObj: Record<string, any>;

    const responseItem = currentMessageRef;
    if (!responseItem.current) {
      responseItem.current = {
        id: "temp-id",
        content: "",
        isAnswer: true,
      };
    }

    let messageIndex = -1;

    function updateChatList() {
      setChatList((prev) => {
        const newList = [...prev];
        if (messageIndex === -1) {
          const findIndex = newList.findIndex(
            (item) => item.id === responseItem.current.id
          );
          if (findIndex !== -1) {
            messageIndex = findIndex;
          }
        }
        if (messageIndex !== -1) {
          newList[messageIndex] = { ...responseItem.current };
        } else {
          newList.push({ ...responseItem.current });
        }
        return newList;
      });
    }

    function read() {
      reader?.read().then((result: any) => {
        if (result.done) {
          responseItem.current.id = `user-${Date.now()}`;
          responseItem.current.isAnswer = true;
          setIsResponding(false);
          updateChatList();
          setTimeout(() => {
            responseItem.current = null!;
          }, 0);
          return;
        }

        buffer += decoder.decode(result.value, { stream: true });
        const lines = buffer.split("\n");

        lines.forEach((message) => {
          if (message.startsWith("data: ")) {
            try {
              bufferObj = JSON.parse(message.substring(6));
            } catch (e) {
              return;
            }

            if (bufferObj.event === "workflow_started") {
              responseItem.current.workflow_run_id = bufferObj.workflow_run_id;
              responseItem.current.workflowProcess = {
                status: WorkflowRunningStatus.Running,
                tracing: [],
              };
              updateChatList();
            }

            if (bufferObj.event === "message") {
              responseItem.current.content += bufferObj.answer;
              updateChatList();
            }

            if (bufferObj.event === "workflow_finished") {
              if (responseItem.current.workflowProcess) {
                responseItem.current.workflowProcess.status = bufferObj.data.status;
                updateChatList();
              }
            }

            if (bufferObj.event === "node_started") {
              if (responseItem.current.workflowProcess) {
                responseItem.current.workflowProcess.tracing.push({
                  ...bufferObj.data,
                  status: WorkflowRunningStatus.Running,
                });
                updateChatList();
              }
            }

            if (bufferObj.event === "node_finished") {
              if (responseItem.current.workflowProcess) {
                const index = responseItem.current.workflowProcess.tracing.findIndex(
                  (item) => item.node_id === bufferObj.data.node_id
                );
                if (index !== -1) {
                  responseItem.current.workflowProcess.tracing[index] = {
                    ...bufferObj.data,
                    status: WorkflowRunningStatus.Succeeded,
                  };
                  updateChatList();
                }
              }
            }
          }
        });

        buffer = lines[lines.length - 1];
        read();
      });
    }
    read();
  }, []);

  const handleSend = useCallback(
    async (endpoint: string) => {
      if (!message.trim() || isResponding) return;

      setIsResponding(true);
      setMessage("");

      setChatList((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          content: message,
          isAnswer: false,
        },
      ]);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: message }),
        });

        handleStream(response);
      } catch (error) {
        console.error("Error:", error);
        setIsResponding(false);
      }
    },
    [handleStream, isResponding, message]
  );

  return {
    chatList,
    isResponding,
    message,
    setMessage,
    handleSend,
  };
}

export type { ChatItem, WorkflowProcess, NodeTracing }; 