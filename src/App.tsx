import { CustomChat } from "@/components/chat-layout-custom/chat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import "./App.css";
import { Chatbot, Chatbot2, ChatMessenger } from "./examples";

function App() {
  const [selectedChat, setSelectedChat] = useState<string>("messenger");

  const renderSelectedChat = useMemo(() => {
    switch (selectedChat) {
      case "messenger":
        return <ChatMessenger />;
      case "chatbot":
        return <Chatbot />;
      case "chatbot2":
        return <Chatbot2 />;
      case "custom":
        return <CustomChat />;
      default:
        return <ChatMessenger />;
    }
  }, [selectedChat]);

  return (
    <div className="ui-h-screen ui-min-w-full ui-p-4">
      <Select onValueChange={setSelectedChat} defaultValue="messenger">
        <SelectTrigger className="ui-w-[280px] ui-mb-4">
          <SelectValue placeholder="Select a chat interface" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="messenger">Chat Messenger</SelectItem>
          <SelectItem value="chatbot">Chatbot</SelectItem>
          <SelectItem value="chatbot2">Chatbot 2</SelectItem>
          <SelectItem value="custom">Custom Chat</SelectItem>
        </SelectContent>
      </Select>

      <div className="ui-h-[calc(100vh-10vh)] ui-min-w-full">
        {renderSelectedChat}
      </div>
    </div>
  );
}

export default App;
