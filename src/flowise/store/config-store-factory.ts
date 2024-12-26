import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { FlowiseConfigState } from "./config-store-model";

const DEFAULT_CONFIG = {
  apiKey: "3Krz18_OS2wXNmybaR-ChtmPh_1gYtdUQLtMwGWG3Dw",
  baseUrl: "http://localhost:3000",
  chatflowId: "1fb05d4e-f8f2-4357-89c7-fa0933a809dd",
};

export const createFlowiseConfigStore = () =>
  create<FlowiseConfigState>()(
    immer((set) => ({
      config: DEFAULT_CONFIG,
      setConfig: (config) =>
        set((state) => {
          state.config = config;
        }),
    }))
  );
