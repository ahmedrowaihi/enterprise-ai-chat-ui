import { FlowiseClient } from "flowise-sdk";
import { useCallback } from "react";

const flowise = new FlowiseClient({
  apiKey: "3Krz18_OS2wXNmybaR-ChtmPh_1gYtdUQLtMwGWG3Dw",
  baseUrl: "http://localhost:3000",
});

export function useFlowiseChat() {
  const handleSend = useCallback(
    async ({
      message,
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

        const prediction = await flowise.createPrediction({
          chatflowId: "1fb05d4e-f8f2-4357-89c7-fa0933a809dd",
          question: message,
          streaming: true,
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
    []
  );

  return {
    handleSend,
  };
}
