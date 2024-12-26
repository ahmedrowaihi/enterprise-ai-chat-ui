import { FlowiseChat } from "@/flowise/components/flowise-chat";
import {
  FlowiseConfig,
  FlowiseConfigPane,
} from "@/flowise/components/flowise-config";
import { FlowiseChatProvider } from "@/flowise/store/store-provider";

export function FlowiseApp() {
  return (
    <FlowiseChatProvider>
      <div className="ui-flex ui-flex-col ui-gap-4 ui-p-4">
        <FlowiseConfig />
        <FlowiseConfigPane />
        <FlowiseChat />
      </div>
    </FlowiseChatProvider>
  );
}
