import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { ExpandableChatHeader } from "@/components/ui/chat/expandable-chat";
import { cn } from "@/lib/utils";
import { Info, Phone, Video } from "lucide-react";
import { useUser } from "../hooks/useUser";

export const TopBarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatTopBar() {
  const selectedUser = useUser();
  return (
    <ExpandableChatHeader>
      <div className="ui-flex ui-items-center ui-gap-2">
        <Avatar className="ui-flex ui-justify-center ui-items-center">
          <AvatarImage
            src={selectedUser.avatar}
            alt={selectedUser.name}
            width={6}
            height={6}
            className="ui-w-10 ui-h-10"
          />
        </Avatar>
        <div className="ui-flex ui-flex-col">
          <span className="ui-font-medium">{selectedUser.name}</span>
          <span className="ui-text-xs">Active 2 mins ago</span>
        </div>
      </div>

      <div className="ui-flex ui-gap-1">
        {TopBarIcons.map((icon, index) => (
          <a
            key={index}
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "ui-h-9 ui-w-9"
            )}
          >
            <icon.icon size={20} className="ui-text-muted-foreground" />
          </a>
        ))}
      </div>
    </ExpandableChatHeader>
  );
}
