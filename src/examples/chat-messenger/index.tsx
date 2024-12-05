import { ChatLayout } from "@/components/chat/chat-layout";
import { Layout } from "@/examples/layout";

export function ChatMessenger() {
  return (
    <Layout>
      <div className="ui-w-full">
        <ChatLayout defaultLayout={undefined} navCollapsedSize={8} />
      </div>
    </Layout>
  );
}
