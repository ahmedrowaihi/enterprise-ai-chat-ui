import { AlertDialogProvider } from "@/components/alert-provider.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function prepare() {
  if (import.meta.env.VITE_MOCK === "true") {
    const { worker } = await import("./playground/mocks/browser.ts");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}

prepare().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Toaster />
      <AlertDialogProvider>
        <App />
      </AlertDialogProvider>
    </StrictMode>
  );
});
