import { Message, UserData } from "@/examples/data";
import { useChatStore } from "@/hooks/use-chat-store";
import { ChatList } from "./chat-list";
import ChatTopBar from "./chat-top-bar";

interface ChatProps {
  selectedUser: UserData;
}

export function Chat({ selectedUser }: ChatProps) {
  const messagesState = useChatStore((state) => state.messages);

  const sendMessage = (newMessage: Message) => {
    useChatStore.setState((state) => ({
      messages: [...state.messages, newMessage],
    }));
  };

  return (
    <div className="ui-flex ui-flex-col ui-justify-between ui-w-full ui-h-full">
      <ChatTopBar selectedUser={selectedUser} />
      <ChatList messages={messagesState} selectedUser={selectedUser} />
    </div>
  );
}
