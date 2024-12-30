import type { ChatHandlers } from "./common";
import type { Message, UploadConfig } from "./models";

export interface ChatConfig {
  getAuthHeaders(): HeadersInit;
  getEndpoint(): string;
}

export interface ChatAdapter {
  sendMessage(
    message: string,
    files?: File[],
    handlers?: ChatHandlers
  ): Promise<void>;
  getConfig(): ChatConfig;
  getCapabilities(): ChatCapabilities;
  initialize(): Promise<void>;
  onReady(callback: () => void): void;
}

export interface ChatCapabilities {
  streaming: boolean;
  fileUpload: boolean;
  multiModal: boolean;
  markdown: boolean;
  codeHighlight: boolean;
  latex: boolean;

  // Detailed upload capabilities
  speechToText: boolean;
  imageUpload: boolean;
  ragFileUpload: boolean;
  imageUploadConfig: UploadConfig[];
  fileUploadConfig: UploadConfig[];
}

export interface ChatUIComponents {
  ChatInput: React.ComponentType<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    disabled?: boolean;
  }>;
  MessageList: React.ComponentType<{
    messages: Message[];
  }>;
  FileUpload?: React.ComponentType<{
    onFileSelect: (files: File[]) => void;
    disabled?: boolean;
  }>;
}
