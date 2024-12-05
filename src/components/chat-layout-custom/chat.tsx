import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { useIsMobile } from "@/hooks/use-breakpoints";
import { cn } from "@/lib/utils";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
export function CustomChat() {
  const isMobile = useIsMobile();
  return (
    <div
      className={cn(
        "ui-h-full ui-w-full ui-flex-col ui-flex ui-bg-white ui-p-4",
        { "ui-flex-col": isMobile }
      )}
    >
      {/* <ChatThreads /> */}
      <ChatMessageList>
        <ChatBubble variant="sent">
          <ChatBubbleAvatar fallback="US" />
          <ChatBubbleMessage variant="sent">
            Hello, how has your day been? I hope you are doing well.
          </ChatBubbleMessage>
        </ChatBubble>
        <ChatBubble variant="received">
          <ChatBubbleAvatar fallback="AI" />
          <ChatBubbleMessage variant="received">
            Hi, I am doing well, thank you for asking. How can I help you today?
          </ChatBubbleMessage>
        </ChatBubble>
        <ChatBubble variant="received">
          <ChatBubbleAvatar fallback="AI" />
          <ChatBubbleMessage isLoading />
        </ChatBubble>
      </ChatMessageList>
      <InputArea />
    </div>
  );
}

function InputArea() {
  return (
    <form className="ui-relative ui-rounded-lg ui-border ui-bg-background focus-within:ui-ring-1 focus-within:ui-ring-ring ui-p-1">
      <ChatInput
        placeholder="Type your message here..."
        className="ui-min-h-12 ui-resize-none ui-rounded-lg ui-bg-background ui-border-0 ui-p-3 ui-shadow-none focus-visible:ui-ring-0"
      />
      <div className="ui-flex ui-items-center ui-p-3 ui-pt-0">
        <Button variant="ghost" size="icon">
          <Paperclip className="ui-size-4" />
          <span className="ui-sr-only">Attach file</span>
        </Button>

        <Button variant="ghost" size="icon">
          <Mic className="ui-size-4" />
          <span className="ui-sr-only">Use Microphone</span>
        </Button>

        <Button size="sm" className="ui-ml-auto ui-gap-1.5">
          Send Message
          <CornerDownLeft className="ui-size-3.5" />
        </Button>
      </div>
    </form>
  );
}
