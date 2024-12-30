import { ChatConfig } from "@/chat/types";

export interface FlowiseConfig extends ChatConfig {
  apiKey: string;
  baseUrl: string;
  chatflowId: string;
}

export class FlowiseConfigBuilder {
  private config: Partial<FlowiseConfig> = {
    getAuthHeaders: () => ({}),
    getEndpoint: () => "",
  };

  withApiKey(apiKey: string): FlowiseConfigBuilder {
    this.config.apiKey = apiKey;
    this.config.getAuthHeaders = () => ({
      Authorization: `Bearer ${apiKey}`,
    });
    return this;
  }

  withBaseUrl(baseUrl: string): FlowiseConfigBuilder {
    this.config.baseUrl = baseUrl;
    return this;
  }

  withChatflowId(chatflowId: string): FlowiseConfigBuilder {
    this.config.chatflowId = chatflowId;
    this.config.getEndpoint = () =>
      `${this.config.baseUrl}/api/v1/prediction/${chatflowId}`;
    return this;
  }

  build(): FlowiseConfig {
    if (
      !this.config.apiKey ||
      !this.config.baseUrl ||
      !this.config.chatflowId
    ) {
      throw new Error("Missing required configuration parameters");
    }
    return this.config as FlowiseConfig;
  }
}
