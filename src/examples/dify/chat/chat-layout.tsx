"use client";

import { userData } from "@/examples/data";

import { Sidebar } from "@/components/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-breakpoints";
import { cn } from "@/lib/utils";
import React from "react";
import { ChatView } from "./chat-view";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = React.useState(userData[0]);
  const isMobile = useIsMobile();
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="ui-h-full ui-items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
        className={cn(
          isCollapsed &&
            "ui-min-w-[50px] md:ui-min-w-[70px] ui-transition-all ui-duration-300 ui-ease-in-out"
        )}
      >
        <Sidebar
          isCollapsed={isCollapsed || isMobile}
          chats={userData.map((user) => ({
            name: user.name,
            messages: user.messages ?? [],
            avatar: user.avatar,
            variant: selectedUser.name === user.name ? "secondary" : "ghost",
          }))}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <ChatView />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
