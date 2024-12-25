import { cn } from "@/lib/utils";
import {
  NodeType,
  WorkflowRunningStatus,
} from "@/playground/mocks/utils/event-types";
import { WorkflowProcess } from "@/playground/types";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle,
  Database,
  Loader2,
  MessageSquare,
  Search,
  Workflow,
} from "lucide-react";
import { useState } from "react";

const getNodeIcon = (type: NodeType, status: WorkflowRunningStatus) => {
  if (status === WorkflowRunningStatus.Running) {
    return (
      <Loader2 className="ui-w-3 ui-h-3 ui-animate-spin ui-text-muted-foreground" />
    );
  }

  if (
    status === WorkflowRunningStatus.Failed ||
    status === WorkflowRunningStatus.Stopped
  ) {
    return <AlertCircle className="ui-w-3 ui-h-3 ui-text-destructive" />;
  }

  switch (type) {
    case NodeType.LLM:
      return <Brain className="ui-w-3 ui-h-3 ui-text-violet-500" />;
    case NodeType.KnowledgeBase:
      return <Search className="ui-w-3 ui-h-3 ui-text-blue-500" />;
    case NodeType.ResponseGeneration:
      return <MessageSquare className="ui-w-3 ui-h-3 ui-text-green-500" />;
    case NodeType.Agent:
      return <Bot className="ui-w-3 ui-h-3 ui-text-amber-500" />;
    case NodeType.Tool:
      return <Database className="ui-w-3 ui-h-3 ui-text-cyan-500" />;
    case NodeType.Workflow:
      return <Workflow className="ui-w-3 ui-h-3 ui-text-indigo-500" />;
    default:
      return <CheckCircle className="ui-w-3 ui-h-3 ui-text-success" />;
  }
};

const getNodeStyles = (type: NodeType) => {
  switch (type) {
    case NodeType.LLM:
      return "ui-border-violet-100 ui-bg-violet-50/50";
    case NodeType.KnowledgeBase:
      return "ui-border-blue-100 ui-bg-blue-50/50";
    case NodeType.ResponseGeneration:
      return "ui-border-green-100 ui-bg-green-50/50";
    case NodeType.Agent:
      return "ui-border-amber-100 ui-bg-amber-50/50";
    case NodeType.Tool:
      return "ui-border-cyan-100 ui-bg-cyan-50/50";
    case NodeType.Workflow:
      return "ui-border-indigo-100 ui-bg-indigo-50/50";
    default:
      return "ui-border-gray-100 ui-bg-gray-50/50";
  }
};

interface WorkflowProcessItemProps {
  data: WorkflowProcess;
  expand?: boolean;
  onToggleExpand?: () => void;
}

export function WorkflowProcessItem({
  data,
  expand = false,
  onToggleExpand,
}: WorkflowProcessItemProps) {
  const [collapse, setCollapse] = useState(!expand);

  const running = data.status === WorkflowRunningStatus.Running;
  const succeeded = data.status === WorkflowRunningStatus.Succeeded;
  const failed =
    data.status === WorkflowRunningStatus.Failed ||
    data.status === WorkflowRunningStatus.Stopped;

  return (
    <div className="ui-rounded-xl ui-border ui-border-gray-100 ui-bg-white/50 ui-p-2 ui-shadow-sm">
      <div
        className="ui-flex ui-items-center ui-cursor-pointer ui-gap-2"
        onClick={() => {
          setCollapse(!collapse);
          onToggleExpand?.();
        }}
      >
        {running && (
          <Loader2 className="ui-w-4 ui-h-4 ui-animate-spin ui-text-blue-500" />
        )}
        {succeeded && (
          <CheckCircle className="ui-w-4 ui-h-4 ui-text-green-500" />
        )}
        {failed && <AlertCircle className="ui-w-4 ui-h-4 ui-text-red-500" />}

        <span className="ui-text-sm ui-font-medium ui-text-gray-700">
          Workflow Process
        </span>

        <ArrowRight
          className={cn(
            "ui-w-4 ui-h-4 ui-text-gray-400 ui-transition-transform",
            !collapse && "ui-rotate-90"
          )}
        />
      </div>

      {!collapse && (
        <div className="ui-mt-2 ui-space-y-2">
          {data.tracing.map((node) => (
            <div
              key={node.id}
              className={cn(
                "ui-rounded-lg ui-border ui-p-2",
                getNodeStyles(node.node_type)
              )}
            >
              <div className="ui-flex ui-items-center ui-gap-2">
                {getNodeIcon(node.node_type, node.status)}
                <span className="ui-text-sm ui-font-medium ui-text-gray-700">
                  {node.node_name}
                </span>
                <span className="ui-text-xs ui-text-gray-500 ui-ml-auto">
                  {node.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
