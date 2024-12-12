interface StreamEventHandlers {
  onWorkflowStarted: (data: any) => void;
  onMessage: (data: any) => void;
  onWorkflowFinished: (data: any) => void;
  onNodeStarted: (data: any) => void;
  onNodeFinished: (data: any) => void;
}

export async function streamEventHandler(
  response: Response,
  handlers: StreamEventHandlers
) {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  async function read() {
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const event = JSON.parse(line.substring(6));

            switch (event.event) {
              case "workflow_started":
                handlers.onWorkflowStarted(event);
                break;
              case "message":
                handlers.onMessage(event);
                break;
              case "workflow_finished":
                handlers.onWorkflowFinished(event.data);
                break;
              case "node_started":
                handlers.onNodeStarted(event.data);
                break;
              case "node_finished":
                handlers.onNodeFinished(event.data);
                break;
            }
          } catch (e) {
            console.error("Error parsing event:", e);
          }
        }
      }
      buffer = lines[lines.length - 1];
    }
  }

  await read();
}
