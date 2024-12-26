import { FlowiseClient } from "flowise-sdk";
import { useCallback } from "react";
import { useConfigSelector } from "../store/store-provider";

export function useFlowiseChat() {
  const config = useConfigSelector("config");
  const flowise = new FlowiseClient({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  });

  const handleSend = useCallback(
    async ({
      message,
      files,
      onStart,
      onMessage,
      onError,
      onFinish,
    }: {
      message: string;
      files?: File[];
      onStart?: () => void;
      onMessage?: (message: string) => void;
      onError?: (error: Error) => void;
      onFinish?: () => void;
    }) => {
      try {
        onStart?.();

        const uploads = files
          ? await Promise.all(
              files.map(async (file) => {
                const reader = new FileReader();
                const data = await new Promise<string>((resolve) => {
                  reader.onloadend = () => {
                    const base64 = (reader.result as string).split(",")[1];
                    resolve(base64);
                  };
                  reader.readAsDataURL(file);
                });
                return {
                  name: file.name,
                  type: file.type,
                  mime: file.type,
                  data,
                };
              })
            )
          : undefined;

        const prediction = await flowise.createPrediction({
          chatflowId: config.chatflowId,
          question: message,
          streaming: true,
          uploads,
        });

        for await (const chunk of prediction) {
          if (chunk.event === "token") {
            onMessage?.(chunk.data);
          }
        }

        onFinish?.();
      } catch (error) {
        console.error("Error:", error);
        onError?.(
          error instanceof Error ? error : new Error("An error occurred")
        );
      }
    },
    [config]
  );

  return {
    handleSend,
  };
}
