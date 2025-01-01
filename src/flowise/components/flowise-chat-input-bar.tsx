import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { SendHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo } from "react";
import { AudioListBar } from "./audio-recorder/audio-list-bar";
import { AudioRecorder } from "./audio-recorder/audio-recorder";
import { FileListBar, FileUploadButton } from "./file-manager";

interface FlowiseChatInputBarProps {
  onSend: () => void;
}

export function FlowiseChatInputBar({ onSend }: FlowiseChatInputBarProps) {
  const userInput = useFlowiseChatStore((state) => state.userInput);
  const isResponding = useFlowiseChatStore((state) => state.isResponding);
  const setUserInput = useFlowiseChatStore((state) => state.setUserInput);
  const getCapabilities = useFlowiseChatStore((state) => state.getCapabilities);
  const capabilities = useMemo(() => getCapabilities(), [getCapabilities]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setUserInput(userInput + "\n");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
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
            {capabilities?.fileUpload && <FileListBar />}
            {capabilities?.speechToText && <AudioListBar />}
            <ChatInput
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={
                isResponding ? "Waiting for response..." : "Type a message..."
              }
              disabled={isResponding}
            />
            <div className="ui-absolute ui-right-2 ui-bottom-1.5 ui-flex ui-gap-1">
              {capabilities?.fileUpload && <FileUploadButton />}
              {capabilities?.speechToText && <AudioRecorder />}
              <Button
                className="ui-h-8 ui-w-8 ui-shrink-0"
                onClick={onSend}
                disabled={isResponding || !userInput.trim()}
                variant="ghost"
                size="icon"
                type="button"
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
