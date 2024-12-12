import { produce } from "immer";
import { create } from "zustand";
import { ChatItem, WorkflowProcess } from "../types";
interface ChatState {
  messages: ChatItem[];
  isResponding: boolean;
  currentMessage: string;
  error: string | null;
  addMessage: (
    content: string,
    isAnswer: boolean,
    workflowProcess?: WorkflowProcess
  ) => void;
  updateLastMessage: (
    updater: (message: ChatItem) => Partial<ChatItem>
  ) => void;
  setResponding: (isResponding: boolean) => void;
  setCurrentMessage: (message: string) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isResponding: false,
  currentMessage: "",
  error: null,

  addMessage: (content, isAnswer, workflowProcess) =>
    set((state) =>
      produce(state, (draft) => {
        draft.messages.push({
          id: `message-${Date.now()}`,
          content,
          isAnswer,
          workflowProcess,
        });
      })
    ),

  updateLastMessage: (updater) =>
    set((state) =>
      produce(state, (draft) => {
        const lastMessage = draft.messages[draft.messages.length - 1];
        if (lastMessage && lastMessage.isAnswer) {
          draft.messages[draft.messages.length - 1] = {
            ...lastMessage,
            ...updater(lastMessage),
          };
        }
      })
    ),

  setResponding: (isResponding) => set({ isResponding }),
  setCurrentMessage: (message) => set({ currentMessage: message }),
  setError: (error) => set({ error, isResponding: false }),
}));
