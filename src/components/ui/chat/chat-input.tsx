import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => (
    <Textarea
      autoComplete="off"
      ref={ref}
      name="message"
      className={cn(
        "ui-max-h-12 ui-px-4 ui-py-3 ui-bg-background ui-text-sm placeholder:ui-text-muted-foreground focus-visible:ui-outline-none focus-visible:ui-ring-ring disabled:ui-cursor-not-allowed disabled:ui-opacity-50 ui-w-full ui-rounded-md ui-flex ui-items-center ui-h-16 ui-resize-none",
        className
      )}
      {...props}
    />
  )
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
