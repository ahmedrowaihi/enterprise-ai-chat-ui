import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { actionIcons } from "@/examples/dify/chat/bubbles/shared-actions";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChatInputBar } from "./components/chat-input-bar";
import { WorkflowProcessItem } from "./components/workflow-process-item";
import { useChat } from "./hooks/use-chat";

export const endpoints = {
  basic: "/api/chat",
  sequential: "/api/chat-sequential",
  parallel: "/api/chat-parallel",
  memory: "/api/chat-memory",
};

export function Playground() {
  const [endpoint, setEndpoint] = useState(endpoints.basic);
  const { chatList, isResponding, message, setMessage, handleSend } = useChat();

  return (
    <div className="ui-flex ui-flex-col ui-justify-between ui-w-full ui-h-full">
      <SelectEndpoint endpoint={endpoint} setEndpoint={setEndpoint} />
      <ChatMessageList>
        {chatList.map((chat) => (
          <ChatBubble
            variant={chat.isAnswer ? "received" : "sent"}
            key={chat.id}
            className={cn(chat.isAnswer ? "ui-text-start" : "ui-text-end")}
          >
            <ChatBubbleMessage className="ui-flex ui-flex-col ui-gap-2 ui-min-w-28">
              {chat.workflowProcess && (
                <div className="-ui-m-2 ui-mb-1">
                  <WorkflowProcessItem
                    data={chat.workflowProcess}
                    expand={chat.workflowProcess.expand}
                  />
                </div>
              )}
              <span className="ui-text-sm ui-font-medium">{chat.content}</span>
            </ChatBubbleMessage>
            <ChatBubbleActionWrapper className="ui-opacity-0 group-hover:ui-opacity-100 ui-transition-opacity">
              {actionIcons.map(({ icon: Icon, type }) => (
                <ChatBubbleAction
                  key={type}
                  className="ui-size-6"
                  icon={<Icon className="ui-size-4" />}
                  onClick={() => console.log(`Action ${type} clicked`)}
                />
              ))}
            </ChatBubbleActionWrapper>
          </ChatBubble>
        ))}
      </ChatMessageList>
      <ChatInputBar
        message={message}
        isResponding={isResponding}
        onMessageChange={setMessage}
        onSend={() => handleSend(endpoint)}
      />
    </div>
  );
}

function SelectEndpoint({
  endpoint,
  setEndpoint,
}: {
  endpoint: string;
  setEndpoint: (endpoint: string) => void;
}) {
  return (
    <Select value={endpoint} onValueChange={(value) => setEndpoint(value)}>
      <SelectTrigger className="ui-w-max">
        <SelectValue placeholder="Select a workflow" />
      </SelectTrigger>
      <SelectContent className="ui-w-max">
        <SelectGroup>
          {Object.entries(endpoints).map(([key, value]) => (
            <SelectItem key={key} value={value}>
              {key}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
