"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Layout } from "@/examples/layout";
import { useChatStore } from "@/hooks/use-chat-store";
import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Volume2,
} from "lucide-react";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ChatAiIcons = [
  {
    icon: CopyIcon,
    label: "Copy",
  },
  {
    icon: RefreshCcw,
    label: "Refresh",
  },
  {
    icon: Volume2,
    label: "Volume",
  },
];

export function Chatbot() {
  const messages = useChatStore((state) => state.chatBotMessages);
  const setMessages = useChatStore((state) => state.setchatBotMessages);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const input = useChatStore((state) => state.input);
  const setInput = useChatStore((state) => state.setInput);
  const handleInputChange = useChatStore((state) => state.handleInputChange);
  const hasInitialAIResponse = useChatStore(
    (state) => state.hasInitialAIResponse
  );
  const setHasInitialAIResponse = useChatStore(
    (state) => state.setHasInitialAIResponse
  );
  const [isLoading, setIsLoading] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const getMessageVariant = (role: string) =>
    role === "ai" ? "received" : "sent";
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    setMessages((messages) => [
      ...messages,
      {
        id: messages.length + 1,
        avatar: selectedUser.avatar,
        name: selectedUser.name,
        role: "user",
        message: input,
      },
    ]);

    setInput("");
    formRef.current?.reset();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Simulate AI response
    if (!hasInitialAIResponse) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages((messages) => [
          ...messages.slice(0, messages.length - 1),
          {
            id: messages.length + 1,
            avatar: "",
            name: "ChatBot",
            role: "ai",
            message: "Sure! If you have any more questions, feel free to ask.",
          },
        ]);
        setIsLoading(false);
        setHasInitialAIResponse(true);
      }, 2500);
    }
  }, []);

  return (
    <Layout>
      <div className="ui-h-full ui-w-full">
        <div className="ui-relative ui-flex ui-h-full ui-flex-col ui-rounded-xl ui-bg-muted/20 dark:ui-bg-muted/40 ui-p-4 lg:ui-col-span-2">
          <ChatMessageList ref={messagesContainerRef}>
            {/* Chat messages */}
            <AnimatePresence>
              {messages.map((message, index) => {
                const variant = getMessageVariant(message.role!);
                return (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
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
                    className="ui-flex ui-flex-col ui-gap-2 ui-p-4"
                  >
                    <ChatBubble key={index} variant={variant}>
                      <Avatar>
                        <AvatarImage
                          src={message.role === "ai" ? "" : message.avatar}
                          alt="Avatar"
                          className={
                            message.role === "ai" ? "dark:ui-invert" : ""
                          }
                        />
                        <AvatarFallback>
                          {message.role === "ai" ? "🤖" : "GG"}
                        </AvatarFallback>
                      </Avatar>
                      <ChatBubbleMessage isLoading={message.isLoading}>
                        {message.message}
                        {message.role === "ai" && (
                          <div className="ui-flex ui-items-center ui-mt-1.5 ui-gap-1">
                            {!message.isLoading && (
                              <>
                                {ChatAiIcons.map((icon, index) => {
                                  const Icon = icon.icon;
                                  return (
                                    <ChatBubbleAction
                                      variant="outline"
                                      className="ui-size-6"
                                      key={index}
                                      icon={<Icon className="ui-size-3" />}
                                      onClick={() =>
                                        console.log(
                                          "Action " +
                                            icon.label +
                                            " clicked for message " +
                                            index
                                        )
                                      }
                                    />
                                  );
                                })}
                              </>
                            )}
                          </div>
                        )}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </ChatMessageList>
          <div className="ui-flex-1" />
          <form
            ref={formRef}
            onSubmit={handleSendMessage}
            className="ui-relative ui-rounded-lg ui-border ui-bg-background focus-within:ui-ring-1 focus-within:ui-ring-ring"
          >
            <ChatInput
              ref={inputRef}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
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

              <Button
                disabled={!input || isLoading}
                type="submit"
                size="sm"
                className="ui-ml-auto ui-gap-1.5"
              >
                Send Message
                <CornerDownLeft className="ui-size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
