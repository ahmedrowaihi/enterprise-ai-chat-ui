export enum WorkflowRunningStatus {
  Running = "running",
  Succeeded = "succeeded",
  Failed = "failed",
  Stopped = "stopped",
}

export enum NodeType {
  LLM = "llm",
  KnowledgeBase = "knowledge_base",
  ResponseGeneration = "response_generation",
  Agent = "agent",
  Tool = "tool",
  Workflow = "workflow",
}

export const WORKFLOW_ID = "test-workflow-id";
export const TASK_ID = "test-task-id";

export interface StreamEventHandlers {
  onWorkflowStarted: (data: any) => void;
  onMessage: (data: any) => void;
  onWorkflowFinished: (data: any) => void;
  onNodeStarted: (data: any) => void;
  onNodeFinished: (data: any) => void;
}
