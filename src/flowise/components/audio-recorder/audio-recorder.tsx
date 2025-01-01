import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Mic, MicOff } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { audioRecorder } from "../../utils/audio-recorder";
import { useFlowiseChatStore } from "../../store/flowise-chat-store";

export const AudioRecorder = memo(function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const setFiles = useFlowiseChatStore((state) => state.setFiles);
  const files = useFlowiseChatStore((state) => state.files);

  const handleRecordToggle = useCallback(async () => {
    try {
      if (isRecording) {
        const audioBlob = await audioRecorder.stop();
        const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: audioBlob.type,
        });
        setFiles([...files, file]);
        setIsRecording(false);
        toast({
          title: "Recording completed",
          variant: "success",
        });
      } else {
        await audioRecorder.start();
        setIsRecording(true);
        toast({
          title: "Recording started",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Recording failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "error",
      });
      setIsRecording(false);
    }
  }, [isRecording, setFiles, files]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="ui-h-8 ui-w-8 ui-shrink-0"
      onClick={handleRecordToggle}
    >
      {isRecording ? (
        <MicOff className="ui-size-4" />
      ) : (
        <Mic className="ui-size-4" />
      )}
    </Button>
  );
});
