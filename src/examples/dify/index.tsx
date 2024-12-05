import { Chat } from "@/components/chat/chat";
import { Layout } from "../layout";
import { DifyLayout } from "./layout/dify-layout";
import { userData } from "@/examples/data";

export function Dify() {
  return (
    <Layout>
      <div className="ui-w-full">
        <DifyLayout navCollapsedSize={8}>
          <Chat selectedUser={userData[0]} />
        </DifyLayout>
      </div>
    </Layout>
  );
}
