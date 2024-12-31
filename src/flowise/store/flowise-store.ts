import { Message } from "@/chat/types";
import type { FlowiseConfig } from "@/flowise/core/flowise-config-builder";
import { FlowiseConfigBuilder } from "@/flowise/core/flowise-config-builder";
import { FlowiseExtra } from "@/flowise/types";
import { create } from "zustand";

interface FlowiseState {
  config: FlowiseConfig;
  setConfig: (config: FlowiseConfig) => void;
  flowiseCurrentMessage: Message<FlowiseExtra> | undefined;
  setFlowiseCurrentMessage: (
    message:
      | Message<FlowiseExtra>
      | undefined
      | ((
          prev: Message<FlowiseExtra> | undefined
        ) => Message<FlowiseExtra> | undefined)
  ) => void;
}

export const useFlowiseStore = create<FlowiseState>((set) => ({
  config: new FlowiseConfigBuilder()
    .withApiKey(import.meta.env.VITE_FLOWISE_API_KEY || "")
    .withBaseUrl(import.meta.env.VITE_FLOWISE_BASE_URL || "")
    .withChatflowId(import.meta.env.VITE_FLOWISE_CHATFLOW_ID || "")
    .build(),
  setConfig: (config) => set({ config }),
  flowiseCurrentMessage: undefined,
  setFlowiseCurrentMessage: (message) =>
    set((state) => ({
      flowiseCurrentMessage:
        typeof message === "function"
          ? message(state.flowiseCurrentMessage)
          : message,
    })),
}));
