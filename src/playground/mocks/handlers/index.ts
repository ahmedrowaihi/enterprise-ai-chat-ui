import { http, HttpResponse } from "msw";

import { eventHandlers } from "./events";
export const handlers = [
  // hello world post
  http.post("/api/hello-world", () => {
    return HttpResponse.json({
      message: "Hello, world!",
    });
  }),
  ...eventHandlers,
];
