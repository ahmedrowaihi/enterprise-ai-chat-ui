import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "./app-sidebar";

export function ChatThreads() {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarTrigger />
    </SidebarProvider>
  );
}
