import { useChatStore } from "@/hooks/use-chat-store";

export function useUser() {
  return useChatStore((s) => s.selectedUser);
}
