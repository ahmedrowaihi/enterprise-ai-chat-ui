import { FlowiseChat } from "@/flowise/components/flowise-chat";
import { FlowiseConfigPane } from "./components/flowise-configpane";
import { FlowiseChatProvider } from "./store/store-provider";

export function Flowise() {
  return (
    <FlowiseChatProvider>
      <FlowiseChat />
      <FlowiseConfigPane />
    </FlowiseChatProvider>
  );
}
