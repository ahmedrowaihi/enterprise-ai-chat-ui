import { createChatStore } from "@/chat/store/chat-store";
import { FlowiseExtra } from "@/flowise/types";
import { FlowiseChatAdapter } from "../core/flowise-adapter";

export const useFlowiseChatStore = createChatStore<
  FlowiseExtra,
  FlowiseChatAdapter
>();
