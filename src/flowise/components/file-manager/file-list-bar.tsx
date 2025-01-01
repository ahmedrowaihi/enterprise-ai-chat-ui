import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, useEffect } from "react";

export const FileListBar = memo(function FileListBar() {
  const files = useFlowiseChatStore((state) => state.files);
  const setFiles = useFlowiseChatStore((state) => state.setFiles);

  const nonAudioFiles = files.filter((file) => !file.type.startsWith("audio/"));

  const removeFile = (index: number) => {
    const nonAudioIndex = files.findIndex(
      (file) => !file.type.startsWith("audio/")
    );
    setFiles(files.filter((_, i) => i !== nonAudioIndex + index));
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      nonAudioFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const url = getFilePreview(file);
          if (url) URL.revokeObjectURL(url);
        }
      });
    };
  }, [nonAudioFiles]);

  const renderFilePreview = (file: File, index: number) => {
    if (file.type.startsWith("image/")) {
      const previewUrl = getFilePreview(file);
      return (
        <div key={index} className="ui-relative ui-group">
          <img
            src={previewUrl || ""}
            alt={file.name}
            className="ui-h-16 ui-w-16 ui-rounded ui-object-cover"
          />
          <button
            className={buttonVariants({
              variant: "destructive",
              size: "icon",
              className:
                "ui-absolute ui--right-2 ui--top-2 ui-h-6 ui-w-6 ui-opacity-0 group-hover:ui-opacity-100",
            })}
            onClick={() => removeFile(index)}
          >
            <X className="ui-size-4" />
          </button>
        </div>
      );
    }

    return (
      <TooltipProvider key={index}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="ui-relative ui-group">
              <div className="ui-flex ui-h-16 ui-w-16 ui-items-center ui-justify-center ui-rounded ui-border ui-bg-muted/50">
                <FileText className="ui-size-6 ui-text-muted-foreground" />
              </div>
              <button
                className={buttonVariants({
                  variant: "destructive",
                  size: "icon",
                  className:
                    "ui-absolute ui--right-2 ui--top-2 ui-h-6 ui-w-6 ui-opacity-0 group-hover:ui-opacity-100",
                })}
                onClick={() => removeFile(index)}
              >
                <X className="ui-size-4" />
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent>{file.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (nonAudioFiles.length === 0) return null;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        className="ui-flex ui-gap-2 ui-mb-2 ui-overflow-x-auto"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
      >
        {nonAudioFiles.map((file, index) => renderFilePreview(file, index))}
      </motion.div>
    </AnimatePresence>
  );
});
