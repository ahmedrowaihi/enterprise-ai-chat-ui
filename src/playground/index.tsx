import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { actionIcons } from "@/examples/dify/chat/bubbles/shared-actions";
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

      <ScrollArea className="ui-flex-1 ui-p-4">
        <div className="ui-space-y-4">
          {chatList.map((chat) => (
            <ChatBubble
              variant={chat.isAnswer ? "received" : "sent"}
              key={chat.id}
              className="ui-w-full ui-max-w-full"
            >
              <ChatBubbleMessage className="ui-flex ui-flex-col ui-gap-2">
                {chat.workflowProcess && (
                  <div className="ui-mt-2">
                    <WorkflowProcessItem
                      data={chat.workflowProcess}
                      expand={chat.workflowProcess.expand}
                    />
                  </div>
                )}
                <span className="ui-text-sm ui-font-medium">
                  {chat.content}
                </span>
              </ChatBubbleMessage>
              <ChatBubbleActionWrapper className="ui-opacity-0 group-hover:ui-opacity-100 ui-transition-opacity">
                {actionIcons.map(({ icon: Icon, type }) => (
                  <ChatBubbleAction
                    key={type}
                    className="ui-size-7"
                    icon={<Icon className="ui-size-4" />}
                    onClick={() => console.log(`Action ${type} clicked`)}
                  />
                ))}
              </ChatBubbleActionWrapper>
            </ChatBubble>
          ))}
        </div>
      </ScrollArea>
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
