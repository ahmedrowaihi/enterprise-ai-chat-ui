import { NodeType, WorkflowRunningStatus } from "../mocks/handlers/events";

export interface NodeTracing {
  id: string;
  node_id: string;
  node_name: string;
  status: WorkflowRunningStatus;
  node_type: NodeType;
}

export interface WorkflowProcess {
  status: WorkflowRunningStatus;
  tracing: NodeTracing[];
  expand?: boolean;
}

export interface ChatItem {
  id: string;
  content: string;
  isAnswer: boolean;
  workflow_run_id?: string;
  workflowProcess?: WorkflowProcess;
}
