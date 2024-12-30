import {
  ChatAdapter,
  ChatCapabilities,
  ChatConfig,
  ChatHandlers,
} from "@/chat/types";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export class PlaygroundConfig implements ChatConfig {
  constructor(private endpoint: string) {}

  getAuthHeaders(): Record<string, string> {
    return { "Content-Type": "application/json" };
  }

  getEndpoint(): string {
    return this.endpoint;
  }
}

export class PlaygroundAdapter implements ChatAdapter {
  private isInitialized = false;
  private readyCallbacks: (() => void)[] = [];

  constructor(private config: PlaygroundConfig) {}

  onReady(callback: () => void): void {
    if (this.isInitialized) {
      callback();
    } else {
      this.readyCallbacks.push(callback);
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Playground adapter is always ready immediately
    this.isInitialized = true;
    this.readyCallbacks.forEach((callback) => callback());
  }

  getConfig(): ChatConfig {
    return this.config;
  }

  getCapabilities(): ChatCapabilities {
    return {
      streaming: true,
      fileUpload: false,
      multiModal: false,
      markdown: true,
      codeHighlight: true,
      latex: false,
      speechToText: false,
      imageUpload: false,
      ragFileUpload: false,
      imageUploadConfig: [],
      fileUploadConfig: [],
    };
  }

  async sendMessage(
    message: string,
    files: File[] = [],
    handlers?: ChatHandlers
  ): Promise<void> {
    if (!this.isInitialized) {
      throw new Error("Adapter not initialized. Call initialize() first");
    }

    try {
      await fetchEventSource(this.config.getEndpoint(), {
        method: "POST",
        openWhenHidden: true,
        headers: this.config.getAuthHeaders(),
        body: JSON.stringify({ query: message }),
        async onopen(response) {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          await handlers?.onStreamStart?.(response);
        },
        onmessage(event) {
          handlers?.onStreamMessage?.(event);
        },
        onerror(err) {
          const error = err instanceof Error ? err : new Error(String(err));
          handlers?.onStreamError?.(error);
          throw error;
        },
        onclose() {
          handlers?.onStreamEnd?.("");
        },
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      handlers?.onStreamError?.(err);
      throw err;
    }
  }
}
