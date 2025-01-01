import { Message } from "@/chat/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChatBubble,
  ChatBubbleActionWrapper,
  ChatBubbleMessage,
  ChatBubbleMessageProps,
} from "@/components/ui/chat/chat-bubble";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FlowiseExtra } from "@/flowise/types";
import { cn } from "@/lib/utils";
import JsonView from "@uiw/react-json-view";
import { memo, useMemo } from "react";
import { useFlowiseChatStore } from "../store/flowise-chat-store";
import { MemoizedReactMarkdown } from "./markdown/MemoizedReactMarkdown";
import { CopyAction, SpeakAction } from "./message-actions";

interface FlowiseMessageProps {
  message: Message<FlowiseExtra>;
  bubbleMessageProps?: ChatBubbleMessageProps;
}

export const FlowiseMessage = memo(function FlowiseMessage({
  message,
  bubbleMessageProps,
}: FlowiseMessageProps) {
  const adapter = useFlowiseChatStore((state) => state.adapter);

  const { usedTools, sourceDocuments, artifacts, state } = useMemo(() => {
    const initialValues = {
      usedTools: [] as any[],
      sourceDocuments: [] as any[],
      artifacts: [] as any[],
      state: {} as Record<string, any>,
    };

    return (
      message.extra?.agentReasonings?.reduce((acc, reasoning) => {
        if (reasoning.usedTools) {
          acc.usedTools.push(
            ...reasoning.usedTools.filter((tool) => tool !== null)
          );
        }
        if (reasoning.sourceDocuments) {
          acc.sourceDocuments.push(
            ...reasoning.sourceDocuments.filter((doc) => doc !== null)
          );
        }
        if (reasoning.artifacts) {
          acc.artifacts.push(
            ...reasoning.artifacts.filter((artifact) => artifact !== null)
          );
        }
        if (reasoning.state) {
          acc.state = { ...acc.state, ...reasoning.state };
        }
        return acc;
      }, initialValues) || initialValues
    );
  }, [message.extra]);

  return (
    <ChatBubble
      variant={message.isBot ? "received" : "sent"}
      className={cn(
        message.isBot ? "ui-text-start" : "ui-text-end",
        "ui-max-w-full sm:ui-max-w-[80%] ui-min-w-28"
      )}
    >
      <ChatBubbleMessage
        className={cn(
          "ui-flex ui-flex-col ui-gap-2 ui-w-full",
          bubbleMessageProps?.className
        )}
        {...bubbleMessageProps}
      >
        {message.extra?.agentReasonings?.map((reasoning, index) => (
          <Card key={index} className="ui-mt-2">
            <CardHeader className="ui-flex ui-flex-row ui-items-center ui-gap-2 ui-space-y-0 ui-pb-0">
              <img
                src={adapter.getAgentIcon(reasoning.nodeName)}
                alt="agent icon"
                className="ui-size-4"
              />
              <CardTitle className="ui-text-sm ui-flex-grow">
                {reasoning.agentName}
                {reasoning.nodeName && ` (${reasoning.nodeName})`}
              </CardTitle>
            </CardHeader>

            <CardContent className="ui-py-2 ui-space-y-2">
              {state && Object.keys(state).length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="ui-text-xs">
                      <div className="ui-font-medium">State</div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="ui-max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Agent State</DialogTitle>
                      <DialogDescription>
                        Current state of the agent execution
                      </DialogDescription>
                    </DialogHeader>
                    <div className="ui-bg-gray-50 ui-rounded-lg ui-p-4">
                      <JsonView
                        value={state}
                        style={{ background: "transparent" }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {reasoning.messages?.map((msg, i) => (
                <h4 key={i} className="ui-text-xs">
                  <MemoizedReactMarkdown>{msg}</MemoizedReactMarkdown>
                </h4>
              ))}
              {!!usedTools.length && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="ui-text-xs">
                      <div className="ui-font-medium">Used Tools</div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="ui-max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Used Tools</DialogTitle>
                      <DialogDescription>
                        Tools used during agent execution
                      </DialogDescription>
                    </DialogHeader>
                    <div className="ui-bg-gray-50 ui-rounded-lg ui-p-4">
                      <JsonView
                        value={usedTools}
                        style={{ background: "transparent" }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {!!sourceDocuments.length && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="ui-text-xs">
                      <div className="ui-font-medium">
                        View Source Documents
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="ui-max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Source Documents</DialogTitle>
                      <DialogDescription>
                        Documents referenced during execution
                      </DialogDescription>
                    </DialogHeader>
                    <div className="ui-bg-gray-50 ui-rounded-lg ui-p-4">
                      <JsonView
                        value={sourceDocuments}
                        style={{ background: "transparent" }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {!!artifacts.length && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="ui-text-xs ui-text-gray-500 hover:ui-text-gray-700">
                      <div className="ui-font-medium">View Artifacts</div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="ui-max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Artifacts</DialogTitle>
                      <DialogDescription>
                        Artifacts generated during execution
                      </DialogDescription>
                    </DialogHeader>
                    <div className="ui-bg-gray-50 ui-rounded-lg ui-p-4">
                      <JsonView
                        value={artifacts}
                        style={{ background: "transparent" }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}

        <span className="ui-text-sm ui-font-medium ui-w-full">
          <MemoizedReactMarkdown>{message.content}</MemoizedReactMarkdown>
        </span>
        {message.isBot && (
          <ChatBubbleActionWrapper className="ui-gap-1">
            <CopyAction message={message} />
            <SpeakAction message={message} />
          </ChatBubbleActionWrapper>
        )}
      </ChatBubbleMessage>
    </ChatBubble>
  );
});
