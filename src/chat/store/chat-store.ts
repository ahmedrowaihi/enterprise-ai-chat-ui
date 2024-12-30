import { create } from "zustand";
import { ChatAdapter, ChatCapabilities, Message } from "../types";

interface ChatState {
  messages: Message[];
  userInput: string;
  files: File[];
  isResponding: boolean;
  error: string | null;
  adapter: ChatAdapter;

  getCapabilities: () => ChatCapabilities;
}

interface ChatActions {
  setUserInput: (input: string) => void;
  setFiles: (files: File[]) => void;
  setResponding: (isResponding: boolean) => void;
  addMessage: (content: string, isBot: boolean) => Message;
  setError: (error: string | null) => void;
  setAdapter: (adapter: ChatAdapter) => void;
}

export type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  userInput: "",
  files: [],
  isResponding: false,
  error: null,
  adapter: undefined!,
  getCapabilities: () => get().adapter?.getCapabilities(),

  setUserInput: (input) => set({ userInput: input }),
  setFiles: (files) => set({ files }),
  setResponding: (isResponding) => set({ isResponding }),
  setError: (error) => set({ error }),
  setAdapter: (adapter) => set({ adapter }),

  addMessage: (content, isBot) => {
    const newMessage = {
      id: crypto.randomUUID(),
      content,
      isBot,
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    return newMessage;
  },
}));
