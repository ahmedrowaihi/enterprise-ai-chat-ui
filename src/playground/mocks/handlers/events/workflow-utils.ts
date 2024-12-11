import { WorkflowRunningStatus, NodeType } from "./types";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const createEvent = (event: string, data: any) => {
  return `data: ${JSON.stringify({ event, ...data })}\n\n`;
};

export const createWorkflowEvents = {
  started: (workflowId: string, taskId: string) =>
    createEvent("workflow_started", {
      workflow_run_id: workflowId,
      task_id: taskId,
      data: {
        status: WorkflowRunningStatus.Running,
      },
    }),

  finished: (status: WorkflowRunningStatus = WorkflowRunningStatus.Succeeded) =>
    createEvent("workflow_finished", {
      data: {
        status,
      },
    }),
};

export const createNodeEvents = {
  started: (nodeConfig: {
    id: string;
    name: string;
    type: NodeType;
    status?: WorkflowRunningStatus;
  }) =>
    createEvent("node_started", {
      data: {
        id: nodeConfig.id,
        node_id: nodeConfig.id,
        node_name: nodeConfig.name,
        status: nodeConfig.status || WorkflowRunningStatus.Running,
        node_type: nodeConfig.type,
      },
    }),

  finished: (nodeConfig: {
    id: string;
    name: string;
    type: NodeType;
    status?: WorkflowRunningStatus;
  }) =>
    createEvent("node_finished", {
      data: {
        id: nodeConfig.id,
        node_id: nodeConfig.id,
        node_name: nodeConfig.name,
        status: nodeConfig.status || WorkflowRunningStatus.Succeeded,
        node_type: nodeConfig.type,
      },
    }),
};

export const createMessageEvent = (
  message: string,
  conversationId: string = "test-conv-id",
  taskId: string = "test-task-id",
  messageId: string = "test-message-id"
) =>
  createEvent("message", {
    answer: message,
    conversation_id: conversationId,
    task_id: taskId,
    id: messageId,
  });
