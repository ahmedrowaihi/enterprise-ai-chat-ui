import { basicWorkflowChatbotHandler } from "./basic-workflow-chatbot";
import { sequentialWorkflowChatbotHandler } from "./sequential-workflow-chatbot";
import { parallelWorkflowChatbotHandler } from "./parallel-workflow-chatbot";

export * from "./types";

export const handlers = [
  basicWorkflowChatbotHandler,
  sequentialWorkflowChatbotHandler,
  parallelWorkflowChatbotHandler,
];
