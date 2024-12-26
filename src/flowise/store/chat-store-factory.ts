import type { FlowiseChatState } from "@/flowise/store/chat-store-model";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const createFlowiseChatStore = () =>
  create<FlowiseChatState>()(
    immer((set) => ({
      messages: [],
      currentMessage: "",
      files: [],
      isResponding: false,
      setCurrentMessage: (message) =>
        set((state) => {
          state.currentMessage = message;
        }),
      setFiles: (files) =>
        set((state) => {
          state.files = files;
        }),
      setResponding: (isResponding) =>
        set((state) => {
          state.isResponding = isResponding;
        }),
      addMessage: (content, isAnswer) =>
        set((state) => {
          state.messages.push({
            id: nanoid(),
            content,
            isAnswer,
          });
        }),
      updateLastMessage: (updater) =>
        set((state) => {
          const lastMessage = state.messages[state.messages.length - 1];
          if (lastMessage) {
            Object.assign(lastMessage, updater(lastMessage));
          }
        }),
      setError: (error) =>
        set((state) => {
          const lastMessage = state.messages[state.messages.length - 1];
          if (lastMessage && lastMessage.isAnswer) {
            lastMessage.content = `Error: ${error}`;
            state.isResponding = false;
          }
        }),
    }))
  );
