import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";
import { useConfigSelector } from "../store/store-provider";

export function FlowiseConfigPane() {
  const config = useConfigSelector("config");
  const setConfig = useConfigSelector("setConfig");
  const paneRef = useRef<Pane | null>(null);

  useEffect(() => {
    // Create pane instance only once
    if (!paneRef.current) {
      paneRef.current = new Pane({
        title: "Flowise Config",
      });
    }

    // Skip if pane is not initialized
    if (!paneRef.current) return;

    // Clear existing bindings
    paneRef.current.dispose();

    // Create new pane with same container
    paneRef.current = new Pane({
      title: "Flowise Config",
    });

    paneRef.current
      .addBinding(
        {
          apiKey: config.apiKey,
        },
        "apiKey"
      )
      .on("change", ({ value }) => {
        setConfig({ ...config, apiKey: value });
      });

    paneRef.current
      .addBinding(
        {
          baseUrl: config.baseUrl,
        },
        "baseUrl"
      )
      .on("change", ({ value }) => {
        setConfig({ ...config, baseUrl: value });
      });

    paneRef.current

      .addBinding(
        {
          chatflowId: config.chatflowId,
        },
        "chatflowId"
      )
      .on("change", ({ value }) => {
        setConfig({ ...config, chatflowId: value });
      });

    return () => {
      if (paneRef.current) {
        paneRef.current.dispose();
        paneRef.current = null;
      }
    };
  }, [config, setConfig]);

  return <div />;
}
