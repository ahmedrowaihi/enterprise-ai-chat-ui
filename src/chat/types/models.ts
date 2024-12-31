export interface Message<TExtra = void> {
  id: string;
  content: string;
  isBot: boolean;
  extra?: TExtra;
}

export interface UploadConfig {
  fileTypes: string[];
  maxUploadSize: number;
}

export interface NonStreamingResponse {
  text: string;
  chatId: string;
  chatMessageId: string;
  sessionId: string;
  memoryType: string;
  [key: string]: any;
}
