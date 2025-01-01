import { Message } from "@/chat/types";
import { ChatBubbleAction } from "@/components/ui/chat/chat-bubble";
import { toast } from "@/hooks/use-toast";
import { ClipboardCopy } from "lucide-react";
import { memo } from "react";
import { FlowiseExtra } from "../../types";

interface CopyActionProps {
  message: Message<FlowiseExtra>;
}

export const CopyAction = memo(function CopyAction({
  message,
}: CopyActionProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Copied to clipboard",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to copy to clipboard",
        variant: "error",
      });
    }
  };

  return (
    <ChatBubbleAction
      className="ui-size-6"
      icon={<ClipboardCopy className="ui-size-4" />}
      onClick={handleCopy}
    />
  );
});
