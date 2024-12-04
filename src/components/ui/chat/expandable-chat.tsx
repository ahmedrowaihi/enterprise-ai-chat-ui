"use client";

import React, { useRef, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ChatPosition = "bottom-right" | "bottom-left";
export type ChatSize = "sm" | "md" | "lg" | "xl" | "full";

const chatConfig = {
  dimensions: {
    sm: "sm:ui-max-w-sm sm:ui-max-h-[500px]",
    md: "sm:ui-max-w-md sm:ui-max-h-[600px]",
    lg: "sm:ui-max-w-lg sm:ui-max-h-[700px]",
    xl: "sm:ui-max-w-xl sm:ui-max-h-[800px]",
    full: "sm:ui-w-full sm:ui-h-full",
  },
  positions: {
    "bottom-right": "ui-bottom-5 ui-right-5",
    "bottom-left": "ui-bottom-5 ui-left-5",
  },
  chatPositions: {
    "bottom-right": "sm:ui-bottom-[calc(100%+10px)] sm:ui-right-0",
    "bottom-left": "sm:ui-bottom-[calc(100%+10px)] sm:ui-left-0",
  },
  states: {
    open: "ui-pointer-events-auto ui-opacity-100 ui-visible ui-scale-100 ui-translate-y-0",
    closed:
      "ui-pointer-events-none ui-opacity-0 ui-invisible ui-scale-100 sm:ui-translate-y-5",
  },
};

interface ExpandableChatProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: ChatPosition;
  size?: ChatSize;
  icon?: React.ReactNode;
}

const ExpandableChat: React.FC<ExpandableChatProps> = ({
  className,
  position = "bottom-right",
  size = "md",
  icon,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div
      className={cn(
        `ui-fixed ${chatConfig.positions[position]} ui-z-50`,
        className
      )}
      {...props}
    >
      <div
        ref={chatRef}
        className={cn(
          "ui-flex ui-flex-col ui-bg-background ui-border sm:ui-rounded-lg ui-shadow-md ui-overflow-hidden ui-transition-all ui-duration-250 ui-ease-out sm:ui-absolute sm:ui-w-[90vw] sm:ui-h-[80vh] ui-fixed ui-inset-0 ui-w-full ui-h-full sm:ui-inset-auto",
          chatConfig.chatPositions[position],
          chatConfig.dimensions[size],
          isOpen ? chatConfig.states.open : chatConfig.states.closed,
          className
        )}
      >
        {children}
        <Button
          variant="ghost"
          size="icon"
          className="ui-absolute ui-top-2 ui-right-2 sm:ui-hidden"
          onClick={toggleChat}
        >
          <X className="ui-h-4 ui-w-4" />
        </Button>
      </div>
      <ExpandableChatToggle
        icon={icon}
        isOpen={isOpen}
        toggleChat={toggleChat}
      />
    </div>
  );
};

ExpandableChat.displayName = "ExpandableChat";

const ExpandableChatHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "ui-flex ui-items-center ui-justify-between ui-p-4 ui-border-b",
      className
    )}
    {...props}
  />
);

ExpandableChatHeader.displayName = "ExpandableChatHeader";

const ExpandableChatBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("ui-flex-grow ui-overflow-y-auto", className)}
    {...props}
  />
);

ExpandableChatBody.displayName = "ExpandableChatBody";

const ExpandableChatFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("ui-border-t ui-p-4", className)} {...props} />;

ExpandableChatFooter.displayName = "ExpandableChatFooter";

interface ExpandableChatToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  isOpen: boolean;
  toggleChat: () => void;
}

const ExpandableChatToggle: React.FC<ExpandableChatToggleProps> = ({
  className,
  icon,
  isOpen,
  toggleChat,
  ...props
}) => (
  <Button
    variant="default"
    onClick={toggleChat}
    className={cn(
      "ui-w-14 ui-h-14 ui-rounded-full ui-shadow-md ui-flex ui-items-center ui-justify-center hover:ui-shadow-lg hover:ui-shadow-black/30 ui-transition-all ui-duration-300",
      className
    )}
    {...props}
  >
    {isOpen ? (
      <X className="ui-h-6 ui-w-6" />
    ) : (
      icon || <MessageCircle className="ui-h-6 ui-w-6" />
    )}
  </Button>
);

ExpandableChatToggle.displayName = "ExpandableChatToggle";

export {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
};
