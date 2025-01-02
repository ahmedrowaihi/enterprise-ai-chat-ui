import { Message } from "@/chat/types";
import { Button } from "@/components/ui/button";
import { ChatBubbleAction } from "@/components/ui/chat/chat-bubble";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { FlowiseExtra } from "@/flowise/types";
import { toast } from "@/hooks/use-toast";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { memo, useState } from "react";

interface FeedbackActionProps {
  message: Message<FlowiseExtra>;
}

type FeedbackType = "up" | "down" | null;

export const FeedbackAction = memo(function FeedbackAction({
  message,
}: FeedbackActionProps) {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackId, setFeedbackId] = useState<string>("");
  const adapter = useFlowiseChatStore((state) => state.adapter);
  const chatId = adapter.getChatId();

  const handleFeedback = async (type: FeedbackType) => {
    if (isSubmitting || feedback === type || !chatId) return;

    try {
      setIsSubmitting(true);
      const response = await adapter.submitFeedback({
        messageId: message.id,
        rating: type === "up" ? "THUMBS_UP" : "THUMBS_DOWN",
      });

      setFeedback(type);
      setFeedbackId(response.id);

      if (type === "down") {
        setShowDialog(true);
      } else {
        toast({
          title: "Thanks for the feedback!",
          description: "We're glad this was helpful",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to submit feedback",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitContent = async () => {
    if (!feedbackId || !feedbackContent.trim()) return;

    try {
      setIsSubmitting(true);
      await adapter.updateFeedback(feedbackId, {
        content: feedbackContent,
      });

      setShowDialog(false);
      setFeedbackContent("");
      toast({
        title: "Thanks for your detailed feedback",
        description: "We'll use this to improve our responses",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to submit feedback details",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!message.isBot || !chatId) return null;

  return (
    <>
      <ChatBubbleAction
        className="ui-size-6"
        icon={
          <ThumbsUp
            className={`ui-size-4 ${
              feedback === "up" ? "ui-fill-current" : ""
            }`}
          />
        }
        onClick={() => handleFeedback("up")}
        disabled={isSubmitting}
      />
      <ChatBubbleAction
        className="ui-size-6"
        icon={
          <ThumbsDown
            className={`ui-size-4 ${
              feedback === "down" ? "ui-fill-current" : ""
            }`}
          />
        }
        onClick={() => handleFeedback("down")}
        disabled={isSubmitting}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What could be improved?</DialogTitle>
            <DialogDescription>
              Help us understand what was wrong with this response so we can
              improve.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Please provide details about what was incorrect or could be improved..."
            value={feedbackContent}
            onChange={(e) => setFeedbackContent(e.target.value)}
            className="ui-min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitContent}
              disabled={isSubmitting || !feedbackContent.trim()}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});
