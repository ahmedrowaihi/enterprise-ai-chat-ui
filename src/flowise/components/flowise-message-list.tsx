import { useChatStore } from "@/chat/store/chat-store";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { FlowiseMessage } from "@/flowise/components/flowise-message";
import { memo } from "react";
import { useFlowiseStore } from "../store/flowise-store";

export const FlowiseMessageList = memo(function FlowiseMessageList() {
  const messages = useChatStore((state) => state.messages);
  return (
    <ChatMessageList>
      {messages.map((message, index) => (
        <FlowiseMessage key={index} message={message} />
      ))}
      <CurrentFlowiseMessage />
    </ChatMessageList>
  );
});

const CurrentFlowiseMessage = () => {
  const isResponding = useChatStore((state) => state.isResponding);
  const currentMessage = useFlowiseStore(
    (state) => state.flowiseCurrentMessage
  );
  return (
    currentMessage && (
      <FlowiseMessage
        message={currentMessage}
        bubbleMessageProps={{
          isLoading: isResponding && !currentMessage.content,
        }}
      />
    )
  );
};
