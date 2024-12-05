import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ui-z-10 ui-border ui-rounded-lg ui-w-full ui-h-full ui-text-sm ui-flex">
      {children}
    </div>
  );
}
