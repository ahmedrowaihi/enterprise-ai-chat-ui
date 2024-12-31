import { memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import type { ComponentPropsWithoutRef } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import rehypeRaw from "rehype-raw";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";

interface MemoizedReactMarkdownProps extends Omit<Options, "children"> {
  children: string;
  chatflowid?: string;
  isDialog?: boolean;
  className?: string;
}

interface CodeProps extends ComponentPropsWithoutRef<"code"> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const MemoizedReactMarkdown = memo(
  ({
    children,
    chatflowid,
    isDialog,
    className,
    ...props
  }: MemoizedReactMarkdownProps) => (
    <div className={cn("ui-prose-invert ui-max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeMathjax, rehypeRaw]}
        components={{
          code({ inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (
              <CodeBlock
                key={Math.random()}
                chatflowid={chatflowid}
                isDialog={isDialog}
                language={(match && match[1]) || ""}
                value={String(children).replace(/\n$/, "")}
                {...props}
              />
            ) : (
              <code
                className={cn("ui-rounded ui-px-1 ui-py-0.5", className)}
                {...props}
              >
                {children}
              </code>
            );
          },
          ul({ children }) {
            return (
              <ul className="ui-list-disc ui-pl-6 ui-space-y-2">{children}</ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="ui-list-decimal ui-pl-6 ui-space-y-2">
                {children}
              </ol>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="ui-border-l-4 ui-pl-4 ui-italic">
                {children}
              </blockquote>
            );
          },
        }}
        {...props}
      >
        {children}
      </ReactMarkdown>
    </div>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

MemoizedReactMarkdown.displayName = "MemoizedReactMarkdown";
