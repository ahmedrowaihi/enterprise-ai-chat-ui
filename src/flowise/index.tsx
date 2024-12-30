import { FlowiseChat } from "./components/flowise-chat";
import { FlowiseConfigPane } from "./components/flowise-configpane";

export function Flowise() {
  return (
    <>
      <FlowiseChat />
      <FlowiseConfigPane />
    </>
  );
}
