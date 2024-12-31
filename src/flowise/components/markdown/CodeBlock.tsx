import { Clipboard, Download } from "lucide-react";
import { memo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";

const programmingLanguages: Record<string, string> = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css",
};

interface CodeBlockProps {
  language?: string;
  chatflowid?: string;
  isDialog?: boolean;
  value: string;
}

export const CodeBlock = memo(
  ({ language, chatflowid, isDialog, value }: CodeBlockProps) => {
    const [showCopied, setShowCopied] = useState(false);

    const copyToClipboard = () => {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        return;
      }

      navigator.clipboard.writeText(value);
      setShowCopied(true);
      setTimeout(() => {
        setShowCopied(false);
      }, 1500);
    };

    const downloadAsFile = () => {
      const fileExtension = programmingLanguages[language || ""] || ".file";
      const suggestedFileName = `file-${chatflowid}${fileExtension}`;
      const fileName = suggestedFileName;

      if (!fileName) {
        return;
      }

      const blob = new Blob([value], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = fileName;
      link.href = url;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    return (
      <div
        className="ui-relative"
        style={{ width: isDialog ? "auto" : "300px" }}
      >
        <div className="ui-flex ui-items-center ui-justify-between ui-bg-gray-800 ui-text-white ui-p-2 ui-rounded-t-lg">
          <span>{language}</span>
          <div className="ui-flex ui-gap-2">
            {showCopied && (
              <span className="ui-text-xs ui-text-green-400">Copied!</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ui-h-8 ui-w-8 ui-text-white hover:ui-text-green-400"
              onClick={copyToClipboard}
            >
              <Clipboard className="ui-size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="ui-h-8 ui-w-8 ui-text-white hover:ui-text-blue-400"
              onClick={downloadAsFile}
            >
              <Download className="ui-size-4" />
            </Button>
          </div>
        </div>

        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    );
  }
);
