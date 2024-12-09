import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Message } from "@/examples/data";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useUser } from "../hooks/useUser";
import { AnswerBubble } from "./bubbles/answer-bubble";
import { QuestionBubble } from "./bubbles/question-bubble";

interface ChatListProps {
  messages: Message[];
}

const getMessageVariant = (messageName: string, selectedUserName: string) =>
  messageName === selectedUserName ? "sent" : "received";

export function ChatList({ messages }: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const selectedUser = useUser();
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ChatMessageList ref={messagesContainerRef}>
      <AnimatePresence>
        {messages.map((message, index) => {
          const variant = getMessageVariant(message.name, selectedUser.name);
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
              {variant === "received" ? (
                <AnswerBubble message={message} />
              ) : (
                <QuestionBubble message={message} />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </ChatMessageList>
  );
}
