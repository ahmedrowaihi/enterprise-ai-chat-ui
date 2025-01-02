export interface AgentReasoning {
  agentName?: string;
  messages?: string[];
  nodeName?: string;
  nodeId?: string;
  usedTools?: any[];
  sourceDocuments?: any[];
  artifacts?: any[];
  state?: Record<string, any>;
}

export interface FlowiseExtra {
  agentReasonings?: AgentReasoning[];
  metadata?: {
    followUpPrompts?: string[];
    [key: string]: any;
  };
}
