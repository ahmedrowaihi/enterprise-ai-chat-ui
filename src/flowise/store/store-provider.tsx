import { createFlowiseChatStore } from "@/flowise/store/chat-store-factory";
import type { FlowiseChatState } from "@/flowise/store/chat-store-model";
import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import type { StoreApi } from "zustand";
import { useStore } from "zustand";

const StoreContext = createContext<StoreApi<FlowiseChatState> | null>(null);

export function FlowiseChatProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<StoreApi<FlowiseChatState>>();
  if (!storeRef.current) {
    storeRef.current = createFlowiseChatStore();
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

function useFlowiseStore<T>(selector: (state: FlowiseChatState) => T): T {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("Missing FlowiseChatProvider");
  }
  return useStore(store, selector);
}

export function useFlowiseSelector<K extends keyof FlowiseChatState>(
  key: K
): FlowiseChatState[K] {
  return useFlowiseStore((state) => state[key]);
}
