import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { FlowiseMessage } from "@/flowise/components/flowise-message";
import { useChatSelector } from "@/flowise/store/store-provider";
import { memo } from "react";

export const FlowiseMessageList = memo(function FlowiseMessageList() {
  const messages = useChatSelector("messages");
  return (
    <ChatMessageList>
      {messages.map((message) => (
        <FlowiseMessage key={message.id} message={message} />
      ))}
    </ChatMessageList>
  );
});
