"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Message } from "@/examples/data";
import { cn } from "@/lib/utils";
import { MoreHorizontal, SquarePen } from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  chats: {
    name: string;
    messages: Message[];
    avatar: string;
    variant: "secondary" | "ghost";
  }[];
  onClick?: () => void;
}

export function Sidebar({ chats, isCollapsed }: SidebarProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="ui-relative ui-group ui-flex ui-flex-col ui-h-full ui-bg-muted/10 dark:ui-bg-muted/20 ui-gap-4 ui-p-2 data-[collapsed=true]:ui-p-2"
    >
      {!isCollapsed && (
        <div className="ui-flex ui-justify-between ui-p-2 ui-items-center">
          <div className="ui-flex ui-gap-2 ui-items-center ui-text-2xl">
            <p className="ui-font-medium">Chats</p>
            <span className="ui-text-zinc-300">({chats.length})</span>
          </div>

          <div>
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "ui-h-9 ui-w-9"
              )}
            >
              <MoreHorizontal size={20} />
            </a>

            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "ui-h-9 ui-w-9"
              )}
            >
              <SquarePen size={20} />
            </a>
          </div>
        </div>
      )}
      <nav className="ui-grid ui-gap-1 ui-px-2 group-[[data-collapsed=true]]:ui-justify-center group-[[data-collapsed=true]]:ui-px-2">
        {chats.map((chat, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <a
                    href="#"
                    className={cn(
                      buttonVariants({ variant: chat.variant, size: "icon" }),
                      "ui-h-11 ui-w-11 md:ui-h-16 md:ui-w-16",
                      chat.variant === "secondary" &&
                        "dark:ui-bg-muted dark:ui-text-muted-foreground dark:hover:ui-bg-muted dark:hover:ui-text-white"
                    )}
                  >
                    <Avatar className="ui-flex ui-justify-center ui-items-center">
                      <AvatarImage
                        src={chat.avatar}
                        alt={chat.avatar}
                        width={6}
                        height={6}
                        className="ui-w-10 ui-h-10"
                      />
                    </Avatar>{" "}
                    <span className="ui-sr-only">{chat.name}</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="ui-flex ui-items-center ui-gap-4"
                >
                  {chat.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <a
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: chat.variant, size: "xl" }),
                chat.variant === "secondary" &&
                  "dark:ui-bg-muted dark:ui-text-white dark:hover:ui-bg-muted dark:hover:ui-text-white ui-shrink",
                "ui-justify-start ui-gap-4"
              )}
            >
              <Avatar className="ui-flex ui-justify-center ui-items-center">
                <AvatarImage
                  src={chat.avatar}
                  alt={chat.avatar}
                  width={6}
                  height={6}
                  className="ui-w-10 ui-h-10"
                />
              </Avatar>
              <div className="ui-flex ui-flex-col ui-max-w-28">
                <span>{chat.name}</span>
                {chat.messages.length > 0 && (
                  <span className="ui-text-zinc-300 ui-text-xs ui-truncate">
                    {chat.messages[chat.messages.length - 1].name.split(" ")[0]}
                    :{" "}
                    {chat.messages[chat.messages.length - 1].isLoading
                      ? "Typing..."
                      : chat.messages[chat.messages.length - 1].message}
                  </span>
                )}
              </div>
            </a>
          )
        )}
      </nav>
    </div>
  );
}
