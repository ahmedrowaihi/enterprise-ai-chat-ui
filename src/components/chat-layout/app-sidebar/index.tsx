import useLocalStorageState from "use-local-storage-state";
import { v4 as uuidv4 } from "uuid";

import { SideThread } from "@/components/chat-layout/types";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Plus, SquarePen, Trash2 } from "lucide-react";

export function ChatSidebar() {
  const [threads, setThreads] = useLocalStorageState("threads", {
    defaultValue: [] as SideThread[],
    storageSync: true,
  });
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Threads</SidebarGroupLabel>
          <SidebarGroupAction
            title="New Thread"
            onClick={() => {
              const threadId = uuidv4();
              setThreads((threads) => {
                return [
                  ...threads,
                  {
                    title: `New Thread`,
                    url: `/chat/${threadId}`,
                  },
                ];
              });
              window.location.href = `/chat/${threadId}`;
            }}
          >
            <Plus /> <span className="ui-sr-only">New Thread</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {threads.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "ui-text-start ui-flex ui-justify-between"
                      )}
                      href={item.url}
                    >
                      <div className="ui-flex ui-items-center ui-gap-2">
                        <SquarePen />
                        <span>{item.title}</span>
                      </div>
                      <Button
                        variant="link"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setThreads((threads) => {
                            const _threads = threads.filter(
                              (t) => t.url !== item.url
                            );
                            setTimeout(() => {
                              window.location.pathname = `${
                                _threads.pop()?.url || "chat"
                              }`;
                            }, 0);

                            return _threads;
                          });
                        }}
                        aria-label="Delete thread"
                      >
                        <Trash2 className="ui-h-4 ui-w-4 ui-bg-muted ui-text-muted-foreground ui-hover:text-destructive" />
                      </Button>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
