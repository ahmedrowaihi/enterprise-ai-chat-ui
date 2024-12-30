import { useChatStore } from "../store/chat-store";
import { ChatAdapter, ChatHandlers, SendMessageOptions } from "../types";
import { useCallback } from "react";

export function useChat(adapter: ChatAdapter) {
  const { setResponding, setError } = useChatStore();

  const handleSend = useCallback(
    async ({
      message,
      files = [],
      onStreamStart,
      onStreamMessage,
      onStreamEnd,
      onStreamError,
      onStart,
      onResponse,
      onError,
    }: SendMessageOptions) => {
      if (!message.trim()) return;

      setResponding(true);

      const handlers: ChatHandlers = {
        onStreamStart,
        onStreamMessage,
        onStreamEnd: (finalContent) => {
          setResponding(false);
          onStreamEnd?.(finalContent);
        },
        onStreamError: (error) => {
          console.error("Error:", error);
          setError(error.message);
          setResponding(false);
          onStreamError?.(error);
        },
        onStart,
        onResponse: (content) => {
          setResponding(false);
          onResponse?.(content);
        },
        onError: (error) => {
          console.error("Error:", error);
          setError(error.message);
          setResponding(false);
          onError?.(error);
        },
      };

      await adapter.sendMessage(message, files, handlers);
    },
    [adapter, setResponding, setError]
  );

  return { adapter, handleSend };
}
