import { Button } from "@/components/ui/button";
import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { Sparkles } from "lucide-react";
import { memo, useMemo } from "react";

interface StarterPromptsProps {
  onSend: (message?: string) => void;
}

export const StarterPrompts = memo(function StarterPrompts({
  onSend,
}: StarterPromptsProps) {
  const messages = useFlowiseChatStore((state) => state.messages);
  const isResponding = useFlowiseChatStore((state) => state.isResponding);
  const adapter = useFlowiseChatStore((state) => state.adapter);

  const starterPrompts = useMemo(() => {
    if (messages.length > 0 || !adapter) return [];

    const chatflow = adapter.getChatflow();
    if (!chatflow?.chatbotConfig) return [];

    try {
      const configObj = JSON.parse(chatflow.chatbotConfig);
      if (!configObj.starterPrompts) return [];

      const prompts = Object.values(configObj.starterPrompts).map(
        (p: any) => p.prompt
      );
      return prompts.filter(
        (p): p is string => typeof p === "string" && p.length > 0
      );
    } catch (error) {
      console.error("Failed to parse starter prompts:", error);
      return [];
    }
  }, [messages.length, adapter]);

  if (starterPrompts.length === 0 || isResponding) return null;

  return (
    <div className="ui-flex ui-flex-col ui-gap-2">
      <div className="ui-flex ui-items-center ui-gap-1 ui-text-xs ui-text-muted-foreground">
        <Sparkles className="ui-size-3" />
        <span>Get started with these prompts</span>
      </div>
      <div className="ui-flex ui-flex-wrap ui-gap-2">
        {starterPrompts.map((prompt, index) => (
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
