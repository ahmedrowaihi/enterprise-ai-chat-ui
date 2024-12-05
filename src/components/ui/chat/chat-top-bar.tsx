import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { ExpandableChatHeader } from "@/components/ui/chat/expandable-chat";
import { UserData } from "@/examples/data";
import { cn } from "@/lib/utils";
import { Info, Phone, Video } from "lucide-react";

interface ChatTopBarProps {
  selectedUser: UserData;
}

export const TopBarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatTopBar({ selectedUser }: ChatTopBarProps) {
  return (
    <ExpandableChatHeader>
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          <AvatarImage
            src={selectedUser.avatar}
            alt={selectedUser.name}
            width={6}
            height={6}
            className="w-10 h-10 "
          />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{selectedUser.name}</span>
          <span className="text-xs">Active 2 mins ago</span>
        </div>
      </div>

      <div className="flex gap-1">
        {TopBarIcons.map((icon, index) => (
          <a
            key={index}
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9"
            )}
          >
            <icon.icon size={20} className="text-muted-foreground" />
          </a>
        ))}
      </div>
    </ExpandableChatHeader>
  );
}
