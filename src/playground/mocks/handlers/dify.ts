import { http, HttpResponse } from "msw";
// import { difyHandler } from "./dify-handler";
// import { basicWorkflowChatbotHandler } from "./events/basic-workflow-chatbot";

import { handlers as eventsHandlers } from "./events";
export const handlers = [
  // hello world post
  http.post("/api/hello-world", () => {
    return HttpResponse.json({
      message: "Hello, world!",
    });
  }),
  ...eventsHandlers,
];
