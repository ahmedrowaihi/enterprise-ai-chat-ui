import { useChatStore } from "@/hooks/use-chat-store";

export function useMessages() {
  return useChatStore((s) => s.messages);
}
