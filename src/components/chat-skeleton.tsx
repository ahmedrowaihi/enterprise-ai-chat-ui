import { Skeleton } from "./ui/skeleton";

export function ChatSkeleton() {
  return (
    <div className="ui-flex ui-h-full ui-w-full ui-flex-col ui-justify-between">
      <div className="ui-flex ui-h-full ui-w-full ui-flex-col ui-space-y-4">
        <div className="ui-flex ui-items-start">
          <Skeleton className="ui-h-12 ui-w-3/4 ui-rounded-lg" />
        </div>
        <div className="ui-flex ui-justify-end">
          <Skeleton className="ui-h-12 ui-w-2/3 ui-rounded-lg" />
        </div>
        <div className="ui-flex ui-items-start">
          <Skeleton className="ui-h-12 ui-w-1/2 ui-rounded-lg" />
        </div>
        <div className="ui-flex ui-justify-end">
          <Skeleton className="ui-h-12 ui-w-3/4 ui-rounded-lg" />
        </div>
        <div className="ui-flex ui-items-start">
          <Skeleton className="ui-h-12 ui-w-1/2 ui-rounded-lg" />
        </div>
        <div className="ui-flex ui-justify-end">
          <Skeleton className="ui-h-12 ui-w-3/4 ui-rounded-lg" />
        </div>
        <div className="ui-flex ui-items-start">
          <Skeleton className="ui-h-12 ui-w-1/2 ui-rounded-lg" />
        </div>
        <div className="ui-flex ui-justify-end">
          <Skeleton className="ui-h-12 ui-w-3/4 ui-rounded-lg" />
        </div>
      </div>
      <Skeleton className="ui-h-8 ui-w-full ui-rounded-lg" />
    </div>
  );
}
