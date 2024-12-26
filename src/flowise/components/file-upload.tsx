import { Button } from "@/components/ui/button";
import { useFlowiseSelector } from "@/flowise/store/store-provider";
import { ImagePlus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo } from "react";

export const FileListBar = memo(function FileListBar() {
  const files = useFlowiseSelector("files");
  const setFiles = useFlowiseSelector("setFiles");

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence initial={false}>
      {files.length > 0 && (
        <motion.div
          className="ui-flex ui-gap-2 ui-mb-2 ui-overflow-x-auto"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {files.map((file, index) => (
            <div
              key={index}
              className="ui-flex ui-items-center ui-gap-2 ui-bg-muted ui-px-2 ui-py-1 ui-rounded-md"
            >
              <span className="ui-text-sm ui-text-muted-foreground">
                {file.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ui-h-4 ui-w-4"
                onClick={() => removeFile(index)}
              >
                <X className="ui-h-3 ui-w-3" />
              </Button>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export const FileUploadButton = memo(function FileUploadButton() {
  const isResponding = useFlowiseSelector("isResponding");
  const setFiles = useFlowiseSelector("setFiles");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  return (
    <>
      <input
        type="file"
        multiple
        accept="image/*"
        className="ui-hidden"
        onChange={handleFileChange}
        id="file-upload"
      />
      <Button
        className="ui-h-8 ui-w-8 ui-shrink-0"
        type="button"
        disabled={isResponding}
        variant="ghost"
        size="icon"
      >
        <label htmlFor="file-upload">
          <ImagePlus size={20} className="ui-text-muted-foreground" />
        </label>
      </Button>
    </>
  );
});
