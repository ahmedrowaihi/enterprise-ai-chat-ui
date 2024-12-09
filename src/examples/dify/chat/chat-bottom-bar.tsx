import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Message, loggedInUserData } from "@/examples/data";
import { useChatStore } from "@/hooks/use-chat-store";
import { FileImage, Mic, Paperclip, SendHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export const BottomBarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottomBar() {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const setMessages = useChatStore((state) => state.setMessages);
  const hasInitialResponse = useChatStore((state) => state.hasInitialResponse);
  const setHasInitialResponse = useChatStore(
    (state) => state.setHasInitialResponse
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const sendMessage = (newMessage: Message) => {
    setMessages((messages) => [...messages, newMessage]);
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: message.length + 1,
        name: loggedInUserData.name,
        avatar: loggedInUserData.avatar,
        message: message.trim(),
      };
      sendMessage(newMessage);
      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (!hasInitialResponse) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages((messages) => [
          ...messages.slice(0, messages.length - 1),
          {
            id: messages.length + 1,
            avatar:
              "https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350",
            name: "Assistant AI",
            message: "Awesome! I am just chilling outside.",
            timestamp: formattedTime,
          },
        ]);
        setIsLoading(false);
        setHasInitialResponse(true);
      }, 2500);
    }
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="ui-px-2 ui-py-4 ui-flex ui-justify-between ui-w-full ui-items-center ui-gap-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="ui-max-w-full ui-w-full ui-relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <ChatInput
            value={message}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <div className="ui-absolute ui-right-4 ui-bottom-2">
            <Button
              className="ui-h-9 ui-w-9 ui-shrink-0"
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              variant="ghost"
              size="icon"
            >
              <Paperclip size={22} className="ui-text-muted-foreground" />
            </Button>
            <Button
              className="ui-h-9 ui-w-9 ui-shrink-0"
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              variant="ghost"
              size="icon"
            >
              <Mic size={22} className="ui-text-muted-foreground" />
            </Button>
            <Button
              className="ui-h-9 ui-w-9 ui-shrink-0"
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              variant="ghost"
              size="icon"
            >
              <SendHorizontal size={22} className="ui-text-muted-foreground" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
