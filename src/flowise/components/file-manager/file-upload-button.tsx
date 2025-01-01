import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { ImagePlus } from "lucide-react";
import { memo, useMemo } from "react";
import { toast } from "@/hooks/use-toast";

export const FileUploadButton = memo(function FileUploadButton() {
  const setFiles = useFlowiseChatStore((state) => state.setFiles);
  const files = useFlowiseChatStore((state) => state.files);
  const getCapabilities = useFlowiseChatStore((state) => state.getCapabilities);
  const capabilities = useMemo(() => getCapabilities(), [getCapabilities]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    const validFiles = newFiles.filter((file) => {
      // Check for audio files
      if (file.type.startsWith("audio/")) {
        if (!capabilities?.speechToText) {
          toast({
            title: "Audio files not supported",
            description: "Speech-to-text capability is not enabled",
            variant: "error",
          });
          return false;
        }
      }

      // Check against file upload config
      const config = capabilities?.fileUploadConfig[0];
      if (!config) return false;

      if (!config.fileTypes.includes(file.type)) {
        toast({
          title: "File type not supported",
          description: `${file.type} is not an allowed file type`,
          variant: "error",
        });
        return false;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > config.maxUploadSize) {
        toast({
          title: "File too large",
          description: `File size ${fileSizeMB.toFixed(1)}MB exceeds limit of ${
            config.maxUploadSize
          }MB`,
          variant: "error",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setFiles([...files, ...validFiles]);
    }
    event.target.value = "";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <input
              type="file"
              id="file-upload"
              className="ui-hidden"
              onChange={handleFileChange}
              accept={capabilities?.fileUploadConfig[0]?.fileTypes.join(",")}
              multiple
            />
            <Button
              variant="ghost"
              size="icon"
              className="ui-h-8 ui-w-8 ui-shrink-0"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <ImagePlus className="ui-size-4" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>Upload files</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
