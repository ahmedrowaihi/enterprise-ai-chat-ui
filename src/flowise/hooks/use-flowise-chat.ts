import { useChat } from "@/chat/hooks/use-chat";
import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { FlowiseChatAdapter } from "@/flowise/core/flowise-adapter";
import { FlowiseConfig } from "@/flowise/core/flowise-config-builder";
import { useEffect, useState } from "react";

export function useFlowiseChat(config: FlowiseConfig) {
  const [isReady, setIsReady] = useState(false);
  const { adapter, setAdapter } = useFlowiseChatStore();

  useEffect(() => {
    if (!adapter || !(adapter instanceof FlowiseChatAdapter)) {
      const newAdapter = new FlowiseChatAdapter(config);
      newAdapter.onReady(() => {
        setIsReady(true);
        setAdapter(newAdapter);
      });
      newAdapter.initialize();
    }
  }, [adapter, config, setAdapter]);

  const chat = useChat(adapter!);

  return { ...chat, isReady };
}
