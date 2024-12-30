export interface Message {
  id: string;
  content: string;
  isBot: boolean;
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
