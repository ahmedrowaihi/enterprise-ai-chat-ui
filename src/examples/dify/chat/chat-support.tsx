"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send } from "lucide-react";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/chat/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { AnimatePresence, motion } from "motion/react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

const initialChatSupportMessages: Message[] = [
  {
    id: "1",
    content: "Hello! How can I help you today?",
    sender: "ai",
    timestamp: new Date().toLocaleTimeString(),
  },
];

export default function ChatSupport() {
  const [messages, setMessages] = useState<Message[]>(
    initialChatSupportMessages
  );
  const [inputMessage, setInputMessage] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ExpandableChat
      icon={<Bot className="ui-h-6 ui-w-6" />}
      size="lg"
      position="bottom-right"
    >
      <ExpandableChatHeader className="ui-flex-col ui-text-center ui-justify-center">
        <h1 className="ui-text-xl ui-font-semibold">Chat with our AI ✨</h1>
        <p>Ask any question for our AI to answer</p>
        <div className="ui-flex ui-gap-2 ui-items-center ui-pt-2">
          <Button variant="secondary">New Chat</Button>
          <Button variant="secondary">See FAQ</Button>
        </div>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList
          ref={messagesContainerRef}
          className="dark:ui-bg-muted/40"
        >
          <AnimatePresence>
            {messages.map((message, index) => {
              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                  transition={{
                    opacity: { duration: 0.1 },
                    layout: {
                      type: "spring",
                      bounce: 0.3,
                      duration: index * 0.05 + 0.2,
                    },
                  }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  className="ui-flex ui-flex-col"
                >
                  <ChatBubble
                    key={message.id}
                    variant={message.sender === "user" ? "sent" : "received"}
                  >
                    <ChatBubbleAvatar
                      src={
                        message.sender === "user"
                          ? "https://avatars.githubusercontent.com/u/114422072?s=400&u=8a176a310ca29c1578a70b1c33bdeea42bf000b4&v=4"
                          : ""
                      }
                      fallback={message.sender === "user" ? "US" : "🤖"}
                    />
                    <ChatBubbleMessage
                      variant={message.sender === "user" ? "sent" : "received"}
                    >
                      {message.content}
                    </ChatBubbleMessage>
                  </ChatBubble>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="ui-flex ui-relative ui-gap-2"
        >
          <ChatInput
            onKeyDown={onKeyDown}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button
            disabled={!inputMessage.trim()}
            type="submit"
            size="icon"
            className="ui-absolute ui-right-2 ui-top-1/2 -ui-translate-y-1/2 ui-shrink-0"
          >
            <Send className="ui-size-4" />
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
