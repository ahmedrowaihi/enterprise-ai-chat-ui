"use client";
import type { FC } from "react";

import { cn } from "@/lib/utils";
// import { useTranslation } from "react-i18next";
// import type { AppInfo } from "@/types/app";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

export const AppInfoComponent: FC<{
  siteInfo: // AppInfo
  any;
}> = ({ siteInfo }) => {
  // const { t } = useTranslation();
  return (
    <div>
      <div className="ui-flex ui-items-center ui-py-2 ui-text-xl ui-font-medium ui-text-gray-700 ui-rounded-md">
        👏 welcome {/* {t("app.common.welcome")} */}
        {siteInfo.title}
      </div>
      <div className="ui-text-sm ui-text-gray-500">{siteInfo.description}</div>
    </div>
  );
};

export const PromptTemplate: FC<{ html: string }> = ({ html }) => {
  return (
    <div
      className={"ui-box-border ui-text-sm ui-text-gray-700"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const ChatBtn: FC<{
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ className, onClick, disabled }) => {
  // const { t } = useTranslation();
  return (
    <Button
      disabled={disabled}
      className={cn(className, "ui-space-x-2 ui-flex ui-items-center")}
      onClick={onClick}
    >
      <svg
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18 10.5C18 14.366 14.418 17.5 10 17.5C8.58005 17.506 7.17955 17.1698 5.917 16.52L2 17.5L3.338 14.377C2.493 13.267 2 11.934 2 10.5C2 6.634 5.582 3.5 10 3.5C14.418 3.5 18 6.634 18 10.5ZM7 9.5H5V11.5H7V9.5ZM15 9.5H13V11.5H15V9.5ZM9 9.5H11V11.5H9V9.5Z"
          fill="white"
        />
      </svg>
      {/* {t("app.chat.startChat")} */}
      start Chat
    </Button>
  );
};

export const EditBtn = ({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) => {
  // const { t } = useTranslation();

  return (
    <Button
      className={cn("ui-flex ui-space-x-1 ui-items-center", className)}
      onClick={onClick}
      type="button"
    >
      <PencilIcon className="ui-w-3 ui-h-3" />
      {/* <span>{t("common.operation.edit")}</span> */}
      <span>Edit</span>
    </Button>
  );
};

export const FootLogo = () => (
  <img
    className={cn("ui-w-full ui-h-auto object-contain")}
    src="/icons/logo.webp"
    alt="logo"
  />
);
