import { FlowiseChat } from "@/flowise/components/flowise-chat";
import { FlowiseChatProvider } from "./store/store-provider";

export function Flowise() {
  return (
    <FlowiseChatProvider>
      <FlowiseChat />
    </FlowiseChatProvider>
  );
}
