import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChatSkeleton } from "@/components/chat-skeleton";
import { lazy, Suspense, useMemo, useState } from "react";

const Chatbot = lazy(() =>
  import("./examples/chatbot").then((module) => ({ default: module.Chatbot }))
);

const Chatbot2 = lazy(() =>
  import("./examples/chatbot2").then((module) => ({ default: module.Chatbot2 }))
);

const ChatMessenger = lazy(() =>
  import("./examples/chat-messenger").then((module) => ({
    default: module.ChatMessenger,
  }))
);

const Dify = lazy(() =>
  import("./examples/dify").then((module) => ({ default: module.Dify }))
);
const Playground = lazy(() =>
  import("./playground").then((module) => ({ default: module.Playground }))
);

const Flowise = lazy(() =>
  import("./flowise").then((module) => ({
    default: module.Flowise,
  }))
);

function App() {
  const { SelectChat, renderSelectedChat } = useSelectChat();
  return (
    <div className="ui-h-screen ui-min-w-full ui-p-4">
      {SelectChat}
      <div className="ui-h-[calc(100vh-10vh)] ui-min-w-full">
        <Suspense fallback={<ChatSkeleton />}>{renderSelectedChat}</Suspense>
      </div>
    </div>
  );
}

export default App;

type chats =
  | "flowise"
  | "dify"
  | "playground"
  | "messenger"
  | "chatbot"
  | "chatbot2"
  | "custom";

function useSelectChat() {
  const [selectedChat, setSelectedChat] = useState<chats>("flowise");

  const renderSelectedChat = useMemo(() => {
    switch (selectedChat) {
      case "playground":
        return <Playground />;
      case "flowise":
        return <Flowise />;
      case "dify":
        return <Dify />;
      case "messenger":
        return <ChatMessenger />;
      case "chatbot":
        return <Chatbot />;
      case "chatbot2":
        return <Chatbot2 />;
      default:
        return <ChatMessenger />;
    }
  }, [selectedChat]);

  const SelectChat = useMemo(() => {
    return (
      <Select
        onValueChange={(value: chats) => setSelectedChat(value)}
        defaultValue="flowise"
      >
        <SelectTrigger className="ui-w-[280px] ui-mb-4">
          <SelectValue placeholder="Select a chat interface" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="flowise">Flowise</SelectItem>
          <SelectItem value="playground">Playground</SelectItem>
          <SelectItem value="dify">Dify</SelectItem>
          <SelectItem value="messenger">Chat Messenger</SelectItem>
          <SelectItem value="chatbot">Chatbot</SelectItem>
          <SelectItem value="chatbot2">Chatbot 2</SelectItem>
          <SelectItem value="custom">Custom Chat</SelectItem>
        </SelectContent>
      </Select>
    );
  }, [selectedChat]);
  return { SelectChat, renderSelectedChat };
}
