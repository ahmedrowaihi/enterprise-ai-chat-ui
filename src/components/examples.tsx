"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Example, useChatStore } from "@/hooks/use-chat-store";
import { useEffect } from "react";

export default function Examples() {
  const examples = useChatStore((state) => state.examples);
  const setSelectedExample = useChatStore((state) => state.setSelectedExample);
  const selectedExample = useChatStore((state) => state.selectedExample);

  const pathname = window.location.pathname;

  useEffect(() => {
    setSelectedExample(
      examples.find((example) => example.url === pathname) as Example
    );
  }, [pathname]);

  const handleChange = (value: string) => {
    setSelectedExample(
      examples.find((example) => example.url === value) as Example
    );
    window.location.pathname = value;
  };

  return (
    <div>
      <Select onValueChange={handleChange} defaultValue={pathname}>
        <SelectTrigger>
          <SelectValue>{selectedExample.name}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {examples.map((example) => (
            <SelectItem key={example.url} value={example.url}>
              {example.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
