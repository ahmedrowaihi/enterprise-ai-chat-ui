import { FlowiseChat } from "@/flowise/components/flowise-chat";
import { FlowiseConfigPane } from "./components/flowise-config";
import { FlowiseChatProvider } from "./store/store-provider";

export function Flowise() {
  return (
    <FlowiseChatProvider>
      <FlowiseChat />
      <FlowiseConfigPane />
    </FlowiseChatProvider>
  );
}
