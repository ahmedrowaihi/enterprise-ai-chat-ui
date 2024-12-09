import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "@/components/ui/chat/chat-bubble";
import { Message } from "@/examples/data";
import { actionIcons } from "./shared-actions";

interface AnswerBubbleProps {
  message: Message;
}

export function AnswerBubble({ message }: AnswerBubbleProps) {
  return (
    <ChatBubble variant="received">
      <ChatBubbleAvatar src={message.avatar} />
      <ChatBubbleMessage isLoading={message.isLoading}>
        {message.message}
        {message.timestamp && (
          <ChatBubbleTimestamp timestamp={message.timestamp} />
        )}
      </ChatBubbleMessage>
      <ChatBubbleActionWrapper className="ui-opacity-0 group-hover:ui-opacity-100 ui-transition-opacity">
        {actionIcons.map(({ icon: Icon, type }) => (
          <ChatBubbleAction
            className="ui-size-7"
            icon={<Icon className="ui-size-4" />}
            onClick={() => console.log(`Action ${type} clicked`)}
          />
        ))}
      </ChatBubbleActionWrapper>
    </ChatBubble>
  );
}
