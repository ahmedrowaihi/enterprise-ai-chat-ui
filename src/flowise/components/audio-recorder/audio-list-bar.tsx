import { buttonVariants } from "@/components/ui/button";
import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, useEffect } from "react";

export const AudioListBar = memo(function AudioListBar() {
  const files = useFlowiseChatStore((state) => state.files);
  const setFiles = useFlowiseChatStore((state) => state.setFiles);

  const audioFiles = files.filter((file) => file.type.startsWith("audio/"));

  const removeFile = (index: number) => {
    const audioIndex = files.findIndex((file) =>
      file.type.startsWith("audio/")
    );
    const _files = [...files];
    _files.splice(audioIndex + index, 1);
    setFiles(_files);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      audioFiles.forEach((file) => {
        URL.revokeObjectURL(URL.createObjectURL(file));
      });
    };
  }, [audioFiles]);

  if (audioFiles.length === 0) return null;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        className="ui-flex ui-gap-2 ui-mb-2 ui-overflow-x-auto ui-flex-wrap"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
      >
        {audioFiles.reverse().map((file, index) => (
          <div
            key={index}
            className="ui-relative ui-group ui-flex ui-items-center ui-p-2"
          >
            <div className="ui-flex ui-h-max ui-w-48 ui-flex-col ui-items-center ui-justify-center ui-gap-1">
              <audio controls className=" ui-w-full">
                <source src={URL.createObjectURL(file)} type={file.type} />
              </audio>
            </div>
            <button
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className:
                  "ui-h-6 ui-w-6 ui-opacity-0 group-hover:ui-opacity-100",
              })}
              onClick={() => removeFile(index)}
            >
              <X className="ui-size-4" />
            </button>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
});
