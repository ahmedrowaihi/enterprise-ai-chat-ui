import { create } from "zustand";
import { ChatAdapter, ChatCapabilities, Message } from "../types";

interface ChatState<TExtra = void, TAdapter extends ChatAdapter = ChatAdapter> {
  messages: Message<TExtra>[];
  userInput: string;
  files: File[];
  isResponding: boolean;
  error: string | null;
  adapter: TAdapter;

  getCapabilities: () => ChatCapabilities;
}

interface ChatActions<
  TExtra = void,
  TAdapter extends ChatAdapter = ChatAdapter
> {
  setUserInput: (input: string) => void;
  setFiles: (files: File[]) => void;
  setResponding: (isResponding: boolean) => void;
  addMessage: (
    content: string,
    isBot: boolean,
    extra?: TExtra
  ) => Message<TExtra>;
  setError: (error: string | null) => void;
  setAdapter: (adapter: TAdapter) => void;
}

export type ChatStore<
  TExtra = void,
  TAdapter extends ChatAdapter = ChatAdapter
> = ChatState<TExtra, TAdapter> & ChatActions<TExtra, TAdapter>;

export const createChatStore = <
  TExtra = void,
  TAdapter extends ChatAdapter = ChatAdapter
>() =>
  create<ChatStore<TExtra, TAdapter>>((set, get) => ({
    messages: [],
    userInput: "",
    files: [],
    isResponding: false,
    error: null,
    adapter: undefined! as TAdapter,
    getCapabilities: () => get().adapter?.getCapabilities(),

    setUserInput: (input) => set({ userInput: input }),
    setFiles: (files) => set({ files }),
    setResponding: (isResponding) => set({ isResponding }),
    setError: (error) => set({ error }),
    setAdapter: (adapter) => set({ adapter }),

    addMessage: (content, isBot, extra) => {
      const newMessage = {
        id: crypto.randomUUID(),
        content,
        isBot,
        extra,
      };
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      return newMessage;
    },
  }));

export const useChatStore = createChatStore();
