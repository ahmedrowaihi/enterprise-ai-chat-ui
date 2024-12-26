import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import {
  FileListBar,
  FileUploadButton,
} from "@/flowise/components/file-upload";
import { useChatSelector } from "@/flowise/store/store-provider";
import { SendHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

interface FlowiseChatInputBarProps {
  onSend: () => void;
}

export function FlowiseChatInputBar({ onSend }: FlowiseChatInputBarProps) {
  const message = useChatSelector("currentMessage");
  const isResponding = useChatSelector("isResponding");
  const setCurrentMessage = useChatSelector("setCurrentMessage");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setCurrentMessage(message + "\n");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(event.target.value);
  };

  return (
    <div className="ui-border-t ui-p-4">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="ui-flex ui-items-center ui-gap-2"
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
          <div className="ui-relative ui-flex-1">
            <FileListBar />
            <ChatInput
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              disabled={isResponding}
            />
            <div className="ui-absolute ui-right-2 ui-bottom-1.5 ui-flex ui-gap-1">
              <FileUploadButton />
              <Button
                className="ui-h-8 ui-w-8 ui-shrink-0"
                onClick={onSend}
                disabled={isResponding || !message.trim()}
                variant="ghost"
                size="icon"
              >
                <SendHorizontal
                  size={20}
                  className="ui-text-muted-foreground"
                />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
