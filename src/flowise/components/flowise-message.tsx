import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { actionIcons } from "@/examples/dify/chat/bubbles/shared-actions";
import type { Message } from "@/flowise/store/chat-store-model";
import { cn } from "@/lib/utils";
import { memo } from "react";

export const FlowiseMessage = memo(function FlowiseMessage({
  message,
}: {
  message: Message;
}) {
  return (
    <ChatBubble
      variant={message.isAnswer ? "received" : "sent"}
      key={message.id}
      className={cn(message.isAnswer ? "ui-text-start" : "ui-text-end")}
    >
      <ChatBubbleMessage className="ui-flex ui-flex-col ui-gap-2 ui-min-w-28">
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
