import { AlertDialogProvider } from "@/components/alert-provider.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertDialogProvider>
      <App />
    </AlertDialogProvider>
  </StrictMode>
);
