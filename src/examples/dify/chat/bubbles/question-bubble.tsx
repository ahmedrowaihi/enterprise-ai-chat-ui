import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "@/components/ui/chat/chat-bubble";
import { Message } from "@/examples/data";

interface QuestionBubbleProps {
  message: Message;
}

export function QuestionBubble({ message }: QuestionBubbleProps) {
  return (
    <ChatBubble variant="sent">
      <ChatBubbleAvatar src={message.avatar} />
      <ChatBubbleMessage isLoading={message.isLoading}>
        {message.message}
        {message.timestamp && (
          <ChatBubbleTimestamp timestamp={message.timestamp} />
        )}
      </ChatBubbleMessage>
    </ChatBubble>
  );
}
