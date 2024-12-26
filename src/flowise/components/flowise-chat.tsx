import { FlowiseChatInputBar } from "@/flowise/components/flowise-chat-input-bar";
import { FlowiseMessageList } from "@/flowise/components/flowise-message-list";
import { useFlowiseChat } from "@/flowise/hooks/use-flowise-chat";
import { useChatSelector } from "@/flowise/store/store-provider";
import { useCallback } from "react";

export function FlowiseChat() {
  const isResponding = useChatSelector("isResponding");
  const currentMessage = useChatSelector("currentMessage");
  const files = useChatSelector("files");
  const setCurrentMessage = useChatSelector("setCurrentMessage");
  const setFiles = useChatSelector("setFiles");
  const setResponding = useChatSelector("setResponding");
  const addMessage = useChatSelector("addMessage");
  const updateLastMessage = useChatSelector("updateLastMessage");
  const setError = useChatSelector("setError");

  const { handleSend } = useFlowiseChat();

  const onSend = useCallback(async () => {
    if (!currentMessage.trim() || isResponding) return;

    setResponding(true);
    setCurrentMessage("");

    // Add user message
    addMessage(currentMessage, false);

    // Add empty bot message that will be updated
    addMessage("", true);

    await handleSend({
      message: currentMessage,
      files,
      onMessage: (message) => {
        updateLastMessage((msg) => ({
          content: msg.content + message,
        }));
      },
      onError: (error) => {
        console.error("Error:", error);
        setError(error.message);
      },
      onFinish: () => {
        setResponding(false);
        setFiles([]);
      },
    });
  }, [
    currentMessage,
    isResponding,
    files,
    handleSend,
    setCurrentMessage,
    setFiles,
    setResponding,
    addMessage,
    updateLastMessage,
    setError,
  ]);

  return (
    <div className="ui-h-[calc(100vh-10vh)] ui-min-w-full">
      <div className="ui-flex ui-flex-col ui-justify-between ui-w-full ui-h-full">
        <FlowiseMessageList />
        <FlowiseChatInputBar onSend={onSend} />
      </div>
    </div>
  );
}
