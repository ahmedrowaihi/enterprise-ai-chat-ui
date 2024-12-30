export interface FlowiseClientConfig {
  baseUrl: string;
  apiKey: string;
}

export interface ChatflowCapabilities {
  isStreaming: boolean;
  isSpeechToTextEnabled: boolean;
  isImageUploadAllowed: boolean;
  isRAGFileUploadAllowed: boolean;
  imgUploadSizeAndTypes: Array<{
    fileTypes: string[];
    maxUploadSize: number;
  }>;
  fileUploadSizeAndTypes: Array<{
    fileTypes: string[];
    maxUploadSize: number;
  }>;
}

export class FlowiseClient {
  constructor(private config: FlowiseClientConfig) {}

  private async request(path: string) {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1${path}`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const error = await response.json();
          throw new Error(
            error.message || `API request failed: ${response.statusText}`
          );
        }
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error(`Expected JSON response but got ${contentType}`);
      }

      return response.json();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("API request failed:", {
          path,
          error,
          config: this.config,
        });
      }
      throw error;
    }
  }

  async getChatflowCapabilities(id: string): Promise<ChatflowCapabilities> {
    try {
      const [streamingResponse, uploadsResponse] = await Promise.all([
        this.request(`/chatflows-streaming/${id}`),
        this.request(`/chatflows-uploads/${id}`),
      ]);

      return {
        isStreaming: streamingResponse?.isStreaming ?? false,
        ...uploadsResponse,
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Failed to get capabilities, using defaults:", error);
      }
      return {
        isStreaming: true,
        isSpeechToTextEnabled: false,
        isImageUploadAllowed: false,
        isRAGFileUploadAllowed: false,
        imgUploadSizeAndTypes: [],
        fileUploadSizeAndTypes: [],
      };
    }
  }

  async getChatflow(id: string) {
    return this.request(`/chatflows/${id}`);
  }
}
