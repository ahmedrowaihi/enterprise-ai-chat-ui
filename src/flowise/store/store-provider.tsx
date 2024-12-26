import { createFlowiseChatStore } from "@/flowise/store/chat-store-factory";
import type { FlowiseChatState } from "@/flowise/store/chat-store-model";
import { createFlowiseConfigStore } from "@/flowise/store/config-store-factory";
import type { FlowiseConfigState } from "@/flowise/store/config-store-model";
import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import type { StoreApi } from "zustand";
import { useStore } from "zustand";

const ChatStoreContext = createContext<StoreApi<FlowiseChatState> | null>(null);
const ConfigStoreContext = createContext<StoreApi<FlowiseConfigState> | null>(
  null
);

export function FlowiseChatProvider({ children }: { children: ReactNode }) {
  const chatStoreRef = useRef<StoreApi<FlowiseChatState>>();
  const configStoreRef = useRef<StoreApi<FlowiseConfigState>>();

  // create chat store if it doesn't exist
  if (!chatStoreRef.current) {
    chatStoreRef.current = createFlowiseChatStore();
  }
  // create config store if it doesn't exist
  if (!configStoreRef.current) {
    configStoreRef.current = createFlowiseConfigStore();
  }

  return (
    <ConfigStoreContext.Provider value={configStoreRef.current}>
      <ChatStoreContext.Provider value={chatStoreRef.current}>
        {children}
      </ChatStoreContext.Provider>
    </ConfigStoreContext.Provider>
  );
}

function useChatStore<T>(selector: (state: FlowiseChatState) => T): T {
  const store = useContext(ChatStoreContext);
  if (!store) {
    throw new Error("Missing FlowiseChatProvider");
  }
  return useStore(store, selector);
}

function useConfigStore<T>(selector: (state: FlowiseConfigState) => T): T {
  const store = useContext(ConfigStoreContext);
  if (!store) {
    throw new Error("Missing FlowiseChatProvider");
  }
  return useStore(store, selector);
}

export function useChatSelector<K extends keyof FlowiseChatState>(
  key: K
): FlowiseChatState[K] {
  return useChatStore((state) => state[key]);
}

export function useConfigSelector<K extends keyof FlowiseConfigState>(
  key: K
): FlowiseConfigState[K] {
  return useConfigStore((state) => state[key]);
}
