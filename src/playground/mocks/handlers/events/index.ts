import { basicWorkflowChatbotHandler } from "./basic-workflow-chatbot";
import { memoryWorkflowChatbotHandler } from "./memory-workflow-chatbot";
import { parallelWorkflowChatbotHandler } from "./parallel-workflow-chatbot";
import { sequentialWorkflowChatbotHandler } from "./sequential-workflow-chatbot";

export const eventHandlers = [
  basicWorkflowChatbotHandler,
  memoryWorkflowChatbotHandler,
  sequentialWorkflowChatbotHandler,
  parallelWorkflowChatbotHandler,
];
