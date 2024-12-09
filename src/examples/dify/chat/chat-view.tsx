import { useChatStore } from "@/hooks/use-chat-store";
import { ChatList } from "./chat-list";
import ChatTopBar from "./chat-top-bar";
import ChatBottomBar from "./chat-bottom-bar";

export function ChatView() {
  const messagesState = useChatStore((state) => state.messages);

  return (
    <div className="ui-flex ui-flex-col ui-justify-between ui-w-full ui-h-full">
      <ChatTopBar />
      <ChatList messages={messagesState} />
      <ChatBottomBar />
    </div>
  );
}
