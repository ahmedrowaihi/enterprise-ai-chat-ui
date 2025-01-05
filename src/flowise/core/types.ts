export interface ChatflowType {
  id: string;
  name: string;
  flowData: string;
  deployed: boolean;
  isPublic: boolean;
  apikeyid: string;
  chatbotConfig: any;
  apiConfig: any;
  analytic: any;
  speechToText: any;
  followUpPrompts: any;
  category: any;
  type: string;
  createdDate: string;
  updatedDate: string;
}

export class FlowiseError extends Error {
  constructor(
    message: string,
    public readonly response?: Response,
    public readonly isStreaming?: boolean
  ) {
    super(message);
    this.name = "FlowiseError";
  }
}

export interface LeadConfig {
  status: boolean;
  title: string;
  successMessage: string;
  name: boolean;
  email: boolean;
  phone: boolean;
}

export interface Lead {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChatflowConfig {
  followUpPrompts?: {
    status: boolean;
  };
  allowedOrigins?: string[];
  allowedOriginsError?: string;
  chatFeedback?: {
    status: boolean;
  };
  starterPrompts?: Record<string, { prompt: string }>;
  leads?: LeadConfig;
}
