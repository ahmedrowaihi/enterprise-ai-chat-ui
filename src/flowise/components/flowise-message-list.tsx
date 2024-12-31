import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { FlowiseMessage } from "@/flowise/components/flowise-message";
import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { useFlowiseStore } from "@/flowise/store/flowise-store";
import { memo, useEffect, useRef } from "react";

export const FlowiseMessageList = memo(function FlowiseMessageList() {
  const messages = useFlowiseChatStore((state) => state.messages);

  return (
    <ChatMessageList>
      {messages.map((message, index) => (
        <FlowiseMessage key={index} message={message} />
      ))}
      <CurrentFlowiseMessage />
      <ChatScroller />
    </ChatMessageList>
  );
});

const CurrentFlowiseMessage = memo(function CurrentFlowiseMessage() {
  const isResponding = useFlowiseChatStore((state) => state.isResponding);
  const currentMessage = useFlowiseStore(
    (state) => state.flowiseCurrentMessage
  );
  return (
    currentMessage && (
      <FlowiseMessage
        message={currentMessage}
        bubbleMessageProps={{
          isLoading:
            isResponding &&
            !currentMessage.content &&
            !currentMessage.extra?.agentReasonings?.length,
        }}
      />
    )
  );
});

const ChatScroller = memo(function ChatScroller() {
  const messages = useFlowiseChatStore((state) => state.messages);
  const currentMessage = useFlowiseStore(
    (state) => state.flowiseCurrentMessage
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentMessage]);

  return <div ref={messagesEndRef} />;
});
