import {
  ChatAdapter,
  ChatCapabilities,
  ChatHandlers,
  UploadConfig,
} from "@/chat/types";
import {
  ChatflowCapabilities,
  FlowiseClient,
} from "@/flowise/core/flowise-client";
import { FlowiseConfig } from "@/flowise/core/flowise-config-builder";
import { ChatflowType, FlowiseError } from "@/flowise/core/types";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export class FlowiseChatAdapter implements ChatAdapter {
  private initPromise?: Promise<void>;
  private client: FlowiseClient;
  private flowiseCapabilities?: ChatflowCapabilities;
  private chatflow?: ChatflowType;
  private readyCallbacks: (() => void)[] = [];
  private isInitialized = false;
  constructor(private config: FlowiseConfig) {
    this.client = new FlowiseClient({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
    });
  }

  onReady(callback: () => void): void {
    this.readyCallbacks.push(callback);
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        // Get chatflow and its capabilities
        const [chatflow, capabilities] = await Promise.all([
          this.client.getChatflow(this.config.chatflowId),
          this.client.getChatflowCapabilities(this.config.chatflowId),
        ]);

        this.chatflow = chatflow;
        this.flowiseCapabilities = capabilities;

        this.isInitialized = true;
        this.readyCallbacks.forEach((callback) => callback());
      } catch (error) {
        console.error("Failed to initialize adapter:", error);
        throw error;
      }
    })();

    return this.initPromise;
  }

  getConfig(): FlowiseConfig {
    return this.config;
  }

  getCapabilities(): ChatCapabilities {
    // Default capabilities if not initialized
    if (!this.flowiseCapabilities) {
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

    // Map Flowise capabilities to standard ones
    return {
      streaming: this.flowiseCapabilities.isStreaming,
      fileUpload:
        this.flowiseCapabilities.isImageUploadAllowed ||
        this.flowiseCapabilities.isRAGFileUploadAllowed,
      multiModal: this.flowiseCapabilities.isImageUploadAllowed,
      markdown: true, // Flowise always supports markdown
      codeHighlight: true, // Flowise always supports code highlighting
      latex: false, // Flowise doesn't support LaTeX by default

      // Detailed upload capabilities
      speechToText: this.flowiseCapabilities.isSpeechToTextEnabled,
      imageUpload: this.flowiseCapabilities.isImageUploadAllowed,
      ragFileUpload: this.flowiseCapabilities.isRAGFileUploadAllowed,
      imageUploadConfig: this.flowiseCapabilities.imgUploadSizeAndTypes,
      fileUploadConfig: this.flowiseCapabilities.fileUploadSizeAndTypes,
    };
  }

  private async handleSSEStreaming(
    data: any,
    handlers?: ChatHandlers
  ): Promise<void> {
    try {
      await fetchEventSource(this.config.getEndpoint(), {
        method: "POST",
        openWhenHidden: true,
        headers: {
          ...(this.config.getAuthHeaders() as Record<string, string>),
          "Content-Type": "application/json",
        } as Record<string, string>,
        body: JSON.stringify(data),
        async onopen(response) {
          if (!response.ok) {
            throw new FlowiseError(
              `Failed to start streaming: ${response.statusText}`,
              response,
              true
            );
          }
          await handlers?.onStreamStart?.(response);
        },
        onmessage(msg) {
          handlers?.onStreamMessage?.(JSON.parse(msg.data));
        },
        onclose() {
          handlers?.onStreamEnd?.();
        },
        onerror(err) {
          const error = new FlowiseError(
            err instanceof Error ? err.message : String(err),
            undefined,
            true
          );
          handlers?.onStreamError?.(error);
          throw error;
        },
      });
    } catch (err) {
      const error =
        err instanceof FlowiseError
          ? err
          : new FlowiseError(
              err instanceof Error ? err.message : String(err),
              undefined,
              true
            );
      handlers?.onStreamError?.(error);
      throw error;
    }
  }

  private async handleNonStreaming(
    data: any,
    handlers?: ChatHandlers
  ): Promise<void> {
    handlers?.onStart?.();
    const response = await fetch(this.config.getEndpoint(), {
      method: "POST",
      headers: {
        ...(this.config.getAuthHeaders() as Record<string, string>),
        "Content-Type": "application/json",
      } as Record<string, string>,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new FlowiseError(
        `Failed to send message: ${response.statusText}`,
        response,
        false
      );
    }

    try {
      const contentType = response.headers.get("Content-Type");
      if (!contentType?.includes("application/json")) {
        throw new FlowiseError(
          "Invalid response type. Expected JSON.",
          response,
          false
        );
      }

      const rawContent = await response.json();
      handlers?.onResponse?.(rawContent);
    } catch (err) {
      const error =
        err instanceof FlowiseError
          ? err
          : new FlowiseError(
              err instanceof Error ? err.message : String(err),
              response,
              false
            );
      handlers?.onError?.(error);
      throw error;
    }
  }

  async sendMessage(
    message: string,
    files: File[] = [],
    handlers?: ChatHandlers
  ): Promise<void> {
    if (!this.initPromise) {
      throw new FlowiseError(
        "Adapter not initialized. Call initialize() first"
      );
    }
    await this.initPromise;

    if (!this.isInitialized) {
      throw new FlowiseError("Adapter initialization failed");
    }
    const capabilities = this.getCapabilities();

    let messageHandler = this.handleNonStreaming;
    try {
      const isStreamingEnabled = capabilities.streaming;

      // Prepare request data
      const requestData: any = {
        question: message,
      };

      // Handle file uploads based on type
      if (files.length > 0) {
        const imageFiles = files.filter((file) =>
          file.type.startsWith("image/")
        );
        const otherFiles = files.filter(
          (file) => !file.type.startsWith("image/")
        );

        const allUploads = [];

        // Handle image uploads
        if (capabilities.imageUpload && imageFiles.length > 0) {
          const uploads = await Promise.all(
            imageFiles.map(async (file) => {
              // Validate against image upload config
              const config = capabilities.imageUploadConfig[0];
              if (config && this.validateFile(file, config)) {
                const base64 = await this.fileToBase64(file);
                return {
                  data: base64,
                  type: "file",
                  name: file.name,
                  mime: file.type,
                };
              }
              return null;
            })
          );

          allUploads.push(...uploads.filter(Boolean));
        }

        // Handle RAG file uploads
        if (capabilities.ragFileUpload && otherFiles.length > 0) {
          const uploads = await Promise.all(
            otherFiles.map(async (file) => {
              // Validate against file upload config
              const config = capabilities.fileUploadConfig[0];
              if (config && this.validateFile(file, config)) {
                const base64 = await this.fileToBase64(file);
                return {
                  data: base64,
                  type: "file",
                  name: file.name,
                  mime: file.type,
                };
              }
              return null;
            })
          );

          allUploads.push(...uploads.filter(Boolean));
        }

        // Add uploads to request data
        if (allUploads.length > 0) {
          requestData.uploads = allUploads;
        }
      }

      if (isStreamingEnabled) {
        requestData.streaming = true;
        messageHandler = this.handleSSEStreaming;
      }

      await messageHandler.call(this, requestData, handlers);
    } catch (err) {
      const error =
        err instanceof FlowiseError
          ? err
          : new FlowiseError(err instanceof Error ? err.message : String(err));

      if (error.isStreaming) {
        handlers?.onStreamError?.(error);
      } else {
        handlers?.onError?.(error);
      }
      throw error;
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  private validateFile(file: File, config: UploadConfig): boolean {
    if (!config.fileTypes.includes(file.type)) {
      throw new FlowiseError(`File type ${file.type} not supported`);
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > config.maxUploadSize) {
      throw new FlowiseError(
        `File size ${fileSizeMB.toFixed(1)}MB exceeds limit of ${
          config.maxUploadSize
        }MB`
      );
    }

    return true;
  }

  getChatflow() {
    return this.chatflow;
  }

  getAgentIcon = (nodeName?: string) => {
    if (nodeName) {
      return "".concat(this.config.baseUrl, "/api/v1/node-icon/", nodeName);
    }
  };
}
