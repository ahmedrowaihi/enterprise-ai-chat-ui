import { createEventString } from "./create-event-string";
import { NodeType, WorkflowRunningStatus } from "./event-types";

export const createWorkflowEvents = {
  started: (workflowId: string, taskId: string) =>
    createEventString("workflow_started", {
      workflow_run_id: workflowId,
      task_id: taskId,
      status: WorkflowRunningStatus.Running,
    }),

  finished: (status: WorkflowRunningStatus = WorkflowRunningStatus.Succeeded) =>
    createEventString("workflow_finished", {
      status,
    }),
};

export const createNodeEvents = {
  started: (nodeConfig: {
    id: string;
    name: string;
    type: NodeType;
    status?: WorkflowRunningStatus;
  }) =>
    createEventString("node_started", {
      id: nodeConfig.id,
      node_id: nodeConfig.id,
      node_name: nodeConfig.name,
      status: nodeConfig.status || WorkflowRunningStatus.Running,
      node_type: nodeConfig.type,
    }),

  finished: (nodeConfig: {
    id: string;
    name: string;
    type: NodeType;
    status?: WorkflowRunningStatus;
  }) =>
    createEventString("node_finished", {
      id: nodeConfig.id,
      node_id: nodeConfig.id,
      node_name: nodeConfig.name,
      status: nodeConfig.status || WorkflowRunningStatus.Succeeded,
      node_type: nodeConfig.type,
    }),
};

export const createMessageEvent = (
  message: string,
  conversationId: string = "test-conv-id",
  taskId: string = "test-task-id",
  messageId: string = "test-message-id"
) =>
  createEventString("message", {
    answer: message,
    conversation_id: conversationId,
    task_id: taskId,
    id: messageId,
  });
