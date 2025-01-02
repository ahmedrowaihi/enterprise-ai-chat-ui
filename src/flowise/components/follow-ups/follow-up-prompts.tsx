import { Button } from "@/components/ui/button";
import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { Sparkles } from "lucide-react";
import { memo, useMemo } from "react";

interface FollowUpPromptsProps {
  onSend: (message?: string) => void;
}

export const FollowUpPrompts = memo(function FollowUpPrompts({
  onSend,
}: FollowUpPromptsProps) {
  const messages = useFlowiseChatStore((state) => state.messages);
  const isResponding = useFlowiseChatStore((state) => state.isResponding);

  const followUpPrompts = useMemo(() => {
    const lastMessage = messages[messages.length - 1];
    const prompts = lastMessage?.extra?.metadata?.followUpPrompts;
    if (!prompts) return [];

    try {
      if (typeof prompts === "string") {
        return JSON.parse(prompts);
      }
      return Array.isArray(prompts) ? prompts : [];
    } catch (error) {
      console.error("Failed to parse follow-up prompts:", error);
      return [];
    }
  }, [messages]);

  if (
    !Array.isArray(followUpPrompts) ||
    followUpPrompts.length === 0 ||
    isResponding
  )
    return null;

  const validPrompts = followUpPrompts
    .filter(
      (prompt): prompt is string =>
        typeof prompt === "string" && prompt.length > 0
    )
    .slice(0, 3);

  if (validPrompts.length === 0) return null;

  return (
    <div className="ui-flex ui-flex-col ui-gap-2">
      <div className="ui-flex ui-items-center ui-gap-1 ui-text-xs ui-text-muted-foreground">
        <Sparkles className="ui-size-3" />
        <span>Try these follow-up questions</span>
      </div>
      <div className="ui-flex ui-flex-wrap ui-gap-2">
        {validPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="ui-text-xs ui-h-auto ui-py-1.5"
            onClick={() => onSend(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
});
