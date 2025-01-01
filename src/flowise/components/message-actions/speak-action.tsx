import { Message } from "@/chat/types";
import { ChatBubbleAction } from "@/components/ui/chat/chat-bubble";
import { FlowiseExtra } from "@/flowise/types";
import { speak, stopSpeaking } from "@/flowise/utils/text-to-speech";
import { toast } from "@/hooks/use-toast";
import { Volume2, VolumeX } from "lucide-react";
import { memo, useState } from "react";

interface SpeakActionProps {
  message: Message<FlowiseExtra>;
}

export const SpeakAction = memo(function SpeakAction({
  message,
}: SpeakActionProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async () => {
    try {
      if (isSpeaking) {
        stopSpeaking();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);
      await speak(message.content);
      setIsSpeaking(false);
    } catch (error) {
      toast({
        title: "Text-to-speech failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "error",
      });
      setIsSpeaking(false);
    }
  };

  return (
    <ChatBubbleAction
      className="ui-size-6"
      icon={
        isSpeaking ? (
          <VolumeX className="ui-size-4" />
        ) : (
          <Volume2 className="ui-size-4" />
        )
      }
      onClick={handleSpeak}
    />
  );
});
