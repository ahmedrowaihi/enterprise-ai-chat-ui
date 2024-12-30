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
