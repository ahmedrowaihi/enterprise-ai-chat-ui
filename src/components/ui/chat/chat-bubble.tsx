import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MessageLoading from "./message-loading";
import { Button, ButtonProps } from "../button";

// ChatBubble
const chatBubbleVariant = cva(
  "ui-flex ui-gap-2 ui-max-w-[60%] ui-items-end ui-relative ui-group",
  {
    variants: {
      variant: {
        received: "ui-self-start",
        sent: "ui-self-end ui-flex-row-reverse",
      },
      layout: {
        default: "",
        ai: "ui-max-w-full ui-w-full ui-items-center",
      },
    },
    defaultVariants: {
      variant: "received",
      layout: "default",
    },
  }
);

interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariant> {}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, layout, children, ...props }, ref) => (
    <div
      className={cn(
        chatBubbleVariant({ variant, layout, className }),
        "ui-relative ui-group"
      )}
      ref={ref}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && typeof child.type !== "string"
          ? React.cloneElement(child, {
              variant,
              layout,
            } as React.ComponentProps<typeof child.type>)
          : child
      )}
    </div>
  )
);
ChatBubble.displayName = "ChatBubble";

// ChatBubbleAvatar
interface ChatBubbleAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
}

const ChatBubbleAvatar: React.FC<ChatBubbleAvatarProps> = ({
  src,
  fallback,
  className,
}) => (
  <Avatar className={className}>
    <AvatarImage src={src} alt="Avatar" />
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
);

// ChatBubbleMessage
const chatBubbleMessageVariants = cva("ui-p-4", {
  variants: {
    variant: {
      received:
        "ui-bg-secondary ui-text-secondary-foreground ui-rounded-r-lg ui-rounded-tl-lg",
      sent: "ui-bg-primary ui-text-primary-foreground ui-rounded-l-lg ui-rounded-tr-lg",
    },
    layout: {
      default: "",
      ai: "ui-border-t ui-w-full ui-rounded-none ui-bg-transparent",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

export interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean;
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(
  (
    { className, variant, layout, isLoading = false, children, ...props },
    ref
  ) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        "ui-break-words ui-max-w-full ui-whitespace-pre-wrap"
      )}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="ui-flex ui-items-center ui-space-x-2">
          <MessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  )
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// ChatBubbleTimestamp
interface ChatBubbleTimestampProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timestamp: string;
}

const ChatBubbleTimestamp: React.FC<ChatBubbleTimestampProps> = ({
  timestamp,
  className,
  ...props
}) => (
  <div className={cn("ui-text-xs ui-mt-2 ui-text-right", className)} {...props}>
    {timestamp}
  </div>
);

// ChatBubbleAction
type ChatBubbleActionProps = ButtonProps & {
  icon: React.ReactNode;
};

const ChatBubbleAction: React.FC<ChatBubbleActionProps> = ({
  icon,
  onClick,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}) => (
  <Button
    variant={variant}
    size={size}
    className={className}
    onClick={onClick}
    {...props}
  >
    {icon}
  </Button>
);

interface ChatBubbleActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
  className?: string;
}

const ChatBubbleActionWrapper = React.forwardRef<
  HTMLDivElement,
  ChatBubbleActionWrapperProps
>(({ variant, className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "ui-absolute ui-top-1/2 -ui-translate-y-1/2 ui-flex ui-opacity-0 group-hover:ui-opacity-100 ui-transition-opacity ui-duration-200",
      variant === "sent"
        ? "-ui-left-1 -ui-translate-x-full ui-flex-row-reverse"
        : "-ui-right-1 ui-translate-x-full",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
ChatBubbleActionWrapper.displayName = "ChatBubbleActionWrapper";

export {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  chatBubbleVariant,
  chatBubbleMessageVariants,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
};
