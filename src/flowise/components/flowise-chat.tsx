import { useChatStore } from "@/chat/store/chat-store";
import MessageLoading from "@/components/ui/chat/message-loading";
import { FlowiseChatInputBar } from "@/flowise/components/flowise-chat-input-bar";
import { FlowiseMessageList } from "@/flowise/components/flowise-message-list";
import { useFlowiseChat } from "@/flowise/hooks/use-flowise-chat";
import { useFlowiseStore } from "@/flowise/store/flowise-store";
import { useCallback } from "react";

export function FlowiseChat() {
  const config = useFlowiseStore((state) => state.config);
  const setFlowiseCurrentMessage = useFlowiseStore(
    (state) => state.setFlowiseCurrentMessage
  );
  const {
    setFiles,
    addMessage,
    setError,
    setResponding,
    setUserInput,
    files,
    isResponding,
    userInput,
  } = useChatStore();

  const { handleSend, isReady } = useFlowiseChat(config);

  const onStart = useCallback(() => {
    addMessage(userInput, false);
    setUserInput("");
  }, [userInput, addMessage, setUserInput]);

  const onSend = useCallback(async () => {
    if (!userInput.trim() || isResponding) return;

    try {
      onStart();
      setResponding(true);

      const id = crypto.randomUUID();
      await handleSend({
        message: userInput,
        files,
        onStreamMessage: (event) => {
          switch (event.event) {
            case "token":
              setFlowiseCurrentMessage((prev) => ({
                id,
                content: (prev?.content || "") + event.data,
                isBot: true,
              }));
              break;

            case "metadata":
              const metadata = event.data as any;
              setFlowiseCurrentMessage((prev) => ({
                id: metadata.chatMessageId,
                content: prev?.content || "",
                isBot: true,
              }));
              break;
            case "start":
            case "end":
              break;
          }
        },
        onStreamEnd: () => {
          setFlowiseCurrentMessage((prev) => {
            addMessage(prev?.content || "", true);
            return undefined;
          });
          setResponding(false);
          setFiles([]);
        },
        onResponse: (response) => {
          // Handle non-streaming response
          addMessage(response.text, true);
          setResponding(false);
          setFiles([]);
        },
        onStreamError: (error) => {
          setError(error.message);
          setResponding(false);
          addMessage("", true);
          setFiles([]);
        },
        onError: (error) => {
          setError(error.message);
          setResponding(false);
          addMessage("", true);
          setFiles([]);
        },
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setResponding(false);
      addMessage("", true);
      setFiles([]);
    }
  }, [
    userInput,
    isResponding,
    files,
    handleSend,
    setUserInput,
    setFiles,
    addMessage,
    setError,
    setFlowiseCurrentMessage,
    setResponding,
    onStart,
  ]);

  return (
    <div className="ui-h-[calc(100vh-10vh)] ui-min-w-full">
      <div className="ui-flex ui-flex-col ui-justify-between ui-w-full ui-h-full">
        {isReady ? (
          <>
            <FlowiseMessageList />
            <FlowiseChatInputBar onSend={onSend} />
          </>
        ) : (
          <div className="ui-flex ui-justify-center ui-items-center ui-h-full">
            <MessageLoading />
          </div>
        )}
      </div>
    </div>
  );
}
