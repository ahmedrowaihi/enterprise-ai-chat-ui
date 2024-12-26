export interface Message {
  id: string;
  content: string;
  isAnswer: boolean;
}

export interface FlowiseChatState {
  messages: Message[];
  currentMessage: string;
  files: File[];
  isResponding: boolean;
  setCurrentMessage: (message: string) => void;
  setFiles: (files: File[]) => void;
  setResponding: (isResponding: boolean) => void;
  addMessage: (content: string, isAnswer: boolean) => void;
  updateLastMessage: (updater: (message: Message) => Partial<Message>) => void;
  setError: (error: string) => void;
}
