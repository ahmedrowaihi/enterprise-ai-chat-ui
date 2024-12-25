import { basicWorkflowChatbotHandler } from "./basic-workflow-chatbot";
import { sequentialWorkflowChatbotHandler } from "./sequential-workflow-chatbot";
import { parallelWorkflowChatbotHandler } from "./parallel-workflow-chatbot";
import { memoryWorkflowChatbotHandler } from "./memory-workflow-chatbot";

export const handlers = [
  basicWorkflowChatbotHandler,
  sequentialWorkflowChatbotHandler,
  parallelWorkflowChatbotHandler,
  memoryWorkflowChatbotHandler,
];
