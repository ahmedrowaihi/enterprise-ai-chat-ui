import { useState } from "react";
import { ConfigScene } from "../config-scene";
import { ChatView } from "./chat-view";
const props = {
  conversationName: "New conversation",
  hasSetInputs: false,
  isPublicVersion: false,
  siteInfo: {
    title: "AI Chat Assistant",
    description: "Your intelligent conversation partner powered by advanced AI",
    copyright: "© 2024 AI Chat Assistant. All rights reserved.",
    privacy_policy: "https://example.com/privacy-policy",
    default_language: "en",
  },
  promptConfig: {
    prompt_template: "I want you to act as a javascript console.",
    prompt_variables: [
      {
        key: "input_text",
        name: "input_text",
        required: true,
        type: "string",
        options: [],
      },
      {
        key: "editorial_notes",
        name: "editorial_notes",
        required: true,
        type: "string",
        options: [],
      },
      {
        key: "improved_text",
        name: "improved_text",
        required: true,
        type: "string",
        options: [],
      },
    ],
  },
  canEditInputs: true,
  savedInputs: {
    input_text: "Hello, how are you?",
    editorial_notes: "This is a test",
    improved_text: "This is a test",
  },
  onStartChat: () => {},
  onInputsChange: () => {},
};
export function ChatWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  return (
    <div className="ui-w-full">
      {!isChatOpen && (
        <ConfigScene
          {...props}
          siteInfo={props.siteInfo}
          onStartChat={(ss) => {
            console.log(ss);
            setIsChatOpen(true);
          }}
        />
      )}
      {isChatOpen && <ChatView />}
    </div>
  );
}
