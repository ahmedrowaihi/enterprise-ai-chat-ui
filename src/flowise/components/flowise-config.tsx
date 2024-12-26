import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useConfigSelector } from "../store/store-provider";
import { useState } from "react";
import type { FlowiseConfig } from "../store/config-store-model";

export function FlowiseConfig() {
  const config = useConfigSelector("config");
  const setConfig = useConfigSelector("setConfig");
  const [error, setError] = useState<string | null>(null);

  const handleConfigChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    try {
      const newConfig = JSON.parse(event.target.value) as FlowiseConfig;
      setError(null);
      setConfig(newConfig);
    } catch (err) {
      setError("Invalid JSON configuration");
    }
  };

  return (
    <div className="ui-space-y-4">
      <div className="ui-flex ui-justify-between ui-items-center">
        <h2 className="ui-text-lg ui-font-semibold">Flowise Configuration</h2>
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(config, null, 2));
          }}
        >
          Copy Current Config
        </Button>
      </div>
      <div className="ui-space-y-2">
        <Textarea
          className="ui-font-mono ui-text-sm"
          placeholder="Paste your Flowise configuration here..."
          defaultValue={JSON.stringify(config, null, 2)}
          onChange={handleConfigChange}
          rows={10}
        />
        {error && <p className="ui-text-sm ui-text-destructive">{error}</p>}
      </div>
      <div className="ui-text-sm ui-text-muted-foreground">
        <p>Configuration format:</p>
        <pre className="ui-mt-2 ui-bg-muted ui-p-2 ui-rounded-md">
          {JSON.stringify(
            {
              apiKey: "your-api-key",
              baseUrl: "http://localhost:3000",
              chatflowId: "your-chatflow-id",
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
