"use client";

import { userData } from "@/examples/data";

import { Sidebar } from "../sidebar/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-breakpoints";
import { cn } from "@/lib/utils";
import React from "react";

interface ChatLayoutProps {
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export function DifyLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
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
        <Sidebar isCollapsed={isCollapsed || isMobile} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
