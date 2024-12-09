"use client";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { AppInfoComponent, ChatBtn, FootLogo } from "./config-form-components";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type IConfigFormProps = {
  siteInfo: {
    privacy_policy: string;
  };
  promptConfig: {
    prompt_template: string;
    prompt_variables: {
      key: string;
      name: string;
      type: string;
      required: boolean;
      options: string[];
      max_length?: number;
    }[];
  };
  onStartChat: (inputs: Record<string, string>) => void;
  savedInputs?: Record<string, string>;
};

export const ConfigSceneForm: FC<IConfigFormProps> = React.memo(
  ({ siteInfo, promptConfig, onStartChat, savedInputs }) => {
    const hasVar = promptConfig.prompt_variables.length > 0;
    const [inputs, setInputs] = useState<Record<string, string>>(() => {
      const defaultInputs = promptConfig.prompt_variables.reduce(
        (acc, item) => ({
          ...acc,
          [item.key]: "",
        }),
        {}
      );

      return savedInputs || defaultInputs;
    });

    useEffect(() => {
      if (savedInputs) {
        setInputs(savedInputs);
      }
    }, [savedInputs]);

    const renderInputs = () => {
      return (
        <div className="ui-space-y-4">
          {promptConfig.prompt_variables.map((item) => (
            <div
              className="ui-grid tablet:ui-grid-cols-[180px,1fr] ui-gap-3 ui-items-start"
              key={item.key}
            >
              <Label
                className={cn(
                  "ui-text-sm ui-font-medium ui-text-gray-700 ui-pt-2"
                )}
              >
                {item.name}
              </Label>
              {item.type === "select" && (
                <Select defaultValue={inputs?.[item.key]}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {item?.options.map((i) => (
                        <SelectItem key={i} value={i}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              {item.type === "string" && (
                <Input
                  placeholder={`${item.name}${
                    !item.required ? " (optional)" : ""
                  }`}
                  value={inputs?.[item.key] || ""}
                  onChange={(e) => {
                    setInputs({ ...inputs, [item.key]: e.target.value });
                  }}
                  maxLength={item.max_length}
                />
              )}
              {item.type === "paragraph" && (
                <Textarea
                  className="ui-min-h-[120px]"
                  placeholder={`${item.name}${
                    !item.required ? " (optional)" : ""
                  }`}
                  value={inputs?.[item.key] || ""}
                  onChange={(e) => {
                    setInputs({ ...inputs, [item.key]: e.target.value });
                  }}
                />
              )}
            </div>
          ))}
        </div>
      );
    };

    const canChat = () => {
      return promptConfig.prompt_variables.every(
        (variable) => inputs[variable.key] !== ""
      );
    };

    const handleChat = () => {
      onStartChat(inputs);
    };

    return (
      <div className="ui-relative ui-min-h-screen">
        <div className="ui-container ui-mx-auto ui-max-w-3xl ui-px-4 ui-py-8">
          <Card>
            <CardContent className="ui-flex ui-flex-col ui-gap-4">
              <AppInfoComponent siteInfo={siteInfo} />
              {hasVar && <>{renderInputs()}</>}
              <ChatBtn
                className="ui-mt-4 ui-ms-auto"
                onClick={handleChat}
                disabled={!canChat()}
              />
            </CardContent>
          </Card>

          <footer className="ui-mt-6 ui-flex ui-justify-between ui-items-center ui-text-sm ui-text-gray-500">
            {siteInfo.privacy_policy && (
              <div>
                <a
                  className="ui-text-gray-600 hover:ui-text-gray-900 ui-transition-colors ui-underline"
                  href={siteInfo.privacy_policy}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </div>
            )}
            <a
              className="ui-flex ui-items-center ui-gap-2 ui-text-gray-600 hover:ui-text-gray-900 ui-transition-colors"
              href="https://dify.ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="ui-font-medium ui-uppercase">Powered By</span>
              <div className="ui-w-20 ui-flex ui-items-center">
                <FootLogo />
              </div>
            </a>
          </footer>
        </div>
      </div>
    );
  }
);

ConfigSceneForm.displayName = "ConfigSceneForm";
