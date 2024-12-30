import { Message } from "@/chat/types";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleMessage,
  ChatBubbleMessageProps,
} from "@/components/ui/chat/chat-bubble";
import { actionIcons } from "@/flowise/components/flowise-message-actions";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface FlowiseMessageProps {
  message: Message;
  bubbleMessageProps?: ChatBubbleMessageProps;
}

export const FlowiseMessage = memo(function FlowiseMessage({
  message,
  bubbleMessageProps,
}: FlowiseMessageProps) {
  return (
    <ChatBubble
      variant={message.isBot ? "received" : "sent"}
      className={cn(message.isBot ? "ui-text-start" : "ui-text-end")}
    >
      <ChatBubbleMessage
        className={cn(
          "ui-flex ui-flex-col ui-gap-2 ui-min-w-28",
          bubbleMessageProps?.className
        )}
        {...bubbleMessageProps}
      >
        <span className="ui-text-sm ui-font-medium">{message.content}</span>
      </ChatBubbleMessage>
      <ChatBubbleActionWrapper className="ui-opacity-0 group-hover:ui-opacity-100 ui-transition-opacity">
        {actionIcons.map(({ icon: Icon, type }) => (
          <ChatBubbleAction
            key={type}
            className="ui-size-6"
            icon={<Icon className="ui-size-4" />}
            onClick={() => console.log(`Action ${type} clicked`)}
          />
        ))}
      </ChatBubbleActionWrapper>
    </ChatBubble>
  );
});
