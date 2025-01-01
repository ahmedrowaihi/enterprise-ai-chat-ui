import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { FileText, ImagePlus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, useEffect, useMemo } from "react";

export const FileListBar = memo(function FileListBar() {
  const files = useFlowiseChatStore((state) => state.files);
  const setFiles = useFlowiseChatStore((state) => state.setFiles);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getImagePreview = (file: File) => {
    if (!file.type.startsWith("image/")) return null;
    return URL.createObjectURL(file);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const url = getImagePreview(file);
          if (url) URL.revokeObjectURL(url);
        }
      });
    };
  }, [files]);

  return (
    <AnimatePresence initial={false}>
      {files.length > 0 && (
        <motion.div
          className="ui-flex ui-gap-2 ui-mb-2 ui-overflow-x-auto"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {files.map((file, index) => {
            const imageUrl = getImagePreview(file);
            return (
              <div
                key={index}
                className="ui-flex ui-items-center ui-gap-2 ui-bg-muted ui-px-2 ui-py-1 ui-rounded-md"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ui-flex ui-items-center ui-gap-2">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={file.name}
                            className="ui-h-6 ui-w-6 ui-object-cover ui-rounded"
                          />
                        ) : (
                          <FileText className="ui-h-6 ui-w-6 ui-text-muted-foreground" />
                        )}
                        <div
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                            className: "ui-h-4 ui-w-4",
                          })}
                          onClick={() => removeFile(index)}
                        >
                          <X className="ui-h-3 ui-w-3" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="ui-text-sm">{file.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export const FileUploadButton = memo(function FileUploadButton() {
  const isResponding = useFlowiseChatStore((state) => state.isResponding);
  const setFiles = useFlowiseChatStore((state) => state.setFiles);
  const getCapabilities = useFlowiseChatStore((state) => state.getCapabilities);
  const capabilities = useMemo(() => getCapabilities(), [getCapabilities]);

  const acceptedTypes = useMemo(() => {
    const imageTypes = capabilities.imageUploadConfig[0]?.fileTypes || [];
    const fileTypes = capabilities.fileUploadConfig[0]?.fileTypes || [];
    return [...imageTypes, ...fileTypes].join(",");
  }, [capabilities]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      // Check if file type is accepted
      if (!acceptedTypes.includes(file.type)) {
        console.warn(`File type ${file.type} not supported`);
        return false;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      const isImage = file.type.startsWith("image/");
      const config = isImage
        ? capabilities.imageUploadConfig[0]
        : capabilities.fileUploadConfig[0];

      if (!config || fileSizeMB > config.maxUploadSize) {
        console.warn(
          `File size ${fileSizeMB.toFixed(1)}MB exceeds limit of ${
            config?.maxUploadSize
          }MB`
        );
        return false;
      }

      return true;
    });

    setFiles(validFiles);
  };

  return (
    <>
      <input
        type="file"
        multiple
        accept={acceptedTypes}
        className="ui-hidden"
        onChange={handleFileChange}
        id="file-upload"
      />
      <Button
        className="ui-h-8 ui-w-8 ui-shrink-0 ui-cursor-pointer"
        type="button"
        disabled={isResponding}
        variant="ghost"
        size="icon"
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor="file-upload" className="ui-cursor-pointer">
          <ImagePlus size={20} className="ui-text-muted-foreground" />
        </label>
      </Button>
    </>
  );
});
