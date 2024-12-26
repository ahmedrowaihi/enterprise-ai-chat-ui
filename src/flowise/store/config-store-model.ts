export interface FlowiseConfig {
  apiKey: string;
  baseUrl: string;
  chatflowId: string;
}

export interface FlowiseConfigState {
  config: FlowiseConfig;
  setConfig: (config: FlowiseConfig) => void;
}
