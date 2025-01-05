import { useFlowiseChatStore } from "@/flowise/store/flowise-chat-store";
import { useFlowiseStore } from "@/flowise/store/flowise-store";
import { LeadCaptureForm } from "./lead-capture-form";
import { useEffect, useState } from "react";

interface LeadGateProps {
  children: React.ReactNode;
}

export function LeadGate({ children }: LeadGateProps) {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const adapter = useFlowiseChatStore((state) => state.adapter);
  const config = useFlowiseStore((state) => state.config);

  useEffect(() => {
    const checkLeadStatus = async () => {
      if (!adapter || !config.chatflowId) return;

      const chatId = adapter.getChatId();
      if (!chatId) return;

      // Check if we already have a lead for this chat
      const lead = adapter.getLead();

      // If we have a chatId but no lead, show the form
      setShowLeadForm(!lead && !!chatId);
    };

    checkLeadStatus();
  }, [adapter, config.chatflowId]);

  if (!showLeadForm) {
    return <>{children}</>;
  }

  const handleSubmit = async (data: {
    name?: string;
    email?: string;
    phone?: string;
  }) => {
    if (!adapter) return;

    await adapter.saveLead(data);
    setShowLeadForm(false);
  };

  return (
    <div className="ui-flex ui-flex-col ui-gap-4 ui-h-full">
      <div className="ui-flex-1" />
      <LeadCaptureForm
        config={{
          title: "Please provide your contact information to continue",
          name: true,
          email: true,
          phone: true,
          status: true,
          successMessage: "Thank you for your information",
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
