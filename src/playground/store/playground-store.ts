import { Message } from "@/chat/types";
import { create } from "zustand";
import { WorkflowRunningStatus } from "../mocks/utils/event-types";
import { NodeTracing } from "../types";

export interface WorkflowMessage extends Message {
  workflowProcess?: {
    status: WorkflowRunningStatus;
    tracing: NodeTracing[];
    expand?: boolean;
  };
}

interface PlaygroundState {
  currentMessage?: WorkflowMessage;
  completedMessages: Map<string, WorkflowMessage>;
}

interface PlaygroundActions {
  setCurrentMessage: (
    message:
      | WorkflowMessage
      | undefined
      | ((prev: WorkflowMessage | undefined) => WorkflowMessage | undefined)
  ) => void;
  addCompletedMessage: (message: WorkflowMessage) => void;
  getCompletedMessage: (id: string) => WorkflowMessage | undefined;
}

export const usePlaygroundStore = create<PlaygroundState & PlaygroundActions>(
  (set, get) => ({
    currentMessage: undefined,
    completedMessages: new Map(),

    setCurrentMessage: (message) =>
      set((state) => ({
        currentMessage:
          typeof message === "function"
            ? message(state.currentMessage)
            : message,
      })),

    addCompletedMessage: (message) => {
      set((state) => {
        state.completedMessages.set(message.id, message);
        return state;
      });
    },

    getCompletedMessage: (id) => get().completedMessages.get(id),
  })
);
